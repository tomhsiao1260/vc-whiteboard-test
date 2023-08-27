import * as THREE from 'three'
import Loader from './Loader'
import ViewerCore from './core/ViewerCore'
import { CopyShader } from './core/CopyShader'

export default class CardSet {
  constructor(_option) {
    this.time = _option.time
    this.renderer = _option.renderer
    this.$card = document.createElement('div')

    this.list = []
    this.textList = []

    this.setup()
  }

  setup() {
    this.$card.style.backgroundColor = 'rgba(0, 0, 0, 0.0)'
    this.$card.style.border = '1px solid white'
    this.$card.style.display = 'none'
    this.$card.style.position = 'absolute'
    document.body.appendChild(this.$card)
  }

  async setViewer() {
    const volumeMeta = await Loader.getVolumeMeta()
    const segmentMeta = await Loader.getSegmentMeta()
    const data = { volumeMeta, segmentMeta, size: { w: 500, h: 500 } }
    this.viewer = new ViewerCore({ data, renderer: this.renderer, canvas: this.$card })
  }

  setLoadingText(mouse) {
    const loadingDIV = document.createElement('div')
    loadingDIV.className = 'loadingCard'
    loadingDIV.innerText = 'Loading ...'
    loadingDIV.style.left = `${100 * (1 + mouse.x) / 2}%`
    loadingDIV.style.top = `${100 * (1 - mouse.y) / 2}%`
    loadingDIV.style.display = 'inline'
    document.body.appendChild(loadingDIV)

    return loadingDIV
  }

  create(mode, mouse, center) {
    const canvas = this.$card
    const geometry = new THREE.PlaneGeometry(1, 1)
    const material = new CopyShader()
    const card = new THREE.Mesh(geometry, material)

    material.uniforms.tDiffuse.value = this.viewer.buffer[ mode ].texture
    card.userData = { mode, center, canvas, w: 1, h: 1 }
    card.position.copy(center)
    this.list.push(card)

    this.viewer.params.mode = mode
    this.updateViewer(this.viewer, mouse)

    return card
  }

  async updateViewer(viewer, mouse) {
    const { mode } = viewer.params
    const loadingDIV = this.setLoadingText(mouse)

    if (mode === 'segment') { await this.modeA(viewer) }
    if (mode === 'volume') { await this.modeB(viewer) }
    if (mode === 'volume-segment') { await this.modeC(viewer) }
    if (mode === 'layer') { await this.modeC(viewer) }
    if (mode === 'grid layer') { await this.modeC(viewer) }

    this.viewer.render()
    this.time.trigger('tick')
    loadingDIV.style.display = 'none'
  }

  // segment mode
  async modeA(viewer) {
    viewer.clear()
    const segment = viewer.updateSegment()
    await segment.then(() => { console.log(`segment ${viewer.params.layers.select} is loaded`) })
  }

  // volume mode
  async modeB(viewer) {
    viewer.clear()
    const volume = viewer.updateVolume()
    await volume.then(() => { console.log(`volume ${viewer.params.layers.select} is loaded`) })
  }

  // volume-segment mode
  async modeC(viewer) {
    viewer.clear()
    const volume = viewer.updateVolume()
    const segment = viewer.updateSegment()

    await Promise.all([volume, segment])
      .then(() => viewer.clipSegment())
      .then(() => viewer.updateSegmentSDF())
      .then(() => { console.log(`volume-segment ${viewer.params.layers.select} is loaded`) })
  }
}
