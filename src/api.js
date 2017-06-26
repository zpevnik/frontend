const myHeaders = new Headers()
myHeaders.append('Content-Type', 'application/json')
myHeaders.append('Accept', 'application/json')

const exportHeaders = new Headers()
exportHeaders.append('Content-Type', 'application/pdf')
exportHeaders.append('Accept', 'application/pdf')

export default class Api {

  apiUrl = 'https://zpevnik-test.herokuapp.com/api/v1'

  fetch = (endpoint, options) => (
    fetch(`${this.apiUrl}/${endpoint}`, { headers: myHeaders, mode: 'cors', cache: 'default', credentials: 'include', ...options })
      .then(response => {
        if(response.ok) {
          return response.json()
        }
        // return response.json()
        throw new Error('Network response was not ok.')
      })
  )

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

  getUser = () => {
    return this.fetch('user')
      .catch(error => {
        console.log('There has been a problem with your fetch operation: ' + error.message)
      })
  }

  getSongs = () => {
    return this.fetch('songs')
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

  exportSong = songId => {
    return this.exportFetch(`songs/${songId}`)
      .catch(error => {
        console.log('There has been a problem with your fetch operation: ' + error.message)
      })
  }

  createAuthor = (firstname, surname) => {
    return this.fetch('authors', { method: 'POST', body: JSON.stringify({ firstname, surname }) })
      .catch(error => {
        console.log('There has been a problem with your fetch operation: ' + error.message)
      })
  }

  createSong = title => {
    return this.fetch('songs', { method: 'POST', body: JSON.stringify({ title }) })
      .catch(error => {
        console.log('There has been a problem with your fetch operation: ' + error.message)
      })
  }

  updateSong = (songId, song) => {
    return this.fetch(`songs/${songId}`, { method: 'PUT', body: JSON.stringify(song) })
      .catch(error => {
        console.log('There has been a problem with your fetch operation: ' + error.message)
      })
  }
}