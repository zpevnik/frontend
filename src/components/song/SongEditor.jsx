import React, { Component } from 'react'
import { withRouter } from 'react-router'
import Select from 'react-select'
import { Creatable } from 'react-select'
import { observer, inject } from 'mobx-react'
import { isSongEditable } from '../../lib/utils'

const SongEditor = withRouter(inject('store')(observer(class extends Component {

  constructor(props) {
    super(props)
    this.state = {
      shiftChords: false,
      mollChords: false
    }
  }

  componentDidMount = () => {
    const { store, match } = this.props
    store.isLoaded = false
    store.exportStatus = null
    store.exportLink = null
    Promise.all([store.getAuthors(), store.getInterpreters(), store.getUser()]).then(() => {
      if(match.params.id !== 'new') {
        store.getSong(match.params.id).then(() => {
          store.isLoaded = true
        })
      } else {
        store.clearSong()
        store.isLoaded = true
      }
    })
    document.addEventListener("keydown", this.onKeyDown, false)
    document.addEventListener("keyup", this.onKeyUp, false)
  }

  componentWillUnmount(){
    document.removeEventListener("keydown", this.onKeyDown, false)
    document.removeEventListener("keyup", this.onKeyUp, false)
  }

  onKeyDown = event => {
    if (event.keyCode === 16)
      this.setState({"shiftChords": !this.state.shiftChords})
    else if (event.keyCode === 17)
      this.setState({"mollChords": !this.state.mollChords})
  }

  componentDidUpdate = newProps => {
    const { store, match, location } = this.props
    if (location.pathname !== newProps.location.pathname) {
      store.isLoaded = false
      store.getSong(match.params.id).then(() => {
        store.isLoaded = true
      })
    }
  }

  onSave = (e, redirect) => {
    e.preventDefault()
    const { store, match } = this.props
    const isNew = match.params.id === 'new'
    store.createSong(isNew).then(song => {
      if (redirect) {
        this.props.history.push('/')
      } else if (isNew) {
        const id = song.link.split('songs/').filter(s => s)[0]
        this.props.history.push(`/song/${id}/edit`)
      }
    })
  }

  onEditorButtonClick = (e) => {
    e.preventDefault()
    const tag = e.target.dataset.tag
    const editor = this.refs.songEditor
    const caretPosition = editor.selectionStart
    const text = editor.value

    editor.value = text.substring(0, caretPosition) + tag + text.substring(caretPosition)
    this.props.store.selectedSong['text'] = editor.value
    editor.selectionEnd = caretPosition + tag.length
    editor.focus()
  }

  onSongExport = e => {
    this.props.store.onSongExport(e)
  }

  render() {
    const { store, match } = this.props
    const isNew = match.params.id === 'new'
    const isUserPermitedToSee = isNew || (store.selectedSong.id === match.params.id)
    const isUserPermitedToEdit = isUserPermitedToSee && (isNew || isSongEditable(store.selectedSong, store.user))
    const isMine = isNew || store.selectedSong.owner === store.user.id

    const permissionOptions = [
      {
        value: 1,
        label: 'Všichni'
      },
      {
        value: 0,
        label: 'Pouze já'
      }
    ]

    if (!store.isLoaded) {
      return <div style={{ marginTop: '60px' }}>Loading...</div>
    }
    if (!isUserPermitedToSee) {
      return <div style={{ marginTop: '60px' }}>You are not allowed to view this song</div>
    }
    if (!isUserPermitedToEdit) {
      return <div style={{ marginTop: '60px' }}>You are not allowed to edit this song</div>
    }
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
              {isMine &&
                <div className="row">
                  <div className="col-md-6 col-sm-12">
                    <div className="form-group">
                      <label>Viditelnost:</label>
                      <Select
                        options={permissionOptions}
                        value={store.selectedSong.visibility}
                        onChange={payload => store.onSongChange('visibility', payload)} />
                    </div>
                  </div>
                </div>
              }
              <div className="form-group editor-group">
                <label>Píseň:</label>
                <div className="editor-control">
                  <div className="btn-group" onClick={e => this.onEditorButtonClick(e)}>
                    <a className="btn btn-default" data-tag="[Chorus]">Chorus</a>
                    <a className="btn btn-default" data-tag="[Verse]">Verse</a>
                    <a className="btn btn-default" data-tag="[Echo]">Echo</a>
                  </div>

                  <div className="btn-group"
                      style={{display: (!this.state.shiftChords && !this.state.mollChords) ? 'inline-block' : 'none' }}
                      onClick={e => this.onEditorButtonClick(e)}>
                    <a className="btn btn-default btn-chord" data-tag="[C]">C</a>
                    <a className="btn btn-default btn-chord" data-tag="[D]">D</a>
                    <a className="btn btn-default btn-chord" data-tag="[E]">E</a>
                    <a className="btn btn-default btn-chord" data-tag="[F]">F</a>
                    <a className="btn btn-default btn-chord" data-tag="[G]">G</a>
                    <a className="btn btn-default btn-chord" data-tag="[A]">A</a>
                    <a className="btn btn-default btn-chord" data-tag="[H]">H</a>
                  </div>
                  <div className="btn-group"
                      style={{display: (!this.state.shiftChords && this.state.mollChords) ? 'inline-block' : 'none' }}
                      onClick={e => this.onEditorButtonClick(e)}>
                    <a className="btn btn-default btn-chord" data-tag="[Cmi]">Cmi</a>
                    <a className="btn btn-default btn-chord" data-tag="[Dmi]">Dmi</a>
                    <a className="btn btn-default btn-chord" data-tag="[Emi]">Emi</a>
                    <a className="btn btn-default btn-chord" data-tag="[Fmi]">Fmi</a>
                    <a className="btn btn-default btn-chord" data-tag="[Gmi]">Gmi</a>
                    <a className="btn btn-default btn-chord" data-tag="[Ami]">Ami</a>
                    <a className="btn btn-default btn-chord" data-tag="[Hmi]">Hmi</a>
                  </div>
                  <div className="btn-group"
                      style={{display: (this.state.shiftChords && !this.state.mollChords) ? 'inline-block' : 'none' }}
                      onClick={e => this.onEditorButtonClick(e)}>
                    <a className="btn btn-default btn-chord" data-tag="[C#]">C#</a>
                    <a className="btn btn-default btn-chord" data-tag="[D#]">D#</a>
                    <a className="btn btn-default btn-chord" data-tag="[E#]">E#</a>
                    <a className="btn btn-default btn-chord" data-tag="[F#]">F#</a>
                    <a className="btn btn-default btn-chord" data-tag="[G#]">G#</a>
                    <a className="btn btn-default btn-chord" data-tag="[A#]">A#</a>
                    <a className="btn btn-default btn-chord" data-tag="[H#]">H#</a>
                  </div>
                  <div className="btn-group"
                      style={{display: (this.state.shiftChords && this.state.mollChords) ? 'inline-block' : 'none' }}
                      onClick={e => this.onEditorButtonClick(e)}>
                    <a className="btn btn-default btn-chord" data-tag="[C#mi]">C#mi</a>
                    <a className="btn btn-default btn-chord" data-tag="[D#mi]">D#mi</a>
                    <a className="btn btn-default btn-chord" data-tag="[E#mi]">E#mi</a>
                    <a className="btn btn-default btn-chord" data-tag="[F#mi]">F#mi</a>
                    <a className="btn btn-default btn-chord" data-tag="[G#mi]">G#mi</a>
                    <a className="btn btn-default btn-chord" data-tag="[A#mi]">A#mi</a>
                    <a className="btn btn-default btn-chord" data-tag="[H#mi]">H#mi</a>
                  </div>
                </div>
                <textarea
                  style={{ fontFamily: 'Courier New' }}
                  className="form-control"
                  ref="songEditor"
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
              {!isNew &&
                <button className="btn btn-default" onClick={this.onSongExport}>
                  Zobrazit v pdf
                </button>
              }
              {store.exportStatus &&
                <span>
                  {store.exportStatus === 'loading' &&
                    <span className="alert alert-primary" style={{ padding: '7px 15px' }}>Píseň se připravuje...</span>
                  }
                  {store.exportStatus === 'failed' &&
                    <span className="alert alert-danger" style={{ padding: '7px 15px' }}>Píseň se nepodařilo zkompilovat.</span>
                  }
                  {store.exportStatus === 'loaded' &&
                    <span className="alert alert-success" style={{ padding: '7px 15px' }}>Píseň je připravena! Stáhnout ji můžeš
                      <a target="_blank" rel="noopener noreferrer" href={store.exportLink}> zde</a>
                    </span>
                  }
                </span>
              }
            </form>
            
          </div>
          <div className="col-md-4 col-sm-12">
            
            <div className="psm">
              <h4>Editor návod</h4>
              <p>
                Editor využívá značky pro zadávání akordů a částí písniček.
              </p>
              <ul>
                <li><b>[C]</b>/<b>[C#]</b>/<b>[Dmi]</b> - akordy</li>
                <li><b>[verse]</b> - sloka</li>
                <li><b>[chorus]</b> - refrén</li>
                <li><b>[solo]</b>/<b>[intro]</b>/<b>[outro]</b>/<b>[bridge]</b>/<b>[intermezzo]</b> - další možné značky - všechny reprezentují nečíslovanou sloku.</li>
                <li><b>|:</b> ... <b>:|</b> - začátek a konec repetice</li>
              </ul>
              <p>Akordy můžeš psát i ty, které nejsou zde v návodu a nebo v editoru samotném. Zpěvník by měl akceptovat všechny existující akordy</p>
              <p>Značky vždy značí začátek části, konec je automaticky u další značky nebo na konci písně. Jediné omezení na značky je, že část se nemůže měnit uvnitř repetice a repetice nemohou být vnořené.</p>
              <p>Značka <b>[chorus]</b> se dá bez problému použít samotná a reprezentuje opakující se stejný refrén.</p>
              <p>Zpěvník má omezený množství znaků, které se mohou v písničce objevit. Kromě abecedy (malé i velké včetně češtiny) a čísel jsou to: <b>. , - + ? ! & # " ( ) [ ] | : '</b></p>
              <p>Do editoru můžeš zadávat značky ručně a nebo použít tlačítka v hlavičce. Přepínat mezi skupinami akordů se dá pomocí <b>shift</b> a <b>ctrl</b></p>
            </div>

            <div className="psm">
              <h4>Příklad písně</h4>
              <p>
                <b>[verse]</b><br />
                <b>[Dmi]</b>Dávám sbohem <b>[C]</b>břehům prokla<b>[Ami]</b>tejm,<br />
                který <b>[Dmi]</b> v drápech má <b>[C]</b>ďábel <b>[Dmi]</b>sám.<br /><br />

                <b>[chorus]</b><br />
                Jen tři <b>[F]</b>kříže z bí<b>[C]</b>lýho kame<b>[Ami]</b>ní<br />
                <b>|:</b> někdo <b>[Dmi]</b>do písku <b>[C]</b>posklá<b>[Dmi]</b>dal. <b>:|</b><br /><br />

                <b>[verse]</b><br />
                První kříž má pod sebou jen hřích, samý pití a rvačka jen.<br />

              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    )
  }
})))

export default SongEditor