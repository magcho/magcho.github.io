export default class ItemShadow {
  private windowSize;
  constructor() {
    this.updateWindowState();
  }
  updateWindowState() {
    this.windowSize = {
      x: window.innerWidth,
      y: window.innerHeight,
      center: {}
    };
    this.windowSize.center = {
      x: Math.floor(this.windowSize.x / 2),
      y: Math.floor(this.windowSize.y / 2)
    };
  }

  eventCallback(e) {
    const eleSize = document.getElementById("activity_container")
      .childElementCount;

    for (let i = 1; i <= eleSize; i++) {
      this.update(e.x, e.y, i);
    }
  }

  /**
   * css varにjsから値を渡す
   */
  setStyleProperty(property: string, value: string, itemId: number = 0) {
    if (itemId === 0) {
      // default ドキュメントrootに設定
      document.documentElement.style.setProperty(`--${property}`, value);
    } else {
      document
        .getElementById(`${itemId}`)
        .style.setProperty(`--${property}`, value);
    }
  }

  update(mouseX: number = 0, mouseY: number = 0, itemId: number = 1) {
    // element stats
    const ele = document.getElementById(`${itemId}`).getBoundingClientRect();
    const rect = {
      center: {
        x: (ele.left + ele.right) / 2,
        y: (ele.bottom + ele.top) / 2
      }
    };

    // mouse stats
    let mouse = {
      position: {
        x: mouseX,
        y: mouseY
      },
      horizont: "",
      vertical: ""
    };

    if (mouse.position.x - rect.center.x > 0) {
      mouse.horizont = "right";
    } else {
      mouse.horizont = "left";
    }

    if (mouse.position.y - rect.center.y > 0) {
      mouse.vertical = "lower";
    } else {
      mouse.vertical = "upper";
    }

    // calc for style
    const beforeY =
      Math.floor(
        Math.atan2(
          rect.center.y - mouse.position.y,
          rect.center.x - mouse.position.x
        ) * 1000
      ) / 1000;
    const afterX = -1 * (beforeY - Math.PI / 2);
    this.setStyleProperty("beforeY", `${beforeY}rad`, itemId);
    this.setStyleProperty("afterX", `${afterX}rad`, itemId);

    if (mouse.horizont === "right") {
      this.setStyleProperty("beforeLeft", "0%", itemId);
      this.setStyleProperty("beforeRotate", "180deg", itemId);
      this.setStyleProperty("beforeTop", "100%", itemId);
    } else {
      this.setStyleProperty("beforeLeft", "100%", itemId);
      this.setStyleProperty("beforeRotate", "0deg", itemId);
      this.setStyleProperty("beforeTop", "0%", itemId);
    }

    if (mouse.vertical === "upper") {
      this.setStyleProperty("afterTop", "100%", itemId);
      this.setStyleProperty("afterRotate", "0deg", itemId);
      this.setStyleProperty("afterLeft", "0%", itemId);
    } else {
      this.setStyleProperty("afterTop", "0%", itemId);
      this.setStyleProperty("afterRotate", "180deg", itemId);
      this.setStyleProperty("afterLeft", "100%", itemId);
    }
  }

  listenEvent() {
    document.getElementById("page3").addEventListener("scroll", e => {
      const displayCenterPos = {
        x: this.windowSize.center.x,
        y: this.windowSize.center.y
      };
      this.eventCallback(displayCenterPos);
    });

    window.addEventListener("resize", () => {
      this.updateWindowState();
    });
  }
}
