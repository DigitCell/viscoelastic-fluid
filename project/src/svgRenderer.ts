import { SVG, Svg, Circle } from '@svgdotjs/svg.js';
import  '@svgdotjs/svg.filter.js';
import { Particle, Material } from './simulation'; // Adjust the import path as needed

class SvgRenderer {
  private draw: Svg;
  private circles: Circle[];
  private previousPointSize: number;
  //private previousPositions: { x: number, y: number, color: string }[];

  constructor(containerId: string, width: number, height: number) {
    this.draw = SVG().addTo(containerId).size(width+110, height+110);
    this.circles = [];
  }

   // Define and add the filter to the SVG canvas
  private addFilter(): void {
    const filter = this.draw.defs().filter().attr({ id: 'blurFilter' });
    filter.gaussianBlur(5,5); // Adjust the blur amount as needed

    this.draw.attr({ filter: 'url(#blurFilter)' });
  }

  private addFilter2(): void {
    const defs = this.draw.defs();

    // Add the goo filter
    const filter = defs.filter().attr({ id: 'goo' });
    filter.gaussianBlur(5.5,5.5).attr({ in: 'SourceGraphic', result: 'blur' });
    filter.colorMatrix("matrix",  "1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 13 -7").attr({ in: 'blur', result: 'goo' });
    filter.composite('SourceGraphic', 'goo', 'atop').attr({ in: 'goo', result: 'finalGoo' });

    // Add the linear gradients
    
    defs.gradient('linear', function (add) {
      add.stop(0, '#b03');
      add.stop(1, '#f09');
    }).attr({ id: 'linear1', x1: 0, y1: 1, x2: 0, y2: 1 });

    defs.gradient('linear', function (add) {
      add.stop(0, '#b30');
      add.stop(1, '#f20');
    }).attr({ id: 'linear2', x1: 0, y1: 0, x2: 0, y2: 1 });

    // Apply the goo filter to the entire SVG canvas
    this.draw.attr({ filter: 'url(#goo)' });
  }   

  init(particles: Particle[], material:Material): void {

    this.previousPointSize = material.pointSize; 

    // Clear existing circles before initializing new ones
    this.draw.clear();

    this.addFilter2(); // Re-add the filter after clearing

    this.circles = particles.map(p => {
        const speed = Math.min(Math.sqrt(p.velX * p.velX + p.velY * p.velY) * 55, 255);
        const roundedSpeed = Math.round(speed);
        const color = `rgb(255, 155, ${roundedSpeed})`;
      return this.draw.circle(material.pointSize).attr({
        cx: 100+p.posX,
        cy: 100+p.posY,
        fill: color
       
      });
    });
  }

  update(particles: Particle[], material:Material): void {
    // Ensure the number of circles matches the number of particles
    if (this.circles.length !== particles.length || this.previousPointSize !== material.pointSize) {
      this.init(particles, material);
      return;
    }

    particles.forEach((p, i) => {
      const speed = Math.min(Math.sqrt(p.velX * p.velX + p.velY * p.velY) * 55, 255);
      const roundedSpeed = Math.round(speed);
      const color = `rgb(255, 155, ${roundedSpeed})`;
      this.circles[i].attr({
        cx: 100+p.posX,
        cy: 100+p.posY,
        fill: color
      });
    });
  }
}


export {SvgRenderer}
