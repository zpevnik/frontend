import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import Select from 'react-select'
import { NavLink } from 'react-router-dom'
import { withRouter } from 'react-router'

const Navigation = withRouter(inject('store')(observer(class extends Component {

  componentDidMount = () => {
    const { store, location } = this.props
    const query = new URLSearchParams(location.search)
    const searchQuery = query.get('query')
    const pageQuery = query.get('page')
    const perPageQuery = query.get('per_page')
    store.getSongBooks(searchQuery, pageQuery, perPageQuery)
    store.getUser()
  }

  render() {
    const { store } = this.props
    return (
			<div id="navbar" className="navbar-collapse collapse">
				<ul className="nav navbar-nav">
					<li><NavLink exact to="/" activeClassName="active" className="navlink">Písně</NavLink></li>
					<li><NavLink to="/songbook" activeClassName="active" className="navlink">Zpěvníky</NavLink></li>
				</ul>
				<ul className="nav navbar-nav navbar-right">
					<li><a>{store.user.name}</a></li>
					<li><a href={store.user.logoutLink}>odhlásit</a></li>
				</ul>
			</div>
    )
  }
})))

export default Navigation
