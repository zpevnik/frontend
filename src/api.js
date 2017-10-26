const myHeaders = new Headers()
myHeaders.append('Content-Type', 'application/json')
myHeaders.append('Accept', 'application/json')

const exportHeaders = new Headers()
exportHeaders.append('Content-Type', 'application/pdf')
exportHeaders.append('Accept', 'application/pdf')

export default class Api {

  apiUrl = 'http://zpevnik.skauting.cz/api/v1'
  // apiUrl = 'https://zpevnik-test.herokuapp.com/api/v1'

  fetch = (endpoint, options, query) => {
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
          if (response.status !== 204) {
            return response.json()
          } else {
            return
          }
        }
        // return response.json()
        throw new Error('Network response was not ok.')
      })
  }

  // function for pdf export
  exportFetch = (endpoint, options) => (
    fetch(`${this.apiUrl}/${endpoint}`, { headers: exportHeaders, mode: 'cors', cache: 'default', credentials: 'include', ...options })
      .then(response => {
        if(response.ok) {
          return response.text();
        }
        throw new Error('Network response was not ok.')
      })
  )

  getAuthors = () => {
    return this.fetch('authors')
      .catch(error => {
        console.log('There has been a problem with your fetch operation: ' + error.message)
      })
  }

  getInterpreters = () => {
    return this.fetch('interpreters')
      .catch(error => {
        console.log('There has been a problem with your fetch operation: ' + error.message)
      })
  }

  getUser = () => {
    return this.fetch('user')
      .catch(error => {
        console.log('There has been a problem with your fetch operation: ' + error.message)
      })
  }

  getSongs = (query, page, perPage) => {
    return this.fetch(`songs`, null, {
      query,
      page,
      'per_page': perPage
    })
      .catch(error => {
        console.log('There has been a problem with your fetch operation: ' + error.message)
      })
  }

  getSongBooks = (query, page, perPage) => {
    return this.fetch(`songbooks`, null, {
      query,
      page,
      'per_page': perPage
    })
      .catch(error => {
        console.log('There has been a problem with your fetch operation: ' + error.message)
      })
  }

  getSong = songId => {
    return this.fetch(`songs/${songId}`)
      .catch(error => {
        console.log('There has been a problem with your fetch operation: ' + error.message)
      })
  }

  getUsersName = userId => {
    return this.fetch(`users/${userId}`)
      .catch(error => {
        console.log('There has been a problem with your fetch operation: ' + error.message)
      })
  }

  getSongBook = songBookId => {
    return this.fetch(`songbooks/${songBookId}`)
      .catch(error => {
        console.log('There has been a problem with your fetch operation: ' + error.message)
      })
  }

  exportSong = songId => {
    return this.exportFetch(`songs/${songId}`)
      .catch(error => {
        console.log('There has been a problem with your fetch operation: ' + error.message)
      })
  }

  createAuthor = name => {
    console.log('Sending ', name)
    return this.fetch('authors', { method: 'POST', body: JSON.stringify({ name }) })
      // .catch(error => {
      //   console.log('There has been a problem with your fetch operation: ' + error.message)
      // })
  }

  createInterpreter = name => {
    console.log('Sending ', name)
    return this.fetch('interpreters', { method: 'POST', body: JSON.stringify({ name }) })
      // .catch(error => {
      //   console.log('There has been a problem with your fetch operation: ' + error.message)
      // })
  }

  deleteAuthor = id => {
    return this.fetch(`authors/${id}`, { method: 'DELETE' })
  }

  createSong = song => {
    return this.fetch('songs', { method: 'POST', body: JSON.stringify(song) })
      // .catch(error => {
      //   console.log('There has been a problem with your fetch operation: ' + error.message)
      // })
  }

  createSongBook = title => {
    return this.fetch('songbooks', { method: 'POST', body: JSON.stringify({ title }) })
      // .catch(error => {
      //   console.log('There has been a problem with your fetch operation: ' + error.message)
      // })
  }

  updateSong = (songId, song) => {
    return this.fetch(`songs/${songId}`, { method: 'PUT', body: JSON.stringify(song) })
      // .catch(error => {
      //   console.log('There has been a problem with your fetch operation: ' + error.message)
      // })
  }

  updateSongBook = (songBookId, songBookTitle) => {
    return this.fetch(`songbooks/${songBookId}`, { method: 'PUT', body: JSON.stringify({ title: songBookTitle }) })
      // .catch(error => {
      //   console.log('There has been a problem with your fetch operation: ' + error.message)
      // })
  }

  updateSongsInSongBook = (songs, songBookId) => {
    return this.fetch(`songbooks/${songBookId}/songs`, { method: 'PUT', body: JSON.stringify(songs) })
      // .catch(error => {
      //   console.log('There has been a problem with your fetch operation: ' + error.message)
      // })
  }

  removeSongFromSongBook = (songId, songBookId) => {
    return this.fetch(`songbooks/${songBookId}/song/${songId}`, { method: 'DELETE' })
  }
}