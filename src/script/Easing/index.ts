import { Group } from "three";

export default class Easing {
  private startTS: number;
  private scene: Group;
  private direction: string;
  private duration: number;
  private waitTimeMs: number;
  private name: string;

  private ts: number;

  constructor(
    scene: Group,
    name: string,
    direction: string,
    duration: number,
    waitTimeMs: number = 100
  ) {
    this.scene = scene;
    this.name = name;
    this.direction = direction;
    this.duration = duration;
    this.waitTimeMs = waitTimeMs;

    this.startTS = performance.now();
  }

  update(): boolean {
    this.ts = performance.now();

    if (this.name === "penguin") {
      if (this.direction === "up") {
        this.scene.position.y = this.eraseInBack();
      } else if (this.direction === "down") {
        this.scene.position.y = this.eraseIn();
      }
    } else {
      if (this.direction === "up") {
        this.scene.position.y = this.eraseOut();
      } else if (this.direction === "down") {
        // reverve wait
        if (this.waitTimeMs > this.ts - this.startTS) {
          return true;
        }
        this.scene.position.y = this.eraseIn();
      }
    }

    let adjust = 0;
    if (this.name === "penguin") adjust = 100;

    if (this.ts - this.startTS >= this.duration + adjust) {
      if (this.direction === "up") {
        this.scene.position.y = 0;
      } else {
        this.scene.remove();
      }

      return false;
    } else {
      return true;
    }
  }

  private eraseIn(): number {
    let ts: number = performance.now() - this.startTS;
    const moveDistance = -1.1;

    ts /= this.duration;
    return -moveDistance * (Math.sqrt(1 - ts * ts) - 1);
  }
  private eraseOut(): number {
    let ts: number = this.ts - this.startTS;
    const moveDistance = 1.1;

    ts /= this.duration;
    ts--;
    return moveDistance * Math.sqrt(1 - ts * ts) - 1.1;
  }

  private eraseInBack(): number {
    let ts: number = this.ts - this.startTS;
    const moveDistance = 1.1;
    const magicNumber = 1.70158;

    ts /= this.duration;
    const i = magicNumber + 1;
    return (
      -1 *
      (moveDistance -
        (1 + i * Math.pow(ts - 1, 3) + magicNumber * Math.pow(ts - 1, 2)))
    );
  }
}
