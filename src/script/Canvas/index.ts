import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
// import Stats from "three/examples/jsm/libs/stats.module";
import Easing from "../Easing";
import CurrentPage from "../CurrentPage";

export default class Cavnas {
  private renderer: THREE.WebGLRenderer;
  private rendererSkill: THREE.WebGLRenderer;
  private camera: THREE.PerspectiveCamera;
  private cameras: THREE.PerspectiveCamera[];
  private scene: THREE.Scene;
  private scenes: THREE.Scene[];
  private control: OrbitControls;
  private controls: OrbitControls[];
  // private stats: Stats;

  private stageScenes;
  private stageAnimationClips;
  private penguinAnimationClips;
  private windowSize = { w: 0, h: 0 };
  private skillAreaSize = { w: 0, h: 0 };
  private windowScroll: number;
  private stageAssets;
  private animationMixers: THREE.AnimationMixer[];
  private clock: THREE.Clock;
  private penguinScene: THREE.Group;
  private penguinScenes: THREE.Group[];

  private currentSeneName: string;
  private animateStack: Easing[];
  private penguinState: number; //0: hiden, 1:show
  private currentPage: CurrentPage;

  constructor() {
    this.currentPage = new CurrentPage();
    this.penguinScenes = [];
    this.cameras = [];
    this.controls = [];
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

    this.skillAreaSize.h = document.getElementById(
      "skill_container"
    ).offsetHeight;
    this.skillAreaSize.w = document.getElementById(
      "three_container2"
    ).offsetWidth;

    this.windowScroll = 0;
    this.animateStack = [];
    this.scenes = [];

    // first renderer
    this.renderer = new THREE.WebGLRenderer({ alpha: true });
    this.renderer.setSize(this.windowSize.w, this.windowSize.h);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.clippingPlanes.push(
      new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)
    );
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    document
      .getElementById("three_container1")
      .appendChild(this.renderer.domElement);

    // second renderer
    this.rendererSkill = new THREE.WebGLRenderer({ alpha: true });
    this.rendererSkill.setSize(this.skillAreaSize.w, this.skillAreaSize.h);
    this.rendererSkill.setPixelRatio(window.devicePixelRatio);
    this.rendererSkill.setClearColor(0x000000, 0);
    this.rendererSkill.clippingPlanes.push(
      new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)
    );
    this.rendererSkill.outputEncoding = THREE.sRGBEncoding;
    document
      .getElementById("three_container2")
      .appendChild(this.rendererSkill.domElement);

    // init camera
    this.cameras.push(
      new THREE.PerspectiveCamera(
        60,
        this.windowSize.w / this.windowSize.h,
        0.1,
        100
      )
    );
    this.cameras[0].position.set(1.5, 1.5, 1.5);
    this.cameras.push(
      new THREE.PerspectiveCamera(
        60,
        this.skillAreaSize.w / this.skillAreaSize.h,
        0.1,
        100
      )
    );
    this.cameras[1].position.set(1.5, 1.5, 1.5);

    // init scene
    this.scene = new THREE.Scene();
    this.scenes.push(new THREE.Scene());
    this.scenes.push(new THREE.Scene());

    // init control
    this.controls.push(
      new OrbitControls(this.cameras[0], this.renderer.domElement)
    );
    this.controls[0].autoRotate = true;
    // this.control.enableRotate = false;
    // this.control.dispose();
    this.controls[0].enableZoom = false;
    this.controls[0].target.set(0, 0.5, 0);

    this.controls.push(
      new OrbitControls(this.cameras[1], this.rendererSkill.domElement)
    );
    this.controls[1].autoRotate = true;
    this.controls[1].enableZoom = false;
    this.controls[1].target.set(0, 0.5, 0);

    // init light
    this.scenes[0].add(new THREE.AmbientLight(0xffffff, 0.5));
    this.scenes[1].add(new THREE.AmbientLight(0xffffff, 0.5));
    let spotLight = new THREE.SpotLight(0xffffff, 0.5);
    spotLight.position.set(1, 4, 2);
    this.scenes[0].add(spotLight);

    spotLight = new THREE.SpotLight(0xffffff, 0.5);
    spotLight.position.set(1, 4, 2);
    this.scenes[1].add(spotLight);

    // init mesh
    // this.scene.add(new THREE.GridHelper(10, 5));

    // loadModels
    this.stageScenes = {};
    this.stageAnimationClips = {};
    this.animationMixers = [];
    this.penguinState = 0;
    this.penguinAnimationClips = [];

    new Promise(resolve => {
      const loadingManager = new THREE.LoadingManager();
      const gtlfLoader = new GLTFLoader(loadingManager);
      loadingManager.onLoad = resolve;

      gtlfLoader.load("./model/penguin.glb", gltf => {
        const obj = gltf.scene;
        const animations = gltf.animations;
        const animeMixer = new THREE.AnimationMixer(obj);

        this.penguinAnimationClips[0] = {
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
        // this.penguinScene = obj;
        // this.penguinScene.position.y = -1.1;
        this.penguinScenes.push(obj);
        this.penguinScenes[0].position.y = -1.1;
        this.scenes[0].add(this.penguinScenes[0]);
        this.penguinState = 1;

        // resolve();
      });
    })
      .then(
        () =>
          new Promise(resolve => {
            const loadingManager = new THREE.LoadingManager();
            const gtlfLoader = new GLTFLoader(loadingManager);
            loadingManager.onLoad = resolve;

            gtlfLoader.load("./model/penguin.glb", gltf => {
              const obj = gltf.scene;
              const animations = gltf.animations;
              const animeMixer = new THREE.AnimationMixer(obj);

              this.penguinAnimationClips[1] = {
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
              this.penguinScenes.push(obj);
              this.penguinScenes[1].position.y = -1.1;
              this.scenes[1].add(this.penguinScenes[1]);
              this.penguinState = 1;

              // resolve();
            });
          })
      )
      .then(() => this.loadSingleStage("pa", "./model/stage_pa.glb"))
      .then(() => this.loadSingleStage("program", "./model/stage_program.glb"))
      .then(() => this.loadSingleStage("electro", "./model/stage_electro.glb"))
      .then(() => {
        return new Promise(resolve => {
          // default animation
          this.currentSeneName = "idle";
          this.penguinAnimationClips[0]["idle"].play();
          console.log(1);
          resolve();
        });
      })
      .then(
        () =>
          new Promise(resolve => {
            let circle = new THREE.Mesh(
              new THREE.CircleGeometry(0.5, 32),
              new THREE.MeshBasicMaterial({ color: 0x002255 })
            );
            circle.rotateX(-Math.PI / 2);
            circle.position.y = 0.0001;
            this.scenes[0].add(circle);

            circle = new THREE.Mesh(
              new THREE.CircleGeometry(0.5, 32),
              new THREE.MeshBasicMaterial({ color: 0x002255 })
            );
            circle.rotateX(-Math.PI / 2);
            circle.position.y = 0.0001;
            this.scenes[1].add(circle);

            resolve();
          })
      )
      .then(() => {
        return new Promise(resolve => {
          this.clock = new THREE.Clock();
          /* this.stats = Stats();
          this.stats.showPanel(0);
          document.body.appendChild(this.stats.dom); */
          this.rendering();
          console.log(2);
          resolve();
        });
      })
      .then(() => {
        return new Promise(resolve => {
          this.moveSceneAnimationCreate("penguin", "up", 500, "top");
          // this.playScene("program", "skill", 0);
          console.log(3);
          resolve();
        });
      });
  }

  loadSingleStage(name: string, path: string): Promise<any> {
    return new Promise(resolve => {
      const loadingManager = new THREE.LoadingManager();
      const loader = new GLTFLoader(loadingManager);
      loadingManager.onLoad = resolve;

      loader.load(path, gltf => {
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
        // resolve();
      });
    });
  }

  /**
   *
   */
  private playScene(
    nextSceneName: string,
    target: string = "top",
    duration = 0.5
  ) {
    return new Promise(resolve => {
      const targetNum = target === "top" ? 0 : target == "skill" ? 1 : 0;

      if (nextSceneName !== "idle") {
        this.stageScenes[nextSceneName].position.y = -1.1;
        this.scenes[1].add(this.stageScenes[nextSceneName]);
        this.moveSceneAnimationCreate(nextSceneName, "up", 500, target);

        if (nextSceneName === "electro") {
          this.stageAnimationClips["electro"].reset().play();
        }
      }
      this.penguinAnimationClips[targetNum][nextSceneName]
        .reset()
        .fadeIn(duration)
        .play();
      this.currentSeneName = nextSceneName;
      setTimeout(resolve, duration);
    });
  }

  stopScene(
    animationName: string,
    target: string = "top",
    duration: number = 0.5
  ) {
    return new Promise(resolve => {
      const targetNum = target === "top" ? 0 : target == "skill" ? 1 : 0;
      if (animationName !== "idle") {
        this.moveSceneAnimationCreate(
          animationName,
          "down",
          duration * 1000,
          target
        );
        // this.scene.remove(this.stageScenes[animationName]); eraseでstageのシーンを消したのでここは無視
      }
      this.penguinAnimationClips[targetNum][animationName].fadeOut(duration);
      resolve();
    });
  }

  public async xFadeScene(sceneName: string, target: string) {
    if (sceneName === this.currentSeneName) {
      return false;
    }
    this.stopScene(this.currentSeneName, target);
    this.playScene(sceneName, target);
  }

  private pageMoveAnimateManagerUpdate() {
    if (this.currentPage.update()) {
      // ページ遷移
      const pageStatus = this.currentPage.status;

      // 下方向へ遷移
      if (pageStatus[0] == 1 && pageStatus[1] == 2) {
        // 1 -> 2
        this.moveSceneAnimationCreate("penguin", "down", 500, "top", 0);
        // this.moveSceneAnimationCreate("penguin", "up", 500, "skill", 5);
        return;
      } else if (pageStatus[0] == 2 && pageStatus[1] == 3) {
        this.moveSceneAnimationCreate("penguin", "down", 500, "skill", 0);
        return;
      }

      //上方向へ遷移
      if (pageStatus[0] == 2 && pageStatus[1] == 1) {
        this.moveSceneAnimationCreate("penguin", "down", 500, "skill", 0);
        this.moveSceneAnimationCreate("penguin", "up", 500, "top", 0);
        return;
      } else if (pageStatus[0] === 3 && pageStatus[1] === 2) {
        this.moveSceneAnimationCreate("penguin", "up", 500, "skill", 0);
      }
    } else if (this.currentPage.isPageMoveEnd()) {
      if (this.currentPage.page === 2) {
        this.moveSceneAnimationCreate("penguin", "up", 500, "skill", 0);
        Array.from(document.getElementsByClassName("skillSection")).map(ele => {
          ele.classList.add("active");
        });
        if (this.currentSeneName === "idle") {
          setTimeout(() => {
            document.getElementById("program").classList.add("playing");
            this.playScene("program", "skill");
          }, 1500);
        }
      }
      this.currentPage.page = 0;
    }
  }

  rendering() {
    this.pageMoveAnimateManagerUpdate();
    // console.log(this.penguinScenes[1].position.y);
    // this.stats.begin();
    if (this.animationMixers && this.animationMixers.length > 0) {
      const delta = this.clock.getDelta();
      for (let i = 0; i < this.animationMixers.length; i++) {
        if (this.animationMixers[i]) {
          this.animationMixers[i].update(delta);
        }
      }
    }
    this.moveSceneAnimationUpdate();

    this.renderer.render(this.scenes[0], this.cameras[0]);
    this.rendererSkill.render(this.scenes[1], this.cameras[1]);
    this.controls[0].update();
    this.controls[1].update();
    // this.stats.end();

    requestAnimationFrame(() => {
      this.rendering();
    });
  }

  moveSceneAnimationCreate(
    sceneName: string,
    direction: string,
    duration: number,
    target: string = "top",
    waitTime: number = 100
  ) {
    const targetNum = target === "top" ? 0 : target === "skill" ? 1 : 0;
    console.log(targetNum);
    if (sceneName === "penguin") {
      this.animateStack.push(
        new Easing(
          this.penguinScenes[targetNum],
          sceneName,
          direction,
          duration,
          waitTime
        )
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

    this.skillAreaSize.h = document.getElementById(
      "skill_container"
    ).offsetHeight;
    this.skillAreaSize.w = document.getElementById(
      "three_container2"
    ).offsetWidth;

    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.windowSize.w, this.windowSize.h);

    this.rendererSkill.setPixelRatio(window.devicePixelRatio);
    this.rendererSkill.setSize(this.skillAreaSize.w, this.skillAreaSize.h);

    this.cameras[0].aspect = this.windowSize.w / this.windowSize.h;
    this.cameras[0].updateProjectionMatrix();

    this.cameras[1].aspect = this.skillAreaSize.w / this.skillAreaSize.h;
    this.cameras[1].updateProjectionMatrix();
  }
}
