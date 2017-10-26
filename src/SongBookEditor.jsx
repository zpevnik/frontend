import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { withRouter } from 'react-router'

const SongBookEditor = withRouter(inject('store')(observer(class extends Component {

  componentDidMount = () => {    
		const { store, match } = this.props
    Promise.all([store.getAuthors(), store.getInterpreters()]).then(() => {
			return store.getSongs()
		}).then(() => {
      if(match.params.id !== 'new') {
        store.getSongBook(match.params.id)
      } else {
        store.clearSongBook()
      }
    })
    store.getUser()
  }

  onSave = (e, redirect) => {
    e.preventDefault()
    const { store, match } = this.props
    const isNew = match.params.id === 'new'
    store.createSongBook(isNew).then(() => {
      if (redirect) {
        this.props.history.push('/songbook')
      }
    })
  }

  render() {
    const { store, history } = this.props
    return (
			<div className="container" style={{ marginTop: '60px' }}>
      <div id="content">
        <div className="row">
          <div className="col-md-12">
            <div className="song-list-header">
              <h4>{store.selectedSongBook.title || 'Nový zpěvník'}</h4>
            </div>
            <hr />
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label>Jméno zpěvníku:</label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    value={store.selectedSongBook.title}
                    onChange={e => store.selectedSongBook.title = e.target.value} />
                </div>
              </div>
            </div>
            <button className="btn btn-default" onClick={e => this.onSave(e, false)} >
              Uložit
            </button>
            <button className="btn btn-default" onClick={e => this.onSave(e, true)}>
              Uložit a odejít
            </button>


            <br />
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Píseň</th>
                  <th>Interpret</th>
                  <th>Akce</th>
                </tr>
              </thead>
              <tbody>
                {store.selectedSongBook.songs.map((songIdObject, i) => {
                  const song = store.songs.find(song => song.id === songIdObject.id)
									return (
                    <tr key={song.id}>
                      <td>{i}</td>
                      <td>{song.title}</td>
                      {/* <td>{song.authors.map(author => author.name).join(', ')}</td> */}
                      <td>{song.interpreters.map(interpreterId => store.interpreters.find(inter => inter.id === interpreterId).name).join(', ')}</td>
                      <td className="td-actions">
                        <a className="btn btn-default btn-xs" onClick={() => history.push(`/song/${song.id}`)}>
                          <span className="glyphicon glyphicon-pencil" />
                          {' Upravit'}
                        </a>
                        <a className="btn btn-default btn-xs" onClick={() => store.removeSongFromSongBook(song.id)}>
                          <span className="glyphicon glyphicon-delete" />
                          {' Odebrat'}
                        </a>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    )
  }
})))

export default SongBookEditor
