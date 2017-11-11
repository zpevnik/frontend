import React, { Component } from 'react'
import { withRouter } from 'react-router'
import Select from 'react-select'
import { Creatable } from 'react-select'
import * as lib from './lib'
import { observer, inject } from 'mobx-react'

const SongEditor = inject('store')(observer(class extends Component {

  componentDidMount = () => {
    const { store, match } = this.props
    Promise.all([store.getAuthors(), store.getInterpreters()]).then(() => {
      if(match.params.id !== 'new') {
        store.getSong(match.params.id)
      } else {
        store.clearSong()
      }
    })
    store.getUser()
  }

  onSave = (e, redirect) => {
    e.preventDefault()
    const { store, match } = this.props
    const isNew = match.params.id === 'new'
    store.createSong(isNew).then(() => {
      if (redirect) {
        this.props.history.push('/')
      }
    })
  }

  onSongExport = e => {
    this.props.store.onSongExport(e)
      .then(response => {
        window.location = 'http://zpevnik.skauting.cz/' + response.link
      })
  }

  render() {
    const { store, match } = this.props
    const isNew = match.params.id === 'new'
    // const verseRegex = /\[verse\]([\s\S]*?)\[verse\]/g
    // const chordRegex = /\[(.+?)\]/g
    // const verses = store.selectedSong.text.match(verseRegex)
    //   ? store.selectedSong.text.match(verseRegex).map(verse => verse.replace(/\[verse\]/g, ''))
    //   : []
    // let lines = []
    // verses.forEach(verse => {
    //   lines = lines.concat(verse.split(/[\n\r]/))
    // })
    // const printLines = (lines) => {
    //   let printedLines = []
    //   lines.forEach(line => {
    //     const chords = line.match(chordRegex) ? line.match(chordRegex) : []
    //     if (chords.length > 0) {
    //       printedLines.push(chords.join(' '))
    //     }
    //     printedLines.push(line.replace(chordRegex, ''))
    //   })
    //   return printedLines
    // }
    return (
      <div className="container" style={{ marginTop: '60px' }}>
      <div id="content">
        <div className="row">
          <div className="col-md-8 col-sm-12">
            <h4>{isNew && store.selectedSong.title === ''
              ? 'Nová píseň'
              : store.selectedSong.title}</h4>
            <hr />
            <form>
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Jméno písně:</label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      value={store.selectedSong.title}
                      onChange={e => store.selectedSong.title = e.target.value} />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Interpret:</label>
                    <Creatable
                      multi
                      options={store.interpretersToSelect}
                      value={store.selectedSongInterpretersToSelect}
                      onChange={payload => store.onSongChange('interpreters', payload)}
                      promptTextCreator={label => `Přidat nového interpreta: ${label}`} 
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Autor hudby:</label>
                    <Creatable
                      multi
                      options={store.authorsToSelect}
                      value={store.selectedSongMusicAuthorsToSelect}
                      onChange={payload => store.onSongChange('musicAuthors', payload)}
                      promptTextCreator={label => `Přidat nového autora: ${label}`} 
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Autor textu:</label>
                    <Creatable
                      multi
                      options={store.authorsToSelect}
                      value={store.selectedSongLyricsAuthorsToSelect}
                      onChange={payload => store.onSongChange('lyricsAuthors', payload)}
                      promptTextCreator={label => `Přidat nového autora: ${label}`} 
                    />
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label>Popis písně:</label>
                <textarea
                  className="form-control"
                  rows="4"
                  value={store.selectedSong.description}
                    onChange={payload => store.onSongChange('description', payload)} />
              </div>
              <div className="form-group">
                <label>Píseň:</label>
                <textarea
                  style={{ fontFamily: 'Courier New' }}
                  className="form-control"
                  rows="10"
                  value={store.selectedSong.text}
                  onChange={payload => store.onSongChange('text', payload)} />
              </div>
              <button className="btn btn-default" onClick={e => this.onSave(e, false)} >
                Uložit
              </button>
              <button className="btn btn-default" onClick={e => this.onSave(e, true)}>
                Uložit a odejít
              </button>
              <button className="btn btn-default" onClick={this.onSongExport}>
                Zobrazit v pdf
              </button>
            </form>
          </div>
          <div className="col-md-4 col-sm-12">
            
            <div className="psm">
              <h4>Editor návod</h4>
              <p>
                Editor využívá značky pro tvorbu písniček. 
              </p>
              <ul>
                <li>[C] - akord</li>
                <li>[verse] - sloka</li>
                <li>[chorus] - refrén</li>
                <li>[repetition] - repetice</li>
              </ul>
            </div>

            <hr />

            <div className="psm">
              <h4>Příklad písně</h4>
              <p>
                <b>[verse]</b><br />
                <b>[Dmi]</b>Dávám sbohem <b>[C]</b>břehům prokla<b>[Ami]</b>tejm,<br />
                který <b>[Dmi]</b> v drápech má <b>[C]</b>ďábel <b>[Dmi]</b>sám.<br />

                <b>[verse]</b><br />
                <b>[chorus]</b><br />
                Jen tři <b>[F]</b>kříže z bí<b>[C]</b>lýho kame<b>[Ami]</b>ní<br />
                někdo <b>[Dmi]</b>do písku <b>[C]</b>posklá<b>[Dmi]</b>dal.<br />

                <b>[chorus]</b><br />
                <b>[verse]</b><br />
                První kříž má pod sebou jen hřích, samý pití a rvačka jen.<br />
                ...<br />
                <b>[verse]</b><br />

                <b>[chorus][repetition]</b><br />
                Opakující se refrén..... <br />
                <b>[chorus][repetition]</b>
              </p>
            </div>

            {/* <h4>Náhled písně</h4>
            <hr />
            <div style={{ whiteSpace: 'pre', fontFamily: 'Courier New' }}>
              {printLines(lines).join('\n')}
            </div> */}

            
          </div>
        </div>
      </div>
    </div>
      // <div id="content">
      //   <div className="row-fluid" style={{ marginTop: '10px' }}>
      //     <span>{store.user.name} </span>
      //     <a href={store.user.logout_link}>Logout</a>
      //   </div>
      //   <div className="row">
      //     <div className="col-md-6 col-sm-12">
      //       <div className="psm">
      //         <h4>Editace písně</h4>
      //         <form>
      //           <div className="form-group">
      //             <label htmlFor="name">Název písně:</label>
      //             <Creatable
      //               id="name"
      //               options={lib.mapSongsToSelect(store.songs)}
      //               value={store.selectedSong.id}
      //               onChange={store.onSongSelect}
      //               onNewOptionClick={store.onNewSongTitle}
      //               clearable={false}
      //               placeholder="Název písně..."
      //               promptTextCreator={label => `Vytvořit novou píseň: ${label}`}
      //               autoBlur />
      //           </div>
      //         </form>
      //       </div>

      //       <hr />
      //       <div className="psm">
      //         <form>
      //           <div className="form-group">
      //             <label htmlFor="interpreter">Interpret:</label>
      //             <Select
      //               id="interpreter"
      //               multi
      //               options={lib.mapAuthorsToSelect(store.authors)}
      //               value={store.selectedSong.interpreters.slice()}
      //               onChange={payload => store.onSongChange('interpreters', payload)}
      //               disabled={!store.isSongSelected} />
      //           </div>

      //           <div className="form-group">
      //             <label htmlFor="text">Píseň:</label>
      //             <textarea
      //               id="text"
      //               className="form-control"
      //               rows={10}
      //               value={store.selectedSong.text}
      //               onChange={e => store.onSongChange('text', e)}
      //               disabled={!store.isSongSelected} />
      //           </div>
                
      //           <div className="form-group">
      //             <label htmlFor="music">Autor hudby:</label>
      //             <Select
      //               id="music"
      //               multi
      //               options={lib.mapAuthorsToSelect(store.authors)}
      //               value={store.selectedSong.authors.music.slice()}
      //               onChange={payload => store.onSongChange('musicAuthors', payload)}
      //               disabled={!store.isSongSelected} />
      //           </div>

      //           <div className="form-group">
      //             <label htmlFor="lyrics">Autor textu:</label>
      //             <Select
      //               id="lyrics"
      //               multi
      //               options={lib.mapAuthorsToSelect(store.authors)}
      //               value={store.selectedSong.authors.lyrics.slice()}
      //               onChange={payload => store.onSongChange('lyricsAuthors', payload)}
      //               disabled={!store.isSongSelected} />
      //           </div>

      //           <button onClick={store.onSongSave} className="btn btn-default" disabled={!store.isSongSelected}>
      //             Uložit píseň
      //           </button>
      //           <button onClick={store.onSongExport} className="btn btn-default" disabled={!store.isSongSelected}>
      //             Exportovat píseň
      //           </button>
      //         </form>
      //       </div>
      //     </div>
      //     {/*<div className="col-md-4 col-sm-12">
            // <div className="psm">
            //   <h4>Editor návod</h4>
            //   <p>Editor zatím nepodporuje vše - umí ale přidávat autory a editovat písně. V levo se přidávají jakýkoliv lidé - ať je to autor hudby, autor textu, nebo interpret. V případě, že se jedná například o název kapely, vyplň pouze jméno a příjmení nech prázdné</p>
            //   <p>Píseň je nejprve třeba vytvořit (vytvoř píseň) a poté se dá vybrat v editoru a editovat. Měnit se může jméno, interpret a hlavně text a akordy samotné. Důležití jsou pro nás i autoři hudby a autoři textu, takže pokud je znáš, určitě nám pomohou.</p>
            //   <p></p>
            //   <hr />
            //   <p>
            //     Editor využívá značky pro tvorbu písniček. 
            //   </p>
            //   <ul>
            //     <li>[C] - akord</li>
            //     <li>## - začátek sloky</li>
            //     <li>** - začátek refrénu</li>
            //     <li>*** - opakování refrénu</li>
            //     <li>| - začátek repetice</li>
            //     <li>|| - konec repetice</li>
            //     <li>||{5} - konec repetice s daným množstvím opakování</li>
            //     <li>&gt; - začátek mluveného slova</li>
            //     <li>&lt; - konec mluveného slova</li>
            //   </ul>
            // </div>

            // <hr />

            // <div className="psm">
            //   <h4>Příklad písně</h4>
            //   <p>
            //     <b>##</b><br />
            //     <b>[Dmi]</b>Dávám sbohem <b>[C]</b>břehům prokla<b>[Ami]</b>tejm,<br />
            //     který <b>[Dmi]</b> v drápech má <b>[C]</b>ďábel <b>[Dmi]</b>sám.<br />

            //     <b>**</b><br />
            //     Jen tři <b>[F]</b>kříže z bí<b>[C]</b>lýho kame<b>[Ami]</b>ní<br />
            //     někdo <b>[Dmi]</b>do písku <b>[C]</b>posklá<b>[Dmi]</b>dal.<br />

            //     <b>##</b><br />
            //     První kříž má pod sebou jen hřích, samý pití a rvačka jen.<br />

            //     <b>***</b><br />

            //     <b>></b>Vím, trestat je lidský, ale odpouštět božský.<b></b><br />

            //     <b>|</b> Opakující se refrén..... <b>||{2}</b>
            //   </p>
            // </div>
      //     </div>*/}
      //   </div>
      // </div>
    )
  }
}))

export default withRouter(SongEditor)
