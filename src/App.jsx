import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { BrowserRouter as Router, Route, NavLink, withRouter } from 'react-router-dom'
import Editor from './Editor'
import SongList from './SongList'
import Songbook from './Songbook'
import './App.css'

const App = inject('store')(observer(class extends Component {

  render() {
    const { store } = this.props
    return (
      <Router>
        <div className="container">
          <div className="row">
            <nav className="navbar navbar-default navbar-fixed-top">
              <div className="container">
                <div className="navbar-header">
                  <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                    <span className="sr-only">Toggle navigation</span>
                    <span className="icon-bar"></span>
                    <span className="icon-bar"></span>
                    <span className="icon-bar"></span>
                  </button>
                  <a href="#"><img src="/img/logo.svg" style={{ width: '40px', marginRight: '10px'}} /></a>
                </div>
                <div id="navbar" className="navbar-collapse collapse">
                  <ul className="nav navbar-nav">
                    <li><NavLink exact to="/" activeClassName="active" className="navlink">Písně</NavLink></li>
                    {/* <li><NavLink to="/" activeClassName="active" className="navlink">Zpěvníky</NavLink></li>
                    <li><NavLink to="/" activeClassName="active" className="navlink">Autoři</NavLink></li> */}
                  </ul>
                  <ul className="nav navbar-nav navbar-right">
                    <li style={{ minWidth: '200px', padding: '8px 15px' }}>
                      <select className="form-control" disabled="disabled">
                        <option>Kuldův zpěvník</option>
                        <option>Jiný střediskový zpěvník</option>
                      </select>
                    </li>
                    <li><a>{store.user.name}</a></li>
                    <li><a href={store.user.logoutLink}>odhlásit</a></li>
                  </ul>
                </div>
              </div>
            </nav>
          </div>
          <div className="row">
            <Route exact path="/" component={SongList}/>
            <Route path="/songbook" component={Songbook}/>
            <Route path="/song/:id" component={Editor}/>
          </div>
        </div>
      </Router>
    )
  }
}))

export default App
