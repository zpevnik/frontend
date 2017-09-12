import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { withRouter } from 'react-router'

const getQueryUrl = query => `/?${query.toString()}`

const SongList = withRouter(inject('store')(observer(class extends Component {

  componentDidMount = () => {
    const { store, location } = this.props
    const query = new URLSearchParams(location.search)
    const searchQuery = query.get('query')
    const pageQuery = query.get('page')
    const perPageQuery = query.get('per_page')
    store.getInterpreters().then(() => {
      store.getSongs(searchQuery, pageQuery, perPageQuery)
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
      store.getSongs(searchQuery, pageQuery, perPageQuery)
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

  render() {
    const { store, history, location } = this.props
    const query = new URLSearchParams(location.search)
    const onPaginationClick = type => {
      switch (type) {
        case 'prev':
          if(query.get('page') && query.get('page') !== '0') {
            query.set('page', `${query.get('page') - 1}`)
            history.push(getQueryUrl(query))
          }
          break;
        case 'next':
          query.set('page', `${Number(query.get('page')) + 1}`)
          history.push(getQueryUrl(query))
          break;
      }
    }
    return (
			<div className="container" style={{ marginTop: '60px' }}>
      <div id="content">
        <div className="row">
          <div className="col-md-12">
            <div className="song-list-header">
              <h4>Písničky</h4>
              <button type="button" className="btn btn-primary" onClick={() => history.push('song/new')}>Přidat novou píseň</button>
            </div>
            <hr />
            <div className="side-by-side clearfix">
              <form onSubmit={this.onSearchSubmit}>
                <div className="input-group">
                  <input
                    className="form-control"
                    id="system-search"
                    name="q"
                    placeholder="Search for"
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
                  <th>Píseň</th>
                  <th>Interpret</th>
                  <th>Akce</th>
                </tr>
              </thead>
              <tbody>
                {store.songs.map((song, i) => (
									<tr key={song.id}>
										<td>{i + Number(query.get('page')) * 30 + 1}</td>
										<td>{song.title}</td>
										{/* <td>{song.authors.map(author => author.name).join(', ')}</td> */}
										<td>{song.interpreters.map(interpreterId => store.interpreters.find(inter => inter.id === interpreterId).name).join(', ')}</td>
										<td className="td-actions">
											<a className="btn btn-default btn-xs" onClick={() => history.push(`song/${song.id}`)}>
												<span className="glyphicon glyphicon-pencil" />
												{' Upravit'}
											</a>
											{/* <a className="btn btn-default btn-xs" >
												<span className="glyphicon glyphicon-search" />
												Add to songbook
											</a> */}
										</td>
									</tr>
								))}
              </tbody>
            </table>

            <ul className="pagination">
              <li><a onClick={e => onPaginationClick('prev')}>Prev</a></li>
              {/* <li><a >1</a></li>
              <li><a >2</a></li>
              <li><a >3</a></li>
              <li><a >4</a></li>
              <li><a >5</a></li> */}
              <li><a onClick={e => onPaginationClick('next')}>Next</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    )
  }
})))

export default SongList
