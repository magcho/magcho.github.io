import Canvas from "./Canvas";

class MainPage {
  private canvas: Canvas;
  constructor() {
    this.canvas = new Canvas();
    this.initEvent();
  }

  initEvent() {
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
  }
}

const mainPage = new MainPage();
