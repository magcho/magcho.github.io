import Canvas from "./Canvas";
import OnWindowEvent from "./OnWindowEvent";

class MainPage {
  private canvas: Canvas;
  private onWindowEvent: OnWindowEvent;

  private currentPage: number;

  constructor() {
    this.canvas = new Canvas();
    // this.onWindowEvent = new OnWindowEvent();
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

    // currentPage
    document
      .getElementById("contents_container")
      .addEventListener("scroll", (e) => {
        this.currentPage = this.getCurrentPage();
      });
    window.addEventListener("resize", () => {
      this.currentPage = this.getCurrentPage();
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
