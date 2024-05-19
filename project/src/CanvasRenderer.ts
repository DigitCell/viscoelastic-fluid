import { Particle, Material } from './simulation'; // Adjust the import path as needed

class CanvasRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private particles: Particle[];

  constructor(containerId: string, width: number, height: number) {
    const canvas = document.getElementById(containerId) as HTMLCanvasElement;
    if (!canvas) {
      throw new Error(`Canvas with id ${containerId} not found`);
    }

    this.canvas = canvas;
    this.canvas.width = width + 110;
    this.canvas.height = height + 110;

    this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    if (!this.ctx) {
      throw new Error('2D context not supported or canvas already initialized');
    }

    this.particles = [];
  }

  init(particles: Particle[], material:Material): void {
    this.particles = particles;
    this.draw( material);
  }

  update(particles: Particle[],material:Material): void {
    this.particles = particles;
    this.draw( material);
  }

  private draw(material:Material): void {
    if(material.clearScreen)
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    //this.ctx.filter = 'blur(3.5px)';

    for (let p of this.particles) {
      const speed = Math.min(Math.sqrt(p.velX * p.velX + p.velY * p.velY) * 55, 255);
      const roundedSpeed = Math.round(speed);
      const color = `rgb(255, 155, ${roundedSpeed})`;

      this.ctx.beginPath();
      this.ctx.arc(100 + p.posX,  p.posY, material.pointSize, 0, 2 * Math.PI, false);
      this.ctx.fillStyle = color;
      this.ctx.fill();
    }

  //  this.ctx.filter = 'none';
  }
}

export { CanvasRenderer };
