import * as THREE from "three";

export default class Cavnas {
  private renderer: THREE.WebGLRenderer;
  private camera: THREE.PerspectiveCamera;
  private stageScenes: { string: THREE.Scene };
  private penguinScene: { string: THREE.Scene };

  private windowSize = { x: 0, y: 0 };
  private mousePos: THREE.Vector2;
  private windowScroll: number;

  constructor() {
    this.windowSize.x = window.innerWidth;
    this.windowSize.y = window.innerHeight;

    this.mousePos = new THREE.Vector2(0, 0);
    this.windowScroll = 0;

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(this.windowSize.x, this.windowSize.y);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    document
      .getElementById("background_container")
      .appendChild(this.renderer.domElement);
  }
}
