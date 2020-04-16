import Canvas from "./Canvas";

class MainPage {
  private canvas: Canvas;
  constructor() {
    this.canvas = new Canvas();
    this.initEvent();
  }

  initEvent() {
    // click event
    document.getElementById("idle").addEventListener("click", () => {
      this.canvas.xFadeScene("idle");
    });
    document.getElementById("pa").addEventListener("click", () => {
      this.canvas.xFadeScene("pa");
    });
    document.getElementById("program").addEventListener("click", () => {
      this.canvas.xFadeScene("program");
    });
    document.getElementById("electro").addEventListener("click", () => {
      this.canvas.xFadeScene("electro");
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
}

const mainPage = new MainPage();
