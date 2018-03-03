import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { withRouter } from 'react-router'
import Pagination from '../pagination'
import { isSongEditable, getSongsOwnerName } from '../../lib/utils'

const getQueryUrl = query => `?${query.toString()}`

const SongList = withRouter(inject('store')(observer(class extends Component {
  /*constructor(props) {
    super(props)
    this.state = {
      unsavedPromptModal: false
    }
  }*/

  componentDidMount = () => {
    const { store, location } = this.props
    store.isLoaded = false
    store.searchQuery = ''
    const query = new URLSearchParams(location.search)
    const searchQuery = query.get('query')
    const pageQuery = query.get('page')
    const perPageQuery = query.get('per_page')
    store.getInterpreters().then(() => {
      store.getSongs(searchQuery, pageQuery, perPageQuery).then(() => {
        store.songs.forEach(song => {
          if (song.owner && !store.users.find(user => user.id === song.owner)) {
            store.getUsersName(song.owner)
          }
        })
        store.isLoaded = true
      })
    })
    store.getUser()
  }

  componentDidUpdate = newProps => {
    const { store, location } = this.props
    if (newProps.location.search !== location.search) {
      store.isLoaded = false
      const query = new URLSearchParams(location.search)
      const searchQuery = query.get('query')
      const pageQuery = query.get('page')
      const perPageQuery = query.get('per_page')
      store.getSongs(searchQuery, pageQuery, perPageQuery).then(() => {
        store.isLoaded = true
      })
    }
  }

  onSearchSubmit = e => {
    e.preventDefault()
    const { store, location } = this.props
    const query = new URLSearchParams(location.search)
    query.set('query', this.props.store.searchQuery)
    query.set('page', 0)
    this.props.history.push(getQueryUrl(query))
  }

  onEditClick = (e, id) => {
    e.stopPropagation()
    this.props.history.push(`song/${id}/edit`)
  }

  onViewClick = (e, id) => {
    e.stopPropagation()
    this.props.history.push(`song/${id}`)
  }

  onCheckboxClick = (e, id) => {
    e.stopPropagation()
    const { store } = this.props
    store.selectedSongBook.updated = true

    if (e.target.checked)
      store.addSongToSongBook(id)
    else
      store.removeSongFromSongBook(id)
  }

  onSongbookSaveClick = e => {
    e.stopPropagation()
    const { store } = this.props

    this.props.store.addSongsMode = false
    if (store.selectedSongBook.updated) {
      store.updateSongBook()
        .then(() => store.getSongBooks())
        .then(() => {
          this.props.history.push(`songbook/${store.selectedSongBook.id}`)
        })
    } else {
      this.props.history.push(`songbook/${store.selectedSongBook.id}`)
    }
  }

  onSongbookCancelClick = e => {
    e.stopPropagation()
    const { store } = this.props
    /*if (store.selectedSongBook.updated)
      this.setState({'unsavedPromptModal': true})
    else*/
    store.addSongsMode = false
  }

  render() {
    const { store, history, location } = this.props
    const query = new URLSearchParams(location.search)
    const onPageChange = page => {
      query.set('page', page)
      history.push(getQueryUrl(query))
    }

    return (
			<div className="container" style={{ marginTop: '60px' }}>

      {/*<div className="modal" tabindex="-1" role="dialog" style={{display: this.state.unsavedPromptModal ? 'block' : 'none' }}>
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => {
                this.setState({'unsavedPromptModal': false})
              }}>
                <span aria-hidden="true">&times;</span>
              </button>
              <h5 className="modal-title">Neuložené změny</h5>
            </div>
            <div className="modal-body">
              <p>Zpěvník byl editován a některé změny nejsou uložené.</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary" onClick={(e) => {
                this.onSongbookSaveClick(e)
              }}>Uložit změny</button>
              <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={() => {
                this.setState({'unsavedPromptModal': false})
                store.addSongsMode = false
              }}>Odejít bez uložení</button>
            </div>
          </div>
        </div>
      </div>*/}

      <div id="content">
        <div className="row">
          <div className="col-md-12">
            <div className="song-list-header">
              <h4>Písničky</h4>
              <button type="button" className="btn btn-primary" onClick={() => history.push('song/new/edit')}>Přidat novou píseň</button>
            </div>
            {store.addSongsMode &&
              <div className="well">
              <div className="song-list-songbook-control">
                Je editovaný zpěvník <b className="font-weight-bold">{store.selectedSongBook.title}</b>
                <button type="button" className="btn btn-primary pull-right" onClick={e => this.onSongbookSaveClick(e)}>Uložit zpěvník</button>
                <button type="button" className="btn btn-warning pull-right" onClick={e => this.onSongbookCancelClick(e)}>Zrušit</button>
              </div>
              </div>
            }
            <hr />
            <div className="side-by-side clearfix">
              <form onSubmit={this.onSearchSubmit}>
                <div className="input-group">
                  <input
                    className="form-control"
                    id="system-search"
                    name="q"
                    placeholder="Hledej píseň"
                    value={store.searchQuery}
                    onChange={store.onSearchQueryChange} />
                  <span className="input-group-btn">
                    <button
                      type="submit"
                      className="btn btn-default"
                      style={{ height: '34px' }}>
                      <i className="glyphicon glyphicon-search" />
                    </button>
                  </span>
                </div>
              </form>
            </div>
            <br />
            <table className="table table-striped">
              <thead>
                <tr>
                  {store.addSongsMode && <th></th>}
                  <th>#</th>
                  <th>Píseň</th>
                  <th>Interpret</th>
                  <th>Vlastník</th>
                  <th>Akce</th>
                </tr>
              </thead>
              <tbody>
                {!store.isLoaded &&
                  <tr>
                    <td colSpan={5}>Loading...</td>
                  </tr>
                }
                {store.isLoaded && store.songs.map((song, i) => (
									<tr key={song.id} onClick={e => this.onViewClick(e, song.id)} className="list-item">
                    {store.addSongsMode &&
                      <td>
                        <input 
                          className="form-check-input"
                          type="checkbox"
                          defaultChecked={store.selectedSongBook.songs.find(elem => elem.id === song.id) ? "checked" : ""}
                          onClick={(e) => this.onCheckboxClick(e, song.id)} />
                      </td>
                    }
										<td>{i + Number(query.get('page')) * (Number(query.get('per_page')) || 50) + 1}</td>
										<td>{song.title}</td>
                    <td>{song.interpreters.map(interpreterId => store.interpreters.find(inter => inter.id === interpreterId)
                      ? store.interpreters.find(inter => inter.id === interpreterId).name
                      : null).filter(a => a).join(', ')}</td>
                    <td>{getSongsOwnerName(song, store.users)}</td>
										<td className="td-actions">
                      {isSongEditable(song, store.user) &&
                        <a className="btn btn-default btn-xs" onClick={e => this.onEditClick(e, song.id)}>
                          <span className="glyphicon glyphicon-pencil" />
                          {' Upravit'}
                        </a>
                      }
										</td>
									</tr>
								))}
              </tbody>
            </table>

            <Pagination
              lastPage={Math.ceil(Number(store.totalNumberOfFoundItems) / 50) || 1}
              pageSize={Number(query.get('per_page')) || 50}
              page={Number(query.get('page')) || 0}
              onPageChange={onPageChange}
              autoHide={true} />
          </div>
        </div>
      </div>
    </div>
    )
  }
})))

export default SongList
