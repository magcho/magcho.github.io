import Canvas from "./Canvas";

class MainPage {
  private canvas: Canvas;
  constructor() {
    this.canvas = new Canvas();
  }

  initEvent() {
    document.getElementById("idle").addEventListener("click", () => {
      this.canvas.changeScene("idle");
    });
    document.getElementById("pa").addEventListener("click", () => {
      this.canvas.changeScene("pa");
    });
    document.getElementById("program").addEventListener("click", () => {
      this.canvas.changeScene("program");
    });
    document.getElementById("electro").addEventListener("click", () => {
      this.canvas.changeScene("electro");
    });
  }
}

const mainPage = new MainPage();
