import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import Select from 'react-select'
import { NavLink } from 'react-router-dom'
import { withRouter } from 'react-router'

const EditInfoBar = withRouter(inject('store')(observer(class extends Component {
  constructor(props) {
    super(props)
    this.state = {
      unsavedPromptModal: false
    }
  }

  onSongbookSaveClick = e => {
    e.stopPropagation()
    const { store, history } = this.props
    if (store.selectedSongBook.updated) {
      store.updateSongBook()
        .then(() => store.getSongBooks())
    }
    store.songBookEditMode = false
  }

  onSongbookCancelClick = e => {
    e.stopPropagation()
    const { store } = this.props
    if (store.selectedSongBook.updated)
      this.setState({'unsavedPromptModal': true})
    else {
      store.songBookEditMode = false
      this.props.history.push('/')
    }
  }

  render() {
    const { store } = this.props

    if (!store.songBookEditMode)
      return null

    return (
      <div>
        <div className="well well-sm song-list-songbook-control">
          Je editovaný zpěvník <b className="font-weight-bold">{store.selectedSongBook.title}</b>
          <button type="button" className="btn btn-primary pull-right" onClick={(e) => this.onSongbookSaveClick(e)}>Uložit zpěvník</button>
          <button type="button" className="btn btn-primary pull-right" onClick={(e) => this.onSongbookCancelClick(e)}>Zrušit</button>
        </div>

        <div className="modal" tabIndex="-1" role="dialog" style={{display: this.state.unsavedPromptModal ? 'block' : 'none' }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => {
                  this.setState({'unsavedPromptModal': false})
                }}>
                  <span aria-hidden="true">&times;</span>
                </button>
                <h5 className="modal-title">Neuložené změny</h5>
              </div>
              <div className="modal-body">
                <p>Zpěvník byl editován a některé změny nejsou uložené.</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-primary" onClick={(e) => {
                  this.onSongbookSaveClick(e)
                }}>Uložit změny</button>
                <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={() => {
                  this.setState({'unsavedPromptModal': false})
                  store.songBookEditMode = false
                }}>Odejít bez uložení</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
})))

export default EditInfoBar
