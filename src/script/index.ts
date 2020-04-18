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
      this.canvas.xFadeScene("pa");
    });
    document.getElementById("program").addEventListener("hover", () => {
      this.canvas.xFadeScene("program");
    });
    document.getElementById("electro").addEventListener("hover", () => {
      this.canvas.xFadeScene("electro");
    });

    //window resize
    window.addEventListener("resize", () => {
      this.canvas.windowResize();
    });
  }
}

const mainPage = new MainPage();
