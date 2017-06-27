import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { BrowserRouter as Router, Route, NavLink, withRouter } from 'react-router-dom'
import Editor from './Editor'
import Songbook from './Songbook'
import './App.css'

const App = inject('store')(observer(class extends Component {

  render() {
    return (
      <Router>
        <div className="container">
          <div className="row">
            <nav className="navbar navbar-default">
              <div className="container-fluid">
                <div className="navbar-header">
                  <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
                    <span className="sr-only">Navigace</span>
                    <span className="icon-bar"></span>
                    <span className="icon-bar"></span>
                    <span className="icon-bar"></span>
                  </button>
                </div>
                <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                  <ul className="nav navbar-nav">
                    <li><NavLink exact to="/" activeClassName="active" className="navlink">Editor písní</NavLink></li>
                    <li><NavLink to="/songbook" activeClassName="active" className="navlink">Zpěvníky</NavLink></li>
                  </ul>
                </div>
              </div>
            </nav>
          </div>
          <div className="row">
            <Route exact path="/" component={Editor}/>
            <Route path="/songbook" component={Songbook}/>
          </div>
        </div>
      </Router>
    )
  }
}))

export default App
