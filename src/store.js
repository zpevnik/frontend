import { extendObservable } from 'mobx'
import Api from './api'
import * as lib from './lib'

const api = new Api()

const emptySong = { 
  title: '',
  text: '',
  interpreters: [],
  authors: { 
    music: [],
    lyrics: []
  }
}

export class Store {
  constructor (props) {
    extendObservable(this, {
      inputs: {
        addAuthorName: '',
        addAuthorSurname: '',
        addSongTitle: ''
      },
      selectedSong: emptySong,
      user: {},
      authors: [],
      songs: [],
      get isSongSelected() {
        return Boolean(this.selectedSong.id)
      }
    })
  }

  onAddInputChange = (name, event) => {
    this.inputs[name] = event.target.value
  }

  onSongChange = (name, payload) => {
    if (name === 'title' || name === 'text') {
      this.selectedSong[name] = payload.target.value
    } else if (name === 'interpreters') {
      this.selectedSong[name] = payload.map(person => person.value)
    } else if (name === 'musicAuthors') {
      this.selectedSong.authors.music = payload.map(person => person.value)
    } else if (name === 'lyricsAuthors') {
      this.selectedSong.authors.lyrics = payload.map(person => person.value)
    }
  }

  createAuthor = e => {
    e.preventDefault()
    api.createAuthor(this.inputs.addAuthorName, this.inputs.addAuthorSurname)
      .then(data => {
        this.getAuthors()
        this.inputs.addAuthorName = ''
        this.inputs.addAuthorSurname = ''
      })
  }

  createSong = e => {
    e.preventDefault()
    api.createSong(this.inputs.addSongTitle)
      .then(data => {
        this.getSongs()
        this.inputs.addSongTitle = ''
      })
  }

  getAuthors = () => {
    api.getAuthors().then(authors => {
      this.authors = authors || []
      })
  }

  getSongs = () => {
    api.getSongs().then(songs => {
      this.songs = songs || []
      })
  }

  getUser = () => {
    api.getUser().then(user => {
      this.user = user || {}
      })
  }

  clearSong = () => {
    this.selectedSong = emptySong
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
    e.preventDefault();
    api.exportSong(this.selectedSong.id).then(file => {
      window.open(file);
    })
  }
}