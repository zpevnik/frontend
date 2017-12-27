import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import Pagination from '../pagination'

const getQueryUrl = query => `?${query.toString()}`

const SongBookList = inject('store')(observer(class extends Component {

  componentDidMount = () => {
    const { store, location } = this.props
    store.searchQuery = ''
    const query = new URLSearchParams(location.search)
    const searchQuery = query.get('query')
    const pageQuery = query.get('page')
    const perPageQuery = query.get('per_page')
    store.getSongBooks(searchQuery, pageQuery, perPageQuery).then(() => {
      store.songBooks.map(songBook => songBook.owner)
        .filter((owner, i, arr) => arr.indexOf(owner) === i)
        .forEach(owner => store.getUsersName(owner))
    })
    store.getUser()
  }

  componentDidUpdate = newProps => {
    const { store, location } = this.props
    if (newProps.location.search !== location.search) {
      const query = new URLSearchParams(location.search)
      const searchQuery = query.get('query')
      const pageQuery = query.get('page')
      const perPageQuery = query.get('per_page')
      store.getSongBooks(searchQuery, pageQuery, perPageQuery)
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

  onSongBookExport = id => {
    this.props.store.onSongBookExport(id)
      .then(response => {
        window.open('http://zpevnik.skauting.cz/' + response.link, '_blank')
      })
  }

  render () {
    const { store, history, location } = this.props
    const query = new URLSearchParams(location.search)
    const onPageChange = page => {
      query.set('page', page)
      history.push(getQueryUrl(query))
    }

    const getOwnersName = ownerId => {
      const user = store.users.find(user => user.id === ownerId)
      return user ? user.name : ''
    }

    return (
      <div className="container" style={{ marginTop: '60px' }}>
      <div id="content">
        <div className="row">
          <div className="col-md-12">
            <div className="song-list-header">
              <h4>Zpěvníky</h4>
              <button type="button" className="btn btn-primary" onClick={() => history.push('songbook/new')}>Vytvořit nový zpěvník</button>
            </div>
            <hr />
            <div className="side-by-side clearfix">
              <form onSubmit={this.onSearchSubmit}>
                <div className="input-group">
                  <input
                    className="form-control"
                    id="system-search"
                    name="q"
                    placeholder="Hledej zpěvník..."
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
                  <th>#</th>
                  <th>Zpěvník</th>
                  <th>Autor</th>
                  <th>Akce</th>
                </tr>
              </thead>
              <tbody>
                {store.songBooks.map((songBook, i) => (
									<tr key={songBook.id}>
										<td>{i + Number(query.get('page')) * (Number(query.get('per_page')) || 50) + 1}</td>
										<td>{songBook.title}</td>
										{/* <td>{songBook.authors.map(author => author.name).join(', ')}</td> */}
										<td>{getOwnersName(songBook.owner)}</td>
										<td className="td-actions">
											<a className="btn btn-default btn-xs" onClick={() => history.push(`songbook/${songBook.id}`)}>
												<span className="glyphicon glyphicon-pencil" />
												{' Upravit'}
											</a>
                      <a className="btn btn-default btn-xs" onClick={() => store.setActiveSongBook(songBook.id)}>
												<span className="glyphicon glyphicon-pencil" />
												{' Nastavit jako aktivní zpěvník'}
											</a>
                      <a className="btn btn-default btn-xs" onClick={() => this.onSongBookExport(songBook.id)}>
												<span className="glyphicon glyphicon-pencil" />
												{' Export do pdf'}
											</a>
										</td>
									</tr>
								))}
              </tbody>
            </table>

            <Pagination
              lastPage={Math.ceil(Number(store.totalNumberOfFoundItems) / 50) || 1}
              pageSize={Number(query.get('per_page')) || 50}
              page={Number(query.get('page')) || 0}
              onPageChange={onPageChange} />
          </div>
        </div>
      </div>
    </div>
    )
  }
}))

export default SongBookList