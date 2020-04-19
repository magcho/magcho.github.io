import Canvas from "./Canvas";

class MainPage {
  private canvas: Canvas;

  constructor() {
    this.canvas = new Canvas();

    this.initEvent();
  }

  initEvent() {
    // skill
    document.getElementById("pa").addEventListener("hover", () => {
      this.canvas.xFadeScene("pa", "skill");
    });
    document.getElementById("program").addEventListener("hover", () => {
      this.canvas.xFadeScene("program", "skill");
    });
    document.getElementById("electro").addEventListener("hover", () => {
      this.canvas.xFadeScene("electro", "skill");
    });

    document.getElementById("idle").addEventListener("click", () => {
      this.canvas.xFadeScene("idle", "skill");
    });
    document.getElementById("pa").addEventListener("click", () => {
      this.canvas.xFadeScene("pa", "skill");
    });
    document.getElementById("program").addEventListener("click", () => {
      this.canvas.xFadeScene("program", "skill");
    });
    document.getElementById("electro").addEventListener("click", () => {
      this.canvas.xFadeScene("electro", "skill");
    });

    document.getElementById("penguin_in").addEventListener("click", () => {
      this.canvas.moveSceneAnimationCreate("penguin", "up", 500);
    });
    document.getElementById("penguin_out").addEventListener("click", () => {
      this.canvas.moveSceneAnimationCreate("penguin", "down", 500);
    });

    //window resize
    window.addEventListener("resize", () => {
      this.canvas.windowResize();
    });
  }

  getCurrentPage(pageNum: number = 4): number {
    const windowHeight = window.innerHeight;

    for (let i = 1; i <= pageNum; i++) {
      const topPos = document.getElementById(`page${i}`).getBoundingClientRect()
        .top;
      if (0 <= topPos && topPos < windowHeight * i) {
        return i;
      }
    }
  }
}

const mainPage = new MainPage();
