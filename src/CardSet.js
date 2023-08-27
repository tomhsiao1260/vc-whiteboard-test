import * as THREE from 'three'
import ViewerCore from './core/ViewerCore'
import { CopyShader } from './core/CopyShader'

export default class CardSet {
  constructor(_option) {
    this.$card = document.createElement('div')

    this.list = []
    this.textList = []

    this.setup()
  }

  setup() {
    this.setDOM()
  }

  setDOM() {
    this.$card.style.backgroundColor = 'rgba(0, 0, 0, 0.0)'
    this.$card.style.border = '1px solid white'
    this.$card.style.display = 'none'
    // this.$card.style.display = 'inline'
    this.$card.style.position = 'absolute'
    document.body.appendChild(this.$card)

    // this.viewer = new ViewerCore({ data, renderer, canvas })
  }

  setLoadingText(mouse) {
    console.log(mouse)
    const loadingDIV = document.createElement('div')
    loadingDIV.className = 'loadingCard'
    loadingDIV.innerText = 'Loading ...'
    loadingDIV.style.left = `${100 * (1 + mouse.x) / 2}%`
    loadingDIV.style.top = `${100 * (1 - mouse.y) / 2}%`
    loadingDIV.style.display = 'inline'
    document.body.appendChild(loadingDIV)

    return loadingDIV
  }

  create(mode, center) {
    const canvas = this.$card
    const geometry = new THREE.PlaneGeometry(1, 1)
    const material = new CopyShader()
    const card = new THREE.Mesh(geometry, material)

    // material.uniforms.tDiffuse.value = this.viewer.buffer[ mode ].texture
    card.userData = { mode, center, canvas, w: 1, h: 1 }
    card.position.copy(center)
    this.list.push(card)

    return card
  }
}
