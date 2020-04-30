import Canvas from "./Canvas";
import ItemShadow from "./ItemShadow";
import Icon from "./Icon";

import smoothscroll from "smoothscroll-polyfill";

class MainPage {
  private canvas: Canvas;
  private itemShadow: ItemShadow;
  private icon: Icon;

  constructor() {
    this.canvas = new Canvas();
    this.initEvent();

    this.itemShadow = new ItemShadow();
    this.itemShadow.listenEvent();

    this.icon = new Icon();
  }

  initEvent() {
    // skill
    document.getElementById("program").addEventListener("mouseover", () => {
      this.canvas.xFadeScene("program", "skill");
      this.allSkillSectionDisActive();
      document.getElementById("program").classList.add("playing");
    });
    document.getElementById("electro").addEventListener("mouseover", () => {
      this.canvas.xFadeScene("electro", "skill");
      this.allSkillSectionDisActive();
      document.getElementById("electro").classList.add("playing");
    });
    document.getElementById("pa").addEventListener("mouseover", () => {
      this.canvas.xFadeScene("pa", "skill");
      this.allSkillSectionDisActive();
      document.getElementById("pa").classList.add("playing");
    });

    // document.getElementById("idle").addEventListener("click", () => {
    //   this.canvas.xFadeScene("idle", "skill");
    // });
    document.getElementById("pa").addEventListener("click", () => {
      this.canvas.xFadeScene("pa", "skill");
    });
    document.getElementById("program").addEventListener("click", () => {
      this.canvas.xFadeScene("program", "skill");
    });
    document.getElementById("electro").addEventListener("click", () => {
      this.canvas.xFadeScene("electro", "skill");
    });

    // document.getElementById("penguin_in1").addEventListener("click", () => {
    //   this.canvas.moveSceneAnimationCreate("penguin", "up", 500, "top");
    // });
    // document.getElementById("penguin_out1").addEventListener("click", () => {
    //   this.canvas.moveSceneAnimationCreate("penguin", "down", 500, "top");
    // });
    // document.getElementById("penguin_in2").addEventListener("click", () => {
    //   this.canvas.moveSceneAnimationCreate("penguin", "up", 500, "skill");
    // });
    // document.getElementById("penguin_out2").addEventListener("click", () => {
    //   this.canvas.moveSceneAnimationCreate("penguin", "down", 500, "skill");
    // });

    //window resize
    window.addEventListener("resize", () => {
      this.canvas.windowResize();
    });
  }

  private getCurrentPage(pageNum: number = 4): number {
    const windowHeight = window.innerHeight;

    for (let i = 1; i <= pageNum; i++) {
      const topPos = document.getElementById(`page${i}`).getBoundingClientRect()
        .top;
      if (0 <= topPos && topPos < windowHeight * i) {
        return i;
      }
    }
  }

  private allSkillSectionDisActive() {
    Array.from(document.getElementsByClassName("skillSection")).map(ele => {
      ele.classList.remove("playing");
    });
  }
}

const mainPage = new MainPage();

//polyfill
smoothscroll.polyfill();
