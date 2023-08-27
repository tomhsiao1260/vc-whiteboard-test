import * as THREE from 'three'

import Controls from './Controls'
import WhiteBoard from './WhiteBoard'
import Card from './Card'

export default class World {
  constructor(_option) {
    this.time = _option.time
    this.sizes = _option.sizes
    this.camera = _option.camera
    this.renderer = _option.renderer

    this.container = new THREE.Object3D()
    this.container.matrixAutoUpdate = false

    this.start()
  }

  start() {
    this.setControls()
    this.setWhiteBoard()
    // this.setCard()
  }

  setControls() {
    this.controls = new Controls({
      time: this.time,
    })
  }

  setWhiteBoard() {
    this.whiteBoard = new WhiteBoard({
    })
    this.container.add(this.whiteBoard.container)
  }

  // setCard() {
  //   this.cardInstance = new Card({
  //   })
  // }
}
