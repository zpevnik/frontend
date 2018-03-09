import { extendObservable, toJS } from 'mobx'
import Api from '../lib/api'
import { convertSongToJson } from '../lib/utils'

const api = new Api()
const toastr = window.toastr

const emptySong = { 
  title: '',
  text: '',
  description: '',
  interpreters: [],
  authors: {
    music: [],
    lyrics: []
  },
  visibility: 2,
  edit_perm: 2
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
      songBookEditMode: false,
      user: {},
      authors: [],
      interpreters: [],
      isLoaded: false,
      exportStatus: null,
      exportLink: null,
      songs: [],
      songBooks: [],
      users: [],
      searchQuery: '',
      lastRequestId: 0,
      totalNumberOfFoundItems: null,
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
        return this.selectedSong.interpreters
          .filter(a => a)
          .map(interpreter => ({
            value: interpreter.id,
            label: interpreter.name
          }))
      },
      get selectedSongMusicAuthorsToSelect() {
        return this.selectedSong.authors.music
          .filter(a => a)
          .map(author => ({
            value: author.id,
            label: author.name
          }))
      },
      get selectedSongLyricsAuthorsToSelect() {
        return this.selectedSong.authors.lyrics
          .filter(a => a)
          .map(author => ({
            value: author.id,
            label: author.name
          }))
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
    } else if (name === 'visibility' || name === 'edit_perm'){
      this.selectedSong[name] = payload.value
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
        const id = this.authors.find(author2 => author2.name === author.name)
          ? this.authors.find(author2 => author2.name === author.name).id
          : null
        if (newAuthors.includes(author.name)) {
          return { name: author.name, id }
        } else {
          return author
        }
      }
      const mapNewlyCreatedInterpreters = interpreter => {
        const id = this.interpreters.find(interpreter2 => interpreter2.name === interpreter.name)
        ? this.interpreters.find(interpreter2 => interpreter2.name === interpreter.name).id
        : null
        if (newInterpreters.includes(interpreter.name)) {
          return { name: interpreter.name, id }
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
    }).catch(this.catchError)
  }

  catchError = error => {
    toastr.error('Jejda, někde je problém: ', error)
  }

  createSongBook = name => {
    return api.createSongBook(name)
  }

  updateSongBook = () => {
    return api.updateSongBook(this.selectedSongBook.id, this.selectedSongBook)
  }

  addSongToSongBook = songId => {
    if (!this.selectedSongBook.songs.find(song => song.id === songId)) {
      this.selectedSongBook.songs.push({ id: songId })
    }
  }

  reorderSongsInSongBook = (draggedSongId, droppedSongId) => {
    const draggedSong = this.selectedSongBook.songs.find(song => song.id === draggedSongId)
    const droppedSong = this.selectedSongBook.songs.find(song => song.id === droppedSongId)
    const draggedSongOrder = draggedSong.order
    const droppedSongOrder = droppedSong.order
    if ((!draggedSongOrder && draggedSongOrder !== 0) || (!droppedSongOrder && droppedSongOrder !== 0) || draggedSongOrder === droppedSongOrder) {
      return
    }
    this.selectedSongBook.updated = true
    if (draggedSongOrder > droppedSongOrder) {
      this.selectedSongBook.songs = this.selectedSongBook.songs.map(song => {
        if (song.id === draggedSongId) {
          return { ...song, order: droppedSongOrder + 1 }
        } else if (song.order > droppedSongOrder && song.order < draggedSongOrder) {
          return { ...song, order: song.order + 1 }
        } else {
          return song
        }
      })
    } else if (draggedSongOrder < droppedSongOrder) {
      this.selectedSongBook.songs = this.selectedSongBook.songs.map(song => {
        if (song.id === draggedSongId) {
          return { ...song, order: droppedSongOrder}
        } else if (song.order > draggedSongOrder && song.order <= droppedSongOrder) {
          return { ...song, order: song.order - 1 }
        } else {
          return song
        }
      })
    }
  }

  removeSongFromSongBook = songId => {
    this.selectedSongBook.songs = this.selectedSongBook.songs.filter(song => song.id !== songId)
  }

  getAuthors = () => {
    return api.getAuthors().then(authors => {
      this.authors = authors || []
      return authors
      })
      .catch(this.catchError)
  }

  getInterpreters = () => {
    return api.getInterpreters().then(interpreters => {
      this.interpreters = interpreters || []
      return interpreters
      })
      .catch(this.catchError)
  }

  getSongs = (query, page, perPage) => {
    perPage = perPage || 50
    this.lastRequestId += 1
    const requestId = this.lastRequestId
    return api.getSongs(query, page, perPage).then(songsData => {
      this.songs = songsData.data || []
      if (requestId === this.lastRequestId) {
        this.totalNumberOfFoundItems = songsData.count
      }
      return songsData.data
      })
      .catch(this.catchError)
  }

  getSongBooks = (query, page, perPage) => {
    perPage = perPage || 50
    this.lastRequestId += 1
    const requestId = this.lastRequestId
    return api.getSongBooks(query, page, perPage).then(songBooksData => {
      this.songBooks = songBooksData.data || []
      if (requestId === this.lastRequestId) {
        this.totalNumberOfFoundItems = songBooksData.count
      }
      return songBooksData.data
      })
      .catch(this.catchError)
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
    .catch(this.catchError)
  }

  getSongBook = id => {
    return api.getSongBook(id).then(songBook => {
      this.selectedSongBook = songBook
    })
    .catch(this.catchError)
  }

  getUser = () => {
    api.getUser().then(user => {
      if (user) {
        this.user = { ...user, lastLogin: user['last_login'], logoutLink: user['logout_link'] }
      }
      })
      .catch(this.catchError)
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
    api.updateSong(this.selectedSong.id, convertSongToJson(this.selectedSong)).then(data => {
      this.getSongs()
      this.getAuthors()
    })
    .catch(this.catchError)
    this.clearSong()
  }

  onSongExport = e => {
    e && e.preventDefault()
    this.exportStatus = 'loading'
    return api.exportSong(this.selectedSong.id).then(response => {
      this.exportLink = 'http://zpevnik.skauting.cz/' + response.link
      this.exportStatus = 'loaded'
    }).catch(err => {
      this.exportStatus = 'failed'
      this.catchError(err)
    })
  }

  onSongBookExport = (id) => {
    this.exportStatus = 'loading'
    return api.exportSongBook(id ? id : this.selectedSongBook.id).then(response => {
      this.exportLink = 'http://zpevnik.skauting.cz/' + response.link
      this.exportStatus = 'loaded'
    }).catch(err => {
      this.exportStatus = 'failed'
      this.catchError(err)
    })
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

  deleteSongBook = songBookId => {
    return api.deleteSongBook(songBookId)
      .then(songBooksData => {
        this.songBooks = this.songBooks.filter(songBook => songBook.id !== songBookId)
      })
  }

  getUsersName = userId => {
    return api.getUsersName(userId).then(body => {
      this.users.push({ id: userId, name: body.name })
    })
  }
}