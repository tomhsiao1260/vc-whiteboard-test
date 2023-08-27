import * as THREE from 'three'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min'

export default class GUIPanel {
  constructor(_option) {
    this.mode = _option.mode

    this.gui = new GUI()
  }

  update() {
    this.gui.add(this, 'mode', ['segment', 'layer', 'volume', 'volume-segment'])
  }
}
