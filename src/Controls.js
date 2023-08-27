import * as THREE from 'three'

export default class Controls {
  constructor(_option) {
    this.time = _option.time

    this.setMouse()
  }

  setMouse() {
    this.mouse = new THREE.Vector2()
  }
}
