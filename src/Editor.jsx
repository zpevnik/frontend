import React, { Component } from 'react'
import Select from 'react-select';
import * as lib from './lib'
import { observer, inject } from 'mobx-react'

const Editor = inject('store')(observer(class extends Component {

  componentDidMount = () => {
    const { store } = this.props
    store.getAuthors()
    store.getSongs()
    store.getUser()
  }

  render() {
    const { store } = this.props
    
    return (
      <div id="content">
        <div className="row-fluid" style={{ marginTop: '10px' }}>
          <span>{store.user.name} </span>
          <a href={ store.user.logout_link }>Logout</a>
        </div>
        <div className="row">
          <div className="col-md-4 col-sm-12">
            <div className="psm">
              <h4>Vytvořit autora</h4>
              <form>
                <div className="form-group">
                  <label htmlFor="name">Jméno:</label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    value={store.inputs.addAuthorName}
                    onChange={e => store.onAddInputChange('addAuthorName', e)} />
                </div>
                <div className="form-group">
                  <label htmlFor="surname">Příjmení (optional):</label>
                  <input
                    type="text"
                    className="form-control"
                    id="surname"
                    value={store.inputs.addAuthorSurname}
                    onChange={e => store.onAddInputChange('addAuthorSurname', e)} />
                </div>
                <button className="btn btn-default" onClick={store.createAuthor}>
                    Vytvořit autora
                </button>
              </form>
            </div>

            <hr />

            <div className="psm">
              <h4>Vytvořit píseň</h4>
              <form>
                <div className="form-group">
                  <label htmlFor="name">Jméno:</label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    value={store.inputs.addSongTitle}
                    onChange={e => store.onAddInputChange('addSongTitle', e)} />
                </div>
                <button className="btn btn-default" onClick={store.createSong}>
                  Vytvořit píseň
                </button>
              </form>
            </div>
          </div>

          <div className="col-md-4 col-sm-12">
            <div className="psm">
              <h4>Editace písně</h4>
              <form>
                <div className="form-group">
                  <label htmlFor="name">Vybrat píseň:</label>
                  <Select
                    id="name"
                    options={lib.mapSongsToSelect(store.songs)}
                    value={store.selectedSong.id}
                    onChange={store.onSongSelect} />
                </div>
              </form>
            </div>

            <hr />
            <div className="psm">
              <form>
                <div className="form-group">
                  <label htmlFor="name">Jméno písně:</label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    onChange={e => store.onSongChange('title', e)}
                    value={store.selectedSong.title}
                    disabled={!store.isSongSelected} />
                </div>

                <div className="form-group">
                  <label htmlFor="interpreter">Interpret:</label>
                  <Select
                    id="interpreter"
                    multi
                    options={lib.mapAuthorsToSelect(store.authors)}
                    value={store.selectedSong.interpreters.slice()}
                    onChange={payload => store.onSongChange('interpreters', payload)}
                    disabled={!store.isSongSelected} />
                </div>

                <div className="form-group">
                  <label htmlFor="text">Píseň:</label>
                  <textarea
                    id="text"
                    className="form-control"
                    rows={10}
                    value={store.selectedSong.text}
                    onChange={e => store.onSongChange('text', e)}
                    disabled={!store.isSongSelected} />
                </div>
                
                <div className="form-group">
                  <label htmlFor="music">Autor hudby:</label>
                  <Select
                    id="music"
                    multi
                    options={lib.mapAuthorsToSelect(store.authors)}
                    value={store.selectedSong.authors.music.slice()}
                    onChange={payload => store.onSongChange('musicAuthors', payload)}
                    disabled={!store.isSongSelected} />
                </div>

                <div className="form-group">
                  <label htmlFor="lyrics">Autor textu:</label>
                  <Select
                    id="lyrics"
                    multi
                    options={lib.mapAuthorsToSelect(store.authors)}
                    value={store.selectedSong.authors.lyrics.slice()}
                    onChange={payload => store.onSongChange('lyricsAuthors', payload)}
                    disabled={!store.isSongSelected} />
                </div>

                <button onClick={store.onSongSave} className="btn btn-default" disabled={!store.isSongSelected}>
                  Uložit píseň
                </button>
                <button onClick={store.onSongExport} className="btn btn-default" disabled={!store.isSongSelected}>
                  Exportovat píseň
                </button>
              </form>
            </div>
          </div>
          <div className="col-md-4 col-sm-12">
            <div className="psm">
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
            </div>

            <hr />

            <div className="psm">
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
}))

export default Editor
