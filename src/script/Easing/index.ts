import { Group } from "three";

export default class Easing {
  private name: string;
  private startTS: number;
  private scene: Group;
  private direction: string;
  private duration: number;
  private waitTimeMs: number;

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
    if (this.direction === "up") {
      this.scene.position.y = this.eraseOut();
    } else if (this.direction === "down") {
      // reverve wait
      if (this.waitTimeMs > this.ts - this.startTS) {
        return true;
      }
      this.scene.position.y = this.eraseIn();
    }

    if (this.ts - this.startTS >= this.duration) {
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
    let ts: number = performance.now() - this.startTS;
    const moveDistance = 1.1;

    ts /= this.duration;
    ts--;
    return moveDistance * Math.sqrt(1 - ts * ts) - 1.1;
  }
}
