import { extendObservable } from 'mobx'

export class Store {
  constructor (props) {
    extendObservable(this, {
      user: 'lalala'
    })
  }
}