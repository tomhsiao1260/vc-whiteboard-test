import * as THREE from 'three'
import { MOUSE, TOUCH } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

export default class Camera {
  constructor(_option) {
    this.time = _option.time
    this.sizes = _option.sizes
    this.renderer = _option.renderer

    this.container = new THREE.Object3D()
    this.container.matrixAutoUpdate = false

    this.setInstance()
    this.setOrbitControls()
  }

  setInstance() {
    const { width, height } = this.sizes.viewport
    this.instance = new THREE.PerspectiveCamera(75, width / height, 0.1, 100)
    this.instance.position.z = 2
    this.container.add(this.instance)

    this.sizes.on('resize', () => {
      const { width, height } = this.sizes.viewport
      this.instance.aspect = width / height
      this.instance.updateProjectionMatrix()
    })
  }

  setOrbitControls() {
    this.orbitControls = new OrbitControls(this.instance, this.renderer.domElement)
    this.orbitControls.enableDamping = false
    this.orbitControls.screenSpacePanning = true // pan orthogonal to world-space direction camera.up
    this.orbitControls.mouseButtons = { LEFT: MOUSE.PAN, MIDDLE: MOUSE.DOLLY, RIGHT: MOUSE.ROTATE }
    this.orbitControls.touches = { ONE: TOUCH.PAN, TWO: TOUCH.DOLLY_ROTATE }

    this.orbitControls.addEventListener('change', () => this.time.trigger('tick'))
  }
}
