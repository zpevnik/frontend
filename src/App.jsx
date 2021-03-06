import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import SongEditor from './components/song/SongEditor'
import SongView from './components/song/SongView'
import SongBookEditor from './components/songbook/SongBookEditor'
import SongList from './components/song/SongList'
import SongBookList from './components/songbook/SongBookList'
import Navigation from './components/Navigation'
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import './App.css'
import 'react-select/dist/react-select.css'

const App = inject('store')(observer(class extends Component {

  render() {
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
                  <a href="/"><img src="/static/img/logo.svg" alt="" style={{ width: '40px', marginRight: '10px'}} /></a>
                </div>
                <Navigation />
              </div>
            </nav>
          </div>
          <div className="row">
            <Route exact path="/" component={SongList}/>
            <Route path="/songbook" component={SongBookList} exact/>
            <Route path="/songbook/:id" component={SongBookEditor}/>
            <Route path="/song/:id/edit" component={SongEditor}/>
            <Route exact path="/song/:id" component={SongView}/>
          </div>
        </div>
      </Router>
    )
  }
}))

export default DragDropContext(HTML5Backend)(App)
