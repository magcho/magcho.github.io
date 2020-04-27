export default class Icon {
  private windowSize;
  constructor() {
    this.setStyleProperty("iconTranslateY", "3%");
    this.setStyleProperty("iconTranslateX", "0%");
    this.getWindowSize();
    this.setEventListener();
  }

  /**
   * アイコン画像に対してマウスインタラクション
   */
  update(mouseX: number, mouseY: number) {
    const eleRect: DOMRect = document
      .getElementById("icon-frame")
      .getBoundingClientRect();
    const elePos = {
      x: (eleRect.left + eleRect.right) / 2,
      y: (eleRect.top + eleRect.bottom) / 2
    };

    const horizontMoveAmount =
      Math.floor(((elePos.x - mouseX) / (this.windowSize.x / 2)) * 3000) / 1000;
    const verticalMoveAmount =
      Math.floor(((elePos.y - mouseY) / (this.windowSize.y / 2)) * 3000) / 1000;

    this.setStyleProperty("iconTranslateX", `${horizontMoveAmount}%`);
    this.setStyleProperty("iconTranslateY", `${verticalMoveAmount + 3}%`);
  }

  /**
   * init event
   */
  setEventListener() {
    document.getElementById("page4").addEventListener("mousemove", e => {
      this.update(e.x, e.y);
    });
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

  getWindowSize() {
    this.windowSize = { x: window.innerWidth, y: window.innerHeight };
  }
}
