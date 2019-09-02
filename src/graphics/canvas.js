let lastTimestamp = 0;

export class Canvas {
  constructor(el, targetUPS = 30) {
    this.el = el;
    this.updatePeriod = 1000/targetUPS;
  }
  
  start() {
    this.ctx = this.el.getContext('2d');
    this.el.height = window.innerHeight;
    this.el.width = window.innerWidth;
    
    window.addEventListener('resize', this.resize.bind(this));
    this.el.addEventListener('mousemove', this.mouseMove.bind(this));
    this.el.addEventListener('mousedown', this.click.bind(this));
    this.el.oncontextmenu = () => false;
    requestAnimationFrame(this.loop.bind(this));
  }

  loop(timestamp) {
    const delta = timestamp - lastTimestamp;
    this.update(delta / 1000);
    this.render();
    requestAnimationFrame(this.loop.bind(this));
    lastTimestamp = timestamp;
  }

  update(time) {
    if (!!this.onUpdate) {
      this.onUpdate(time);
    }
  }

  render() {
    this.ctx.clearRect(0, 0, this.el.width, this.el.height);
    if (!!this.onRender) {
      this.onRender(this.ctx);
    }
  }

  mouseMove(e) {
    if (!!this.onMouseMove) {
      this.onMouseMove(e);
    }
  }
  
  click(e) {
    if (!!this.onClick) {
      this.onClick(e);
    }
  }

  resize() {
    this.el.width = window.innerWidth;
    this.el.height = window.innerHeight;
  }
}