import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'

const Songbook = inject('store')(observer(class extends Component {

  render () {
    return (
      <h1>Zpěvníky</h1>
    )
  }
}))

export default Songbook