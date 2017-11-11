import { extendObservable, toJS } from 'mobx'
import Api from './api'
import * as lib from './lib'

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

const emptySongBook = { 
  title: '',
  songs: [],
  owner: ''
}

export class Store {
  constructor (props) {
    extendObservable(this, {
      newSongMode: false,
      selectedSong: emptySong,
      selectedSongBook: emptySongBook,
      activeSongBook: emptySongBook,
      user: {},
      authors: [],
      interpreters: [],
      songs: [],
      songBooks: [],
      users: [],
      searchQuery: '',
      get isSongSelected() {
        return Boolean(this.selectedSong.id)
      },
      get authorsToSelect() {
        return this.authors.map(author => (
          {
            value: author.id,
            label: author.name
          }
        ))
      },
      get interpretersToSelect() {
        return this.interpreters.map(interpreter => (
          {
            value: interpreter.id,
            label: interpreter.name
          }
        ))
      },
      get songBooksToSelect() {
        return this.songBooks.map(songBook => (
          {
            value: songBook.id,
            label: songBook.title
          }
        ))
      },
      get selectedSongInterpretersToSelect() {
        return this.selectedSong.interpreters.map(interpreter => ({
          value: interpreter.id,
          label: interpreter.name
        }))
      },
      get selectedSongMusicAuthorsToSelect() {
        return this.selectedSong.authors.music.map(author => ({
          value: author.id,
          label: author.name
        }))
      },
      get selectedSongLyricsAuthorsToSelect() {
        return this.selectedSong.authors.lyrics.map(author => ({
          value: author.id,
          label: author.name
        }))
      },
      get activeSongBookToSelect() {
        return this.activeSongBook.id
      }
    })
  }

  onSearchQueryChange = e => {
    this.searchQuery = e.target.value
  }

  onAddInputChange = (name, event) => {
    this.inputs[name] = event.target.value
  }

  onSongChange = (name, payload) => {
    if (name === 'title' || name === 'text' || name === 'description') {
      this.selectedSong[name] = payload.target.value
    } else if (name === 'interpreters') {
      this.selectedSong[name] = payload.map(item => ({
        id: item.value,
        name: item.label
      }))
    } else if (name === 'musicAuthors') {
      this.selectedSong.authors.music = payload.map(item => ({
        id: item.value,
        name: item.label
      }))
    } else if (name === 'lyricsAuthors') {
      this.selectedSong.authors.lyrics = payload.map(item => ({
        id: item.value,
        name: item.label
      }))
    }
  }

  createAuthor = name => {
    return api.createAuthor(name)
  }

  createSong = isNew => {
    const newAuthors = this.selectedSong.authors.music.filter(person => person.id === person.name)
      .concat(this.selectedSong.authors.lyrics.filter(person => person.id === person.name))
      .map(person => person.name )
      .filter((person, i, arr) => arr.indexOf(person) === i)
    
    const newInterpreters = this.selectedSong.interpreters.filter(person => person.id === person.name)
      .map(person => person.name )

    const newAuthorsPromises = newAuthors.map(name => api.createAuthor(name))
    const newInterpretersPromises = newInterpreters.map(name => api.createInterpreter(name))

    return Promise.all(newAuthorsPromises.concat(newInterpretersPromises)).then(body => {
      return Promise.all([this.getAuthors(), this.getInterpreters()])
    }).then(() => {
      const mapNewlyCreatedAuthors = author => {
        if (newAuthors.includes(author.name)) {
          return { name: author.name, id: this.authors.find(author2 => author2.name === author.name).id }
        } else {
          return author
        }
      }
      const mapNewlyCreatedInterpreters = interpreter => {
        if (newInterpreters.includes(interpreter.name)) {
          return { name: interpreter.name, id: this.interpreters.find(interpreter2 => interpreter2.name === interpreter.name).id }
        } else {
          return interpreter
        }
      }
      this.selectedSong.authors.music = this.selectedSong.authors.music.map(mapNewlyCreatedAuthors)
      this.selectedSong.authors.lyrics = this.selectedSong.authors.lyrics.map(mapNewlyCreatedAuthors)
      this.selectedSong.interpreters = this.selectedSong.interpreters.map(mapNewlyCreatedInterpreters)
      
      const newSong = toJS(this.selectedSong)
      newSong.authors.music = newSong.authors.music.map(author => author.id)
      newSong.authors.lyrics = newSong.authors.lyrics.map(author => author.id)
      newSong.interpreters = newSong.interpreters.map(interpreter => interpreter.id)
      if (isNew) {
        return api.createSong(newSong)
      } else {
        return api.updateSong(newSong.id, newSong)
      }
    }).catch(error => {
      console.log('Oh no, there was problem with your request: ', error)
    })
  }

  createSongBook = isNew => {
    if (isNew) {
      return api.createSongBook(this.selectedSongBook.title)
    } else {
      return api.updateSongBook(this.selectedSongBook.id, this.selectedSongBook.title)
    }
  }

  addSongToSongBook = songId => {
    return api.updateSongsInSongBook(this.activeSongBook.songs.concat([{ id: songId }]), this.activeSongBook.id)
      .then(() => {
        this.activeSongBook.songs.push({ id: songId })
      })
  }

  removeSongFromSongBook = songId => {
    return api.removeSongFromSongBook(songId, this.selectedSongBook.id)
      .then(() => {
        this.selectedSongBook.songs = this.selectedSongBook.songs.filter(song => song.id !== songId)
      }) 
  }

  getAuthors = () => {
    return api.getAuthors().then(authors => {
      this.authors = authors || []
      return authors
      })
  }

  getInterpreters = () => {
    return api.getInterpreters().then(interpreters => {
      this.interpreters = interpreters || []
      return interpreters
      })
  }

  getSongs = (query, page, perPage) => {
    return api.getSongs(query, page, perPage).then(songs => {
      this.songs = songs || []
      return songs
      })
  }

  getSongBooks = (query, page, perPage) => {
    return api.getSongBooks(query, page, perPage).then(songBooks => {
      this.songBooks = songBooks || []
      return songBooks
      })
  }

  getSong = id => {
    const mapAuthorsIdsToFullObject = authorId => (
      this.authors.find(author => author.id === authorId)
    )
    const mapInterpretersIdsToFullObject = interpreterId => (
      this.interpreters.find(interpreter => interpreter.id === interpreterId)
    )
    return api.getSong(id).then(song => {
      const mappedSong = song
      mappedSong.authors.music = mappedSong.authors.music.map(mapAuthorsIdsToFullObject)
      mappedSong.authors.lyrics = mappedSong.authors.lyrics.map(mapAuthorsIdsToFullObject)
      mappedSong.interpreters = mappedSong.interpreters.map(mapInterpretersIdsToFullObject)
      this.selectedSong = mappedSong
    })
  }

  getSongBook = id => {
    return api.getSongBook(id).then(songBook => {
      this.selectedSongBook = songBook
    })
  }

  getUser = () => {
    api.getUser().then(user => {
      if (user) {
        this.user = { ...user, activeSongbook: user['active_songbook'], lastLogin: user['last_login'], logoutLink: user['logout_link'] }
      }
      })
  }

  clearSong = () => {
    this.selectedSong = emptySong
  }

  clearSongBook = () => {
    this.selectedSongBook = emptySongBook
  }

  onSongSelect = payload => {
    if (payload.value) {
      this.selectedSong = {
        ...emptySong,
        ...this.songs.filter(song => song.id === payload.value)[0]
      }
    }
  }

  onSongSave = e => {
    e.preventDefault()
    api.updateSong(this.selectedSong.id, lib.convertSongToJson(this.selectedSong)).then(data => {
      this.getSongs()
      this.getAuthors()
    })
    this.clearSong()
  }

  onSongExport = e => {
    e.preventDefault()
    return api.exportSong(this.selectedSong.id)
  }

  onSongBookExport = e => {
    e.preventDefault()
    return api.exportSongBook(this.selectedSongBook.id)
  }

  onNewSongTitle = ({ label }) => {
    if (!this.newSongMode) {
      this.newSongMode = true
      const newSong = {...emptySong, title: label, id: Math.floor(Math.random()*10000)}
      this.songs.push(newSong)
      this.selectedSong = newSong
    } else {
      this.songs[this.songs.length - 1].title = label
      this.selectedSong = this.songs[this.songs.length - 1]
    }
  }

  onNewSongAuthor = ({ label }) => {
    if (!this.newSongMode) {

    } else {
      this.songs[this.songs.length - 1].title = label
      this.selectedSong = this.songs[this.songs.length - 1]
    }
  }

  setActiveSongBook = songBookId => {
    this.activeSongBook = this.songBooks.find(songBook => songBook.id === songBookId)
  }

  getUsersName = userId => {
    return api.getUsersName(userId).then(body => {
      this.users.push({ id: userId, name: body.name })
    })
  }
}