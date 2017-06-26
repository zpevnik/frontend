import React, { Component } from 'react'
import Select from 'react-select';
import Api from './api'
import { mapAuthorsToSelect, mapSongsToSelect } from './lib'
import './App.css'

const api = new Api()

class App extends Component {

  state = {
    songChords: '',
    addSongTitle: '',
    allAuthors: [],
    songAuthors: [],
    addAuthorName: '',
    addAuthorSurname: '',
    allSongs: [],
    selectedSong: { authors: {} },
    interpret: '',
    userInfo: {},
    disabled: false
  }

  componentDidMount = () => {
    this.getAllAuthors()
    this.getAllSongs()
    this.getUser()
  }

  /* add song functions */
  onAddSongTitleChange = e => {
    this.setState({
      addSongTitle: e.target.value
    })
  }

  /* add author functions */
  onAddAuthorNameChange = e => {
    this.setState({
      addAuthorName: e.target.value
    })
  }

  onAddAuthorSurnameChange = e => {
    this.setState({
      addAuthorSurname: e.target.value
    })
  }

  /* edit song functions */
  onSongTitleChange = e => {
    this.setState({
      selectedSong: {...this.state.selectedSong, title: e.target.value }
    })
  }

  onSongChordsChange = e => {
    this.setState({
      selectedSong: {...this.state.selectedSong, text: e.target.value }
    })
  }

  onInterpreterChange = value => {
    this.setState({
      selectedSong: {...this.state.selectedSong, interpreters: value.map(it => it.value) }
    })
  }

  onMusicAuthorChange = value => {
    this.setState({
      selectedSong: {...this.state.selectedSong, authors: { ...this.state.selectedSong.authors, music: value.map(it => it.value) } }
    })
  }

  onLyricsAuthorChange = value => {
    this.setState({
      selectedSong: {...this.state.selectedSong, authors: { ...this.state.selectedSong.authors, lyrics: value.map(it => it.value) } }
    })
  }


  createAuthor = e => {
    e.preventDefault();
    api.createAuthor(this.state.addAuthorName, this.state.addAuthorSurname)
      .then(data => {
        this.getAllAuthors()
        this.setState({
          addAuthorSurname: '',
          addAuthorName: ''
        })
      })
  }

  createSong = e => {
    e.preventDefault();
    api.createSong(this.state.addSongTitle)
      .then(data => {
        this.getAllSongs()
        this.setState({ addSongTitle: ''})
      })
  }

  getAllAuthors = () => {
    api.getAuthors().then(authors => {
      this.setState({
        allAuthors: mapAuthorsToSelect(authors)
      })
    })
  }

  getAllSongs = () => {
    api.getSongs().then(songs => {
      this.setState({
        allSongs: songs
      })
    })
  }

  getUser = () => {
    api.getUser().then(user => {
      this.setState({
        userInfo: user
      })
    })
  }

  getSong = songId => {
    api.getSong(songId).then(song => {
      this.setState({
        selectedSong: song
      })
    })
  }

  clearSong = () => {
    this.setState({
      selectedSong: {title: '', text: '', authors: {}}
    })
  }

  onSelectedSongChange = songId => {
    this.clearSong();
    if (songId != null)
      this.getSong(songId.value);
  }

  saveSong = e => {
    e.preventDefault();
    api.updateSong(this.state.selectedSong.id, this.state.selectedSong.title, this.state.selectedSong.text,
      this.state.selectedSong.authors.music, this.state.selectedSong.authors.lyrics, this.state.selectedSong.interpreters);
    this.clearSong();
  }

  exportSong = e => {
    e.preventDefault();
    api.exportSong(this.state.selectedSong.id).then(file => {
      console.log(file);
      window.open(file);
    })
  }

  render() {
    console.log(this.state)
    return (
      <div className="container">
        <div id="content">
          <div className="row-fluid" style={{ marginTop: '10px' }}>
            <span>{this.state.userInfo.name} </span>
            <a href={ this.state.userInfo.logout_link }>Logout</a>
          </div>
          <div className="row">
            <div className="col-md-4 col-sm-12">
              <h4>Vytvořit autora</h4>
              <form>
                <div className="form-group">
                  <label htmlFor="name">Jméno:</label>
                  <input type="text" className="form-control" id="name" value={this.state.addAuthorName} onChange={this.onAddAuthorNameChange} />
                </div>
                <div className="form-group">
                  <label htmlFor="surname">Příjmení (optional):</label>
                  <input type="text" className="form-control" id="surname" value={this.state.addAuthorSurname} onChange={this.onAddAuthorSurnameChange} />
                </div>
                <button type="submit" className="btn btn-default" onClick={this.createAuthor}>Vytvořit autora</button>
              </form>

              <hr />

              <h4>Vytvořit píseň</h4>
              <form>
                <div className="form-group">
                  <label htmlFor="name">Jméno:</label>
                  <input type="text" className="form-control" id="name" value={this.state.addSongTitle} onChange={this.onAddSongTitleChange} />
                </div>
                <button className="btn btn-default" onClick={this.createSong}>Vytvořit píseň</button>
              </form>
            </div>

            <div className="col-md-4 col-sm-12">
              <h4>Editace písně</h4>
              <form>
                <div className="form-group">
                  <label htmlFor="name">Vybrat píseň:</label>
                  <Select id="name" options={mapSongsToSelect(this.state.allSongs)} value={this.state.selectedSong.id} onChange={this.onSelectedSongChange} />
                </div>
              </form>

              <hr />

              <form>
                <div className="form-group">
                  <label htmlFor="name">Jméno písně:</label>
                  <input type="text" className="form-control" id="name" onChange={this.onSongTitleChange} value={this.state.selectedSong.title} disabled={!this.state.selectedSong.id} />
                </div>

                <div className="form-group">
                  <label htmlFor="interpreter">Interpret:</label>
                  <Select id="interpreter" multi options={this.state.allAuthors} value={this.state.selectedSong.interpreters} onChange={this.onInterpreterChange} disabled={!this.state.selectedSong.id} />
                </div>

                <div className="form-group">
                  <label htmlFor="text">Píseň:</label>
                  <textarea
                    disabled={!this.state.selectedSong.id}
                    value={this.state.selectedSong.text}
                    onChange={this.onSongChordsChange}
                    className="form-control"
                    rows={10}
                    id="text" />
                </div>
                
                <div className="form-group">
                  <label htmlFor="music">Autor hudby:</label>
                  <Select id="music" multi options={this.state.allAuthors} value={this.state.selectedSong.authors.music} onChange={this.onMusicAuthorChange} disabled={!this.state.selectedSong.id} />
                </div>

                <div className="form-group">
                  <label htmlFor="lyrics">Autor textu:</label>
                  <Select id="lyrics" multi options={this.state.allAuthors} value={this.state.selectedSong.authors.lyrics} onChange={this.onLyricsAuthorChange} disabled={!this.state.selectedSong.id} />
                </div>

                <button onClick={this.saveSong} className="btn btn-default" disabled={!this.state.selectedSong.id}>Uložit píseň</button>
                <button onClick={this.exportSong} className="btn btn-default" disabled={!this.state.selectedSong.id}>Exportovat píseň</button>
              </form>
            </div>
            <div className="col-md-4 col-sm-12">
              <h4>Editor návod</h4>
              <p>Editor zatím nepodporuje vše - umí ale přidávat autory a editovat písně. V levo se přidávají jakýkoliv lidé - ať je to autor hudby, autor textu, nebo interpret. V případě, že se jedná například o název kapely, vyplň pouze jméno a příjmení nech prázdné</p>
              <p>Píseň je nejprve třeba vytvořit (vytvoř píseň) a poté se dá vybrat v editoru a editovat. Měnit se může jméno, interpret a hlavně text a akordy samotné. Důležití jsou pro nás i autoři hudby a autoři textu, takže pokud je znáš, určitě nám pomohou.</p>
              <p></p>
              <hr />
              <p>
                Editor využívá značky pro tvorbu písniček. 
              </p>
                <ul>
                  <li>[C] - akord</li>
                  <li>## - začátek sloky</li>
                  <li>** - začátek refrénu</li>
                  <li>*** - opakování refrénu</li>
                  <li>| - začátek repetice</li>
                  <li>|| - konec repetice</li>
                  <li>||{5} - konec repetice s daným množstvím opakování</li>
                  <li>&gt; - začátek mluveného slova</li>
                  <li>&lt; - konec mluveného slova</li>
                </ul>
              <hr />
              <h4>Příklad písně</h4>
              <p>
                <b>##</b><br />
                <b>[Dmi]</b>Dávám sbohem <b>[C]</b>břehům prokla<b>[Ami]</b>tejm,<br />
                který <b>[Dmi]</b> v drápech má <b>[C]</b>ďábel <b>[Dmi]</b>sám.<br />

                <b>**</b><br />
                Jen tři <b>[F]</b>kříže z bí<b>[C]</b>lýho kame<b>[Ami]</b>ní<br />
                někdo <b>[Dmi]</b>do písku <b>[C]</b>posklá<b>[Dmi]</b>dal.<br />

                <b>##</b><br />
                První kříž má pod sebou jen hřích, samý pití a rvačka jen.<br />

                <b>***</b><br />

                <b>></b>Vím, trestat je lidský, ale odpouštět božský.<b></b><br />

                <b>|</b> Opakující se refrén..... <b>||{2}</b>
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default App
