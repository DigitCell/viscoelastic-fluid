class FPSMonitor {
    fps: number;
    private measureInterval: number;
    private lastMeasure: number;
    private frames: number;
  
    constructor(measureInterval = 1000) {
      this.measureInterval = measureInterval;
      this.lastMeasure = performance.now();
      this.frames = 0;
      this.fps = 0;
    }
  
    update() {
      this.frames++;
      const now = performance.now();
      if (now - this.lastMeasure >= this.measureInterval) {
        this.fps = this.frames / (now - this.lastMeasure) * 1000;
        this.lastMeasure = now;
        this.frames = 0;
      }
    }
  
    getFPS() {
      return this.fps.toFixed(2);
    }
  }

  export{FPSMonitor};