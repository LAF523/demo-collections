class FlipDOM {
  private dom: HTMLElement;
  private duration: number; // 单位秒
  private firstPos: { top: number; left: number };
  private lastPos: { top: number; left: number };
  private invert: { top: number; left: number };
  private playing: boolean;

  constructor(dom: HTMLElement, duration: number) {
    this.dom = dom;
    this.duration = duration * 1000;
    this.firstPos = { top: 0, left: 0 };
    this.lastPos = { top: 0, left: 0 };
    this.invert = { top: 0, left: 0 };
    this.playing = false;
    this.getFirstPos();
  }

  // First
  getFirstPos() {
    const { top, left } = this.dom.getBoundingClientRect();
    this.firstPos = { top, left };
  }
  // Last
  getLastPos() {
    const { top, left } = this.dom.getBoundingClientRect();
    this.lastPos = { top, left };
  }
  // invert
  getInvert() {
    this.invert = {
      top: this.firstPos.top - this.lastPos.top,
      left: this.firstPos.left - this.lastPos.left
    };
  }
  // play
  play() {
    this.getLastPos();
    this.getInvert();
    if (this.playing || (!this.invert.top && !this.invert.left)) {
      return;
    }
    this.playing = true;
    this.firstPos = this.lastPos;
    this.dom.getAnimations().forEach(animation => animation.cancel());
    this.dom.animate(
      [
        {
          transformOrigin: 'top left',
          transform: `translate(${this.invert.left}px,${this.invert.top}px)`
        },
        {
          transformOrigin: 'top left',
          transform: `none`
        }
      ],
      { duration: this.duration }
    );
    setTimeout(() => {
      this.playing = false;
    }, this.duration);
  }
}

class FlipDOMs {
  private filpDOMInstances: FlipDOM[];
  constructor(doms: HTMLElement[], duration: number = 0.2) {
    this.filpDOMInstances = doms.map(item => new FlipDOM(item, duration));
  }
  play() {
    this.filpDOMInstances.forEach(item => item.play());
  }
}

export default FlipDOMs;
export { FlipDOM };
