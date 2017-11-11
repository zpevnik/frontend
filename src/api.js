const myHeaders = new Headers()
myHeaders.append('Content-Type', 'application/json')
myHeaders.append('Accept', 'application/json')

const exportHeaders = new Headers()
exportHeaders.append('Content-Type', 'application/pdf')
exportHeaders.append('Accept', 'application/pdf')

const toastr = window.toastr

export default class Api {

  apiUrl = 'http://zpevnik.skauting.cz/api/v1'
  // apiUrl = 'https://zpevnik-test.herokuapp.com/api/v1'

  fetch = (endpoint, options, query, toast) => {
    let queryUrl
    if (query) {
      const esc = encodeURIComponent
      queryUrl = Object.keys(query)
      .filter(param => query[param])
      .map(param => esc(param) + '=' + esc(query[param]))
      .join('&');
    }
    return fetch(`${this.apiUrl}/${endpoint}${query && queryUrl ? '?' + queryUrl : ''}`, { headers: myHeaders, mode: 'cors', cache: 'default', credentials: 'include', ...options })
      .then(response => {
        if(response.ok) {
          if(toast) {
            toastr.success(toast)
          }
          if (response.status !== 204) {
            return response.json()
          } else {
            return
          }
        }
        // return response.json()
        throw new Error('Network response was not ok.')
      })
      .catch(error => {
        console.error(error.message)
        toastr.error(error.message)
        throw error
      })
  }

  // function for pdf export
  exportFetch = (endpoint, options) => (
    fetch(`${this.apiUrl}/${endpoint}`, { headers: exportHeaders, mode: 'cors', cache: 'default', credentials: 'include', ...options })
      .then(response => {
        if(response.ok) {
          return response.json();
        }
        throw new Error('Network response was not ok.')
      })
      .catch(error => {
        console.error(error.message)
        toastr.error(error.message)
        throw error
      })
  )

  getAuthors = () => {
    return this.fetch('authors')
  }

  getInterpreters = () => {
    return this.fetch('interpreters')
  }

  getUser = () => {
    return this.fetch('user')
  }

  getSongs = (query, page, perPage) => {
    return this.fetch(`songs`, null, {
      query,
      page,
      'per_page': perPage
    })
  }

  getSongBooks = (query, page, perPage) => {
    return this.fetch(`songbooks`, null, {
      query,
      page,
      'per_page': perPage
    })
  }

  getSong = songId => {
    return this.fetch(`songs/${songId}`)
  }

  getUsersName = userId => {
    return this.fetch(`users/${userId}`)
  }

  getSongBook = songBookId => {
    return this.fetch(`songbooks/${songBookId}`)
  }

  exportSong = songId => {
    return this.exportFetch(`songs/${songId}`)
  }

  exportSongBook = songBookId => {
    return this.exportFetch(`songbooks/${songBookId}`)
  }

  createAuthor = name => {
    console.log('Sending ', name)
    return this.fetch('authors', { method: 'POST', body: JSON.stringify({ name }) }, undefined, 'Author created successfully')
  }

  createInterpreter = name => {
    console.log('Sending ', name)
    return this.fetch('interpreters', { method: 'POST', body: JSON.stringify({ name }) }, undefined, 'Interpreter created successfully')
  }

  deleteAuthor = id => {
    return this.fetch(`authors/${id}`, { method: 'DELETE' })
  }

  createSong = song => {
    return this.fetch('songs', { method: 'POST', body: JSON.stringify(song) }, undefined, 'Song created successfully')
  }

  createSongBook = title => {
    return this.fetch('songbooks', { method: 'POST', body: JSON.stringify({ title }) }, undefined, 'Songbook created successfully')
  }

  updateSong = (songId, song) => {
    return this.fetch(`songs/${songId}`, { method: 'PUT', body: JSON.stringify(song) }, undefined, 'Song updated successfully')
  }

  updateSongBook = (songBookId, songBookTitle) => {
    return this.fetch(`songbooks/${songBookId}`, { method: 'PUT', body: JSON.stringify({ title: songBookTitle }) }, undefined, 'Songbook updated successfully')
  }

  updateSongsInSongBook = (songs, songBookId) => {
    return this.fetch(`songbooks/${songBookId}/songs`, { method: 'PUT', body: JSON.stringify(songs) }, undefined, 'Songbook updated successfully')
  }

  removeSongFromSongBook = (songId, songBookId) => {
    return this.fetch(`songbooks/${songBookId}/song/${songId}`, { method: 'DELETE' }, undefined, 'Songbook updated successfully')
  }
}