import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { BrowserRouter as Router, Route, NavLink, withRouter } from 'react-router-dom'
import SongEditor from './components/song/SongEditor'
import SongBookEditor from './components/songbook/SongBookEditor'
import SongList from './components/song/SongList'
import SongBookList from './components/songbook/SongBookList'
import Navigation from './components/Navigation'
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
                <Navigation />
              </div>
            </nav>
          </div>
          <div className="row">
            <Route exact path="/" component={SongList}/>
            <Route path="/songbook" component={SongBookList} exact/>
            <Route path="/songbook/:id" component={SongBookEditor}/>
            <Route path="/song/:id" component={SongEditor}/>
          </div>
        </div>
      </Router>
    )
  }
}))

export default App
