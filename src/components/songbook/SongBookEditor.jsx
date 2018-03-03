import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { withRouter } from 'react-router'
import EditInfoBar from '../EditInfoBar'
import { isSongEditable } from '../../lib/utils'

const SongBookEditor = withRouter(inject('store')(observer(class extends Component {

  componentDidMount = () => {    
		const { store, match } = this.props
    store.isLoaded = false
    store.exportStatus = null
    store.exportLink = null
    Promise.all([store.getAuthors(), store.getInterpreters()]).then(() => {
			return store.getSongs()
		}).then(() => {
      if (!store.songBookEditMode) {
        store.getSongBook(match.params.id).then(() => {
          store.isLoaded = true
        })
      } else {
        store.isLoaded = true
      }
    })
    store.getUser()
  }

  onSongBookExport = e => {
    this.props.store.onSongBookExport()
  }

  render() {
    const { store, history } = this.props

    if (!store.isLoaded) {
      return <div style={{ marginTop: '60px' }}>Loading...</div>
    }

    return (
			<div className="container" style={{ marginTop: '60px' }}>
      <div id="content">
        <div className="row">
          <div className="col-md-12">
            <div className="song-list-header">
              <h4>{store.selectedSongBook.title}</h4>
            </div>
            <hr />
            <EditInfoBar />
            {store.songBookEditMode ? (
              <div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Jméno zpěvníku:</label>
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        value={store.selectedSongBook.title}
                        onChange={e => {
                          store.selectedSongBook.title = e.target.value
                          store.selectedSongBook.updated = true
                        }} />
                    </div>
                  </div>
                </div>
                <button className="btn btn-default" onClick={() => history.push('/')}>
                  Přidat písně
                </button>
              </div>
            ) : (
              <div>
                <button className="btn btn-default" onClick={() => store.songBookEditMode = true}>
                  Editovat zpěvník
                </button>
                <button className="btn btn-default" onClick={this.onSongBookExport}>
                  Exportovat do pdf
                </button>

                {store.exportStatus &&
                  <span>
                    {store.exportStatus === 'loading' &&
                      <span className="alert alert-primary" style={{ padding: '7px 15px' }}>Zpěvník se připravuje...</span>
                    }
                    {store.exportStatus === 'failed' &&
                      <span className="alert alert-danger" style={{ padding: '7px 15px' }}>Zpěvník se nepodařilo zkompilovat.</span>
                    }
                    {store.exportStatus === 'loaded' &&
                      <span className="alert alert-success" style={{ padding: '7px 15px' }}>Zpěvník je připraven! Stáhnout jej můžeš
                        <a target="_blank" rel="noopener noreferrer" href={store.exportLink}> zde</a>
                      </span>
                    }
                  </span>
                }
              </div>
            )}

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
									return !song ? null : (
                    <tr key={song.id}>
                      <td>{i + 1}</td>
                      <td>{song.title}</td>
                      <td>{song.interpreters.map(interpreterId => store.interpreters.find(inter => inter.id === interpreterId).name).join(', ')}</td>
                      <td className="td-actions">
                        <a className="btn btn-default btn-xs" onClick={() => history.push(`/song/${song.id}`)}>
                          <span className="glyphicon glyphicon-pencil" />
                          {' Zobrazit'}
                        </a>
                        {isSongEditable(song, store.user) &&
                          <a className="btn btn-default btn-xs" onClick={() => history.push(`/song/${song.id}/edit`)}>
                            <span className="glyphicon glyphicon-pencil" />
                            {' Upravit'}
                          </a>
                        }
                        {store.songBookEditMode &&
                          <a className="btn btn-default btn-xs" onClick={() => {
                            store.selectedSongBook.updated = true
                            store.removeSongFromSongBook(song.id)
                          }}>
                            <span className="glyphicon glyphicon-delete" />
                            {' Odebrat'}
                          </a>
                        }
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
