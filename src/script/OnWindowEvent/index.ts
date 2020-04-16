interface Item {
  eventName: string;
  element: Element;
  callback: Function;
  isOnWindow: boolean;
}

export default class OnWinowEvent {
  private stack: Item[];
  private windowHeight: number;

  constructor() {
    this.stack = [];
    const offset = (this.windowHeight = window.innerHeight);

    window.addEventListener("scroll", () => {
      this.update();
    });
    window.addEventListener("resize", () => {
      this.windowHeight = window.innerHeight;
      this.update();
    });
  }

  addEventListener(eventName: string, elm: Element, callback: Function) {
    let state = false;

    if (0 <= elm.getBoundingClientRect().top) {
      return true;
    }

    const item: Item = {
      eventName: eventName,
      element: elm,
      callback: callback,
      isOnWindow: false,
    };
    this.stack.push(item);
  }
  update() {
    console.log(this.stack);
    console.log("update");

    this.stack.map((item) => {
      const offset =
        item.element.getBoundingClientRect().top - this.windowHeight;
      if (item.isOnWindow) {
        if (offset < 0 || this.windowHeight < offset) {
          // viewport内->外
          item.isOnWindow = false;
          if (item.eventName === "out") {
            item.callback();
          }
        }
      } else {
        if (0 <= offset || offset <= this.windowHeight) {
          // viewport外-内
          item.isOnWindow = true;
          if (item.eventName === "in") {
            item.callback();
          }
        }
      }
    });
  }
}
