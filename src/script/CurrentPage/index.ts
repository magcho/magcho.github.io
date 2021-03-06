export default class CurrentPage {
  public page: number;
  private previousPage: number;
  public status: [number, number]; // [previous, next] page

  constructor() {
    this.previousPage = 0;
    this.page = this.get();
    this.status = [0, 0];
  }

  /**
   * 現在のページ番号を取得
   */
  get(pageNum: number = 4): number {
    const windowHeight = window.innerHeight;

    for (let i = 1; i <= pageNum; i++) {
      const topPos = document.getElementById(`page${i}`).getBoundingClientRect()
        .top;
      if (0 <= topPos && topPos < windowHeight * i) {
        return i;
      }
    }
  }

  /**
   * ページ遷移を監視
   * @return ページ遷移があるか
   */
  update() {
    const page = this.get();

    if (this.page !== page) {
      this.status = [this.page, page];
      this.page = page;
      return true;
    }
    return false;
  }

  /**
   * ページ遷移が終了したらtrue
   * @return
   */
  isPageMoveEnd(pageNum: number = 4) {
    for (let i = 1; i <= pageNum; i++) {
      const topPos = document.getElementById(`page${i}`).getBoundingClientRect()
        .top;
      if (0 === topPos && this.previousPage !== i) {
        this.previousPage = this.page;
        this.page = i;
        return true;
      }
    }
    return false;
  }
}
