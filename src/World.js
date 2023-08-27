import * as THREE from 'three'

import Controls from './Controls'
import WhiteBoard from './WhiteBoard'
import CardSet from './CardSet'

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
    this.setCard()
  }

  setControls() {
    this.controls = new Controls({
      time: this.time,
      sizes: this.sizes,
      camera: this.camera,
    })
  }

  setWhiteBoard() {
    this.whiteBoard = new WhiteBoard({
    })
    this.container.add(this.whiteBoard.container)

    this.time.trigger('tick')
  }

  async setCard() {
    this.cardSet = new CardSet({
      time: this.time,
      renderer: this.renderer,
    })

    await this.cardSet.setViewer()

    // generate a card when clicking
    this.time.on('mouseDown', () => {
      if (!this.controls.spacePress) return

      const intersects = this.controls.getRayCast([ this.whiteBoard.container ])
      if (!intersects.length) return

      const pos = intersects[0].point
      const center = new THREE.Vector3(pos.x, pos.y, 0)
      const card = this.cardSet.create('segment', this.controls.mouse, center)
      this.container.add(card)

      this.time.trigger('tick')
    })
  }
}
