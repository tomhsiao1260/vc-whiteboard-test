import * as THREE from 'three'

export default class Controls {
  constructor(_option) {
    this.time = _option.time
    this.sizes = _option.sizes
    this.camera = _option.camera

    this.mousePress = false
    this.spacePress = false

    this.setMouse()
  }

  setMouse() {
    this.mouse = new THREE.Vector2()

    // triggered when the mouse moves
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX / this.sizes.width * 2 - 1
      this.mouse.y = -(e.clientY / this.sizes.height) * 2 + 1
      this.time.trigger('mouseMove')
    })

    // after pressing down the mouse button
    window.addEventListener('pointerdown', (e) => {
      const name = e.srcElement.className
      if (name !== 'webgl' && name !== 'cardDOM') return

      this.mousePress = true
      this.time.trigger('mouseDown')
    })
    // can't use 'mousedown' event because of the OrbitControls library

    // after releasing the mouse button
    window.addEventListener('click', () => {
      this.mousePress = false
      this.time.trigger('mouseUp')
    })

    // whether space key is pressed or not
    window.addEventListener('keydown', (e) => { this.spacePress = (e.code == 'Enter') })
    window.addEventListener('keyup', (e) => { this.spacePress = !(e.code == 'Enter') })
  }

  getRayCast(meshes) {
    const raycaster = new THREE.Raycaster()
    raycaster.setFromCamera(this.mouse, this.camera.instance)
    const intersects = raycaster.intersectObjects(meshes)

    return intersects
  }
}
