import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import Stats from "three/examples/jsm/libs/stats.module";
import Easing from "../Easing";

export default class Cavnas {
  private renderer: THREE.WebGLRenderer;
  private camera: THREE.PerspectiveCamera;
  private scene: THREE.Scene;
  private control: OrbitControls;
  private loader: GLTFLoader;
  private stats: Stats;

  private stageScenes;
  private stageAnimationClips;
  private penguinAnimationClips;
  private windowSize = { w: 0, h: 0 };
  private windowScroll: number;
  private stageAssets;
  private animationMixers: THREE.AnimationMixer[];
  private clock: THREE.Clock;
  private penguinScene: THREE.Group;

  private currentSeneName: string;
  private animateStack: Easing[];
  private penguinState: number; //0: hiden, 1:show

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

    this.animateStack = [];

    // renderer
    this.renderer = new THREE.WebGLRenderer({ alpha: true });
    this.renderer.setSize(this.windowSize.w, this.windowSize.h);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.clippingPlanes.push(
      new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)
    );
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

    // init scene
    this.scene = new THREE.Scene();

    // init control
    this.control = new OrbitControls(this.camera, this.renderer.domElement);
    this.control.autoRotate = false;
    this.control.maxAzimuthAngle;
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
    this.penguinState = 0;
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
        this.penguinScene = obj;
        this.penguinScene.position.y = -1.1;
        this.scene.add(this.penguinScene);
        this.penguinState = 1;

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
        this.stats = Stats();
        this.stats.showPanel(0);
        document.body.appendChild(this.stats.dom);
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
        this.stageScenes[nextSceneName].position.y = -1.1;
        this.scene.add(this.stageScenes[nextSceneName]);
        this.moveSceneAnimationCreate(nextSceneName, "up", 500);

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
        this.moveSceneAnimationCreate(animationName, "down", duration * 1000);
        // this.scene.remove(this.stageScenes[animationName]); eraseでstageのシーンを消したのでここは無視
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
    this.playScene(sceneName);
  }

  rendering() {
    this.stats.begin();
    if (this.animationMixers && this.animationMixers.length > 0) {
      const delta = this.clock.getDelta();
      for (let i = 0; i < this.animationMixers.length; i++) {
        if (this.animationMixers[i]) {
          this.animationMixers[i].update(delta);
        }
      }
    }
    this.moveSceneAnimationUpdate();

    this.renderer.render(this.scene, this.camera);
    this.control.update();
    this.stats.end();

    requestAnimationFrame(() => {
      this.rendering();
    });
  }

  moveSceneAnimationCreate(
    sceneName: string,
    direction: string,
    duration: number,
    waitTime: number = 100
  ) {
    if (sceneName === "penguin") {
      this.animateStack.push(
        new Easing(this.penguinScene, sceneName, direction, duration, waitTime)
      );
      if (direction === "up") {
        this.penguinState = 1;
      } else if (direction === "down") {
        this.penguinState = 0;
      }
    } else {
      this.animateStack.push(
        new Easing(this.stageScenes[sceneName], sceneName, direction, duration)
      );
    }
  }

  moveSceneAnimationUpdate() {
    if (this.animateStack.length === 0) {
      return;
    }
    this.animateStack = this.animateStack.filter(anime => {
      return anime.update();
    });
  }

  windowResize() {
    this.windowSize.h = window.innerHeight;
    this.windowSize.w = window.innerWidth;

    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.windowSize.w, this.windowSize.h);

    this.camera.aspect = this.windowSize.w / this.windowSize.h;
    this.camera.updateProjectionMatrix();
  }
}
