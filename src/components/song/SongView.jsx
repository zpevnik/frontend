import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { observer, inject } from 'mobx-react'
import { isSongEditable } from '../../lib/utils'

const SongView = withRouter(inject('store')(observer(class extends Component {

  componentDidMount = () => {
    const { store, match } = this.props
    store.isLoaded = false
    store.exportStatus = null
    store.exportLink = null
    Promise.all([store.getAuthors(), store.getInterpreters(), store.getUser()]).then(() => {
      store.getSong(match.params.id).then(() => {
        store.isLoaded = true
      })
    })
  }

  onSongExport = e => {
    this.props.store.onSongExport(e)
  }

  onEditClick = () => {
    const { history, location } = this.props
    history.push(location.pathname + '/edit')
  }

  render() {
    const { store, match } = this.props
    const isUserPermitedToSee = (store.selectedSong.id === match.params.id)
    const isUserPermitedToEdit = isUserPermitedToSee && isSongEditable(store.selectedSong, store.user)

    if (!store.isLoaded) {
      return <div style={{ marginTop: '60px' }}>Loading...</div>
    }
    if (!isUserPermitedToSee) {
      return <div style={{ marginTop: '60px' }}>You are not allowed to view this song</div>
    }

    let text = store.selectedSong.text.replace(/\[verse\]/ig, '')
    // let i = 1
    // while (/\[verse\]\s*[\n\r]?/i.test(text)) {
    //   text = text.replace(/\[verse\]\s*[\n\r]?/i, i.toString() + '. ')
    //   i++
    // }

    const lines = text
      .split(/[\n\r]/)
      .map(line => line.trim())
    // const verseRegex = /\[verse\]([\s\S]*?)\[verse\]/g
    const chordRegex = /\[(.+?)\]/
    // const verses = store.selectedSong.text.match(verseRegex)
    //   ? store.selectedSong.text.match(verseRegex).map(verse => verse.replace(/\[verse\]/g, ''))
    //   : []
    // let lines = []
    // verses.forEach(verse => {
    //   lines = lines.concat(verse.split(/[\n\r]/))
    // })
    const printLines = (lines) => {
      const printedLines = []
      lines.forEach(line => {
        let tempLine = line
        let result
        const chords = []
        while ((result = chordRegex.exec(tempLine)) !== null) {
          const fullChord = result[0]
          const chord = result[1]
          const index = result.index
          const spaces = index - chords.reduce((acc, cur) => acc + cur.length, 0)
          chords.push(chord.padStart(spaces + chord.length))
          tempLine = tempLine.replace(fullChord, '')
        }
        if (chords.length > 0) {
          printedLines.push(chords.join(''))
        }
        printedLines.push(tempLine)
      })
      return printedLines
    }
    return (
      <div className="container" style={{ marginTop: '60px' }}>
      <div id="content">
        <div className="row">
          <div className="col-sm-12">
            <h4>{store.selectedSong.title}</h4>
            <hr />
            <div style={{ whiteSpace: 'pre', fontFamily: 'Courier New' }}>
              {printLines(lines).join('\n')}
            </div>
            <button className="btn btn-default" onClick={this.onEditClick}>
              Upravit
            </button>
            <button className="btn btn-default" onClick={this.onSongExport}>
              Zobrazit v pdf
            </button>
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
                    <a target="_blank" href={store.exportLink}> zde</a>
                  </span>
                }
              </span>
            }
            
          </div>
        </div>
      </div>
    </div>
    )
  }
})))

export default SongView