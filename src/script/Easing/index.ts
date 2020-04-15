import { Group } from "three";
import * as THREE from "three";
import { PrefetchPlugin } from "webpack";

export default class Easing {
  public name: string;
  private startTS: number;
  private scene: Group;
  private direction: string;
  private duration: number;

  constructor(scene: Group, name: string, direction: string, duration: number) {
    this.scene = scene;
    this.name = name;
    this.direction = direction;
    this.duration = duration;

    this.startTS = performance.now();
  }

  update(): boolean {
    console.count();
    console.log(this.duration);
    if (this.direction === "up") {
      this.scene.position.y = this.eraseOut();
    } else if (this.direction === "down") {
      this.scene.position.y = this.eraseIn();
    }

    if (performance.now() - this.startTS >= this.duration) {
      this.scene.position.y = 0;
      return false;
    } else {
      return true;
    }
  }

  private eraseIn(): number {
    let ts: number = performance.now();
    const moveDistance = 1.1;

    ts /= this.duration;
    return moveDistance * ts * ts + -1.1;
  }
  private eraseOut(): number {
    let ts: number = performance.now() - this.startTS;
    const moveDistance = 1.1;

    // ts /= this.duration;
    // return -moveDistance * ts * (ts - 2) - 1;

    ts /= this.duration;
    ts--;
    return moveDistance * Math.sqrt(1 - ts * ts) - 1.1;
  }
}
