import { extendObservable, toJS } from 'mobx'
import Api from './lib/api'
import { convertSongToJson } from '../../lib/utils'

const api = new Api()

const emptySong = { 
  title: '',
  text: '',
  description: '',
  interpreters: [],
  authors: {
    music: [],
    lyrics: []
  }
}

export class Song {
  constructor (store, _song) {
		const song = { ...emptySong, ..._song }
    extendObservable(this, {
			...song,
			store
    })
  }

  change = (name, payload) => {
    if (name === 'title' || name === 'text' || name === 'description') {
      this[name] = payload.target.value
    } else if (name === 'interpreters') {
      this[name] = payload.map(item => ({
        id: item.value,
        name: item.label
      }))
    } else if (name === 'musicAuthors') {
      this.authors.music = payload.map(item => ({
        id: item.value,
        name: item.label
      }))
    } else if (name === 'lyricsAuthors') {
      this.authors.lyrics = payload.map(item => ({
        id: item.value,
        name: item.label
      }))
    }
  }

	toJson = () => {
		const song = toJS(this)
		song.authors.music = song.authors.music.map(author => author.id)
		song.authors.lyrics = song.authors.lyrics.map(author => author.id)
		song.interpreters = song.interpreters.map(interpreter => interpreter.id)
		return song
	}

	createNewPeople = () => {
		const newAuthors = this.authors.music.filter(person => person.id === person.name)
			.concat(this.authors.lyrics.filter(person => person.id === person.name))
			.map(person => person.name)
			.filter((person, i, arr) => arr.indexOf(person) === i)
		
		const newInterpreters = this.selectedSong.interpreters.filter(person => person.id === person.name)
			.map(person => person.name)

		if (newAuthors.length === 0 && newInterpreters.length === 0) {
			return Promise.resolve()
		}

		const newAuthorsPromises = newAuthors.map(name => api.createAuthor(name))
		const newInterpretersPromises = newInterpreters.map(name => api.createInterpreter(name))

		return Promise.all(newAuthorsPromises.concat(newInterpretersPromises)).then(body => {
			return Promise.all([Promise.resolve(newAuthors), this.store.getAuthors(), this.store.getInterpreters()])
		})
	}

	updateNewPeople = (newAuthors) => {
		const mapNewlyCreatedAuthors = author => {
			const id = this.store.authors.find(author2 => author2.name === author.name)
				? this.authors.find(author2 => author2.name === author.name).id
				: null
			if (newAuthors.includes(author.name)) {
				return id
			} else {
				return author
			}
		}
		const mapNewlyCreatedInterpreters = interpreter => {
			const id = this.store.interpreters.find(interpreter2 => interpreter2.name === interpreter.name)
			? this.interpreters.find(interpreter2 => interpreter2.name === interpreter.name).id
			: null
			if (newInterpreters.includes(interpreter.name)) {
				return { name: interpreter.name, id }
			} else {
				return interpreter
			}
		}
		this.authors.music = this.authors.music.map(mapNewlyCreatedAuthors)
		this.authors.lyrics = this.authors.lyrics.map(mapNewlyCreatedAuthors)
		this.interpreters = this.interpreters.map(mapNewlyCreatedInterpreters)
	}

  post = isNew => {
    this.createNewPeople().then(([newAuthors]) => { //TODO move this
      this.updateNewPeople(newAuthors)
      
      const song = this.toJson()
      if (isNew) {
        return api.createSong(song)
      } else {
        return api.updateSong(song.id, song)
      }
    }).catch(error => {
      console.log('Oh no, there was problem with your request: ', error)
    })
  }

  addToSongbook = songbookId => { //TODO change this
    return api.updateSongsInSongbook(this.activeSongBook.songs.concat([{ id: songId }]), this.activeSongBook.id)
      .then(() => {
        this.activeSongBook.songs.push({ id: songId })
      })
  }

  removeSongFromSongBook = songId => { //TODO change this
    return api.removeSongFromSongBook(songId, this.selectedSongBook.id)
      .then(() => {
        this.selectedSongBook.songs = this.selectedSongBook.songs.filter(song => song.id !== songId)
      }) 
  }

  select = () => {
		this.store.selectedSong = this
	}

  export = () => {
    return api.exportSong(this.id)
  }
}
