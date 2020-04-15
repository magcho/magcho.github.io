import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { GreaterEqualStencilFunc } from "three";

export default class Cavnas {
  private renderer: THREE.WebGLRenderer;
  private camera: THREE.PerspectiveCamera;
  private scene: THREE.Scene;
  private control: OrbitControls;
  private loader: GLTFLoader;

  private stageScenes;
  private stageAnimationClips;
  private penguinAnimationClips;
  private windowSize = { w: 0, h: 0 };
  private windowScroll: number;
  private stageAssets;
  private animationMixers: THREE.AnimationMixer[];
  private clock: THREE.Clock;

  private currentSeneName: string;

  constructor() {
    this.stageAssets = [
      {
        name: "pa",
        path: "./model/stage_pa.glb",
        animaions: []
      },
      {
        name: "program",
        path: "./model/stage_program.glb",
        animations: []
      },
      {
        name: "electro",
        path: "./model/stage_electro.glb",
        animatoins: ["Electro_solid"]
      }
    ];

    this.windowSize.w = window.innerWidth;
    this.windowSize.h = window.innerHeight;

    this.windowScroll = 0;

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(this.windowSize.w, this.windowSize.h);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setClearColor(0xffffff, 1);
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    document
      .getElementById("background_container")
      .appendChild(this.renderer.domElement);

    // init camera
    this.camera = new THREE.PerspectiveCamera(
      60,
      this.windowSize.w / this.windowSize.h,
      0.1,
      100
    );
    this.camera.position.set(0, 2, 2);
    // this.resizeCamera();

    // init scene
    this.scene = new THREE.Scene();

    // init control
    this.control = new OrbitControls(this.camera, this.renderer.domElement);
    this.control.autoRotate = true;
    this.control.target.set(0, 0.5, 0);

    // init light
    this.scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const spotLight = new THREE.SpotLight(0xffffff, 1);
    spotLight.position.y = 10;
    spotLight.position.z = 5;
    this.scene.add(spotLight);

    // init mesh
    this.scene.add(new THREE.GridHelper(10, 5));

    // loadModels
    this.stageScenes = {};
    this.stageAnimationClips = {};
    this.animationMixers = [];
    this.loader = new GLTFLoader();
    new Promise(resolve => {
      const gtlfLoader = new GLTFLoader();
      gtlfLoader.load("./model/penguin.glb", gltf => {
        const obj = gltf.scene;
        const animations = gltf.animations;
        const animeMixer = new THREE.AnimationMixer(obj);

        this.penguinAnimationClips = {
          idle: animeMixer.clipAction(
            THREE.AnimationClip.findByName(animations, "Idle")
          ),
          pa: animeMixer.clipAction(
            THREE.AnimationClip.findByName(animations, "PA")
          ),
          electro: animeMixer.clipAction(
            THREE.AnimationClip.findByName(animations, "Electro_solid")
          ),
          program: animeMixer.clipAction(
            THREE.AnimationClip.findByName(animations, "Program")
          )
        };
        this.animationMixers.push(animeMixer);
        this.scene.add(obj);

        resolve();
      });
    })
      .then(() => this.loadSingleStage("pa", "./model/stage_pa.glb"))
      .then(() => this.loadSingleStage("program", "./model/stage_program.glb"))
      .then(() => this.loadSingleStage("electro", "./model/stage_electro.glb"))
      .then(() => {
        return new Promise(resolve => {
          // default animation
          this.currentSeneName = "idle";
          this.penguinAnimationClips["idle"].play();
          resolve();
        });
      })
      .then(() => {
        this.clock = new THREE.Clock();
        this.rendering();
      });
  }

  loadSingleStage(name: string, path: string): Promise<any> {
    return new Promise(resolve => {
      this.loader.load(path, gltf => {
        const obj = gltf.scene;
        this.stageScenes[name] = obj;

        if (gltf.animations.length > 0) {
          const animations = gltf.animations;
          const animeMixer = new THREE.AnimationMixer(obj);

          this.stageAnimationClips["electro"] = animeMixer.clipAction(
            THREE.AnimationClip.findByName(animations, "Electro_solid")
          );
          this.animationMixers.push(animeMixer);
        }
        resolve();
      });
    });
  }

  loadStage(assets: any[]): Promise<any> {
    return new Promise((resolve, reject) => {
      assets.map(asset => {
        const loader = new GLTFLoader();
        loader.load(
          asset.path,
          gltf => {
            const obj = gltf;
            this.stageScenes[asset.name] = obj.scene;
            resolve();
          },
          () => {},
          error => {
            reject(error);
          }
        );
      });
    });
  }

  playScene(nextSceneName: string, duration = 0.5) {
    return new Promise(resolve => {
      if (nextSceneName !== "idle") {
        this.scene.add(this.stageScenes[nextSceneName]);

        if (nextSceneName === "electro") {
          this.stageAnimationClips["electro"].reset().play();
        }
      }
      this.penguinAnimationClips[nextSceneName]
        .reset()
        .fadeIn(duration)
        .play();
      this.currentSeneName = nextSceneName;
      setTimeout(resolve, duration);
    });
  }

  stopScene(animationName: string, duration: number = 0.5) {
    return new Promise(resolve => {
      if (animationName !== "idle") {
        this.scene.remove(this.stageScenes[animationName]);
      }
      this.penguinAnimationClips[animationName].fadeOut(duration);
      resolve();
    });
  }

  async xFadeScene(sceneName: string) {
    if (sceneName === this.currentSeneName) {
      return false;
    }
    this.stopScene(this.currentSeneName);
    await this.playScene(sceneName);
  }

  rendering() {
    requestAnimationFrame(() => {
      this.rendering();
    });
    if (this.animationMixers && this.animationMixers.length > 0) {
      const delta = this.clock.getDelta();
      for (let i = 0; i < this.animationMixers.length; i++) {
        if (this.animationMixers[i]) {
          this.animationMixers[i].update(delta);
        }
      }
    }

    this.renderer.render(this.scene, this.camera);
    this.control.update();
  }
}
