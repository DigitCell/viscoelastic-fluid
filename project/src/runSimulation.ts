import * as dat from 'dat.gui';
import {Simulator} from './simulation'
import { FPSMonitor } from './FPSMonitor';
// Assume Simulator and FPSMonitor are defined elsewhere in your project
// import { Simulator, FPSMonitor } from './somewhere';

export function runSimulation() {
  let numParticles = 1700;

  //const canvas = document.getElementById("simCanvas2D") as HTMLCanvasElement;
  //const ctx = canvas.getContext("2d")!;

  const canvasSizeX=724;
  const canvasSizeY=724;
  //canvas.width =  canvasSizeX;//window.innerWidth;
  //canvas.height = canvasSizeY;//window.innerHeight;

  let simulator = new Simulator(canvasSizeX, canvasSizeY, numParticles);
  simulator.running = true;

  const fpsMonitor = new FPSMonitor();

  function loop() {
    simulator.update();
    fpsMonitor.update();

   // ctx.clearRect(0, 0, canvas.width, canvas.height);
    simulator.draw();

    requestAnimationFrame(loop);
  }

  loop();

  const gui = new dat.GUI();
  const materialParams = {
    numParticles: 1000,
    restDensity: 4.0,
    stiffness: 0.5,
    nearStiffness: 0.5,
    springStiffness: 0.0,
    plasticity: 0.5,
    yieldRatio: 0.25,
    minDistRatio: 0.25,
    linViscosity: 0.0,
    quadViscosity: 0.1,
    kernelRadius: 40.0,
    pointSize: 5,
    gravX: 0.0,
    gravY: 0.5,
    dt: 1.0,
    get fps() {
        return fpsMonitor.getFPS();
    },
    clearScreen: true,
    svgRender: false,
    canvasRender: true 
  };

  gui.add(materialParams, 'numParticles', 1000, 4000, 100).onChange(value => {
    numParticles = value;
    simulator = new Simulator(canvasSizeX, canvasSizeY, numParticles);
  });
  gui.add(materialParams, 'restDensity', 0.1, 8.0, 0.1).onChange(value => simulator.material.restDensity = value);
  gui.add(materialParams, 'stiffness', 0.1, 2.0, 0.1).onChange(value => simulator.material.stiffness = value);
  gui.add(materialParams, 'nearStiffness', 0.1, 2.0, 0.1).onChange(value => simulator.material.nearStiffness = value);
  gui.add(materialParams, 'springStiffness', 0.0, 0.5, 0.01).onChange(value => simulator.material.springStiffness = value);
  gui.add(materialParams, 'plasticity', 0.1, 1.0, 0.01).onChange(value => simulator.material.plasticity = value);
  gui.add(materialParams, 'yieldRatio', 0.1, 1.0, 0.01).onChange(value => simulator.material.yieldRatio = value);
  gui.add(materialParams, 'minDistRatio', 0.025, 1.0, 0.01).onChange(value => simulator.material.minDistRatio = value);
  gui.add(materialParams, 'linViscosity', 0.0, 0.5, 0.01).onChange(value => simulator.material.linViscosity = value);
  gui.add(materialParams, 'quadViscosity', 0.0, 0.5, 0.01).onChange(value => simulator.material.quadViscosity = value);
  gui.add(materialParams, 'kernelRadius', 5.0, 64.0, 1.0).onChange(value => simulator.material.kernelRadius = value);
  gui.add(materialParams, 'pointSize', 1, 20, 1).onChange(value => simulator.material.pointSize = value);
  gui.add(materialParams, 'gravX', -0.5, 0.5, 0.01).onChange(value => simulator.material.gravX = value);
  gui.add(materialParams, 'gravY', -0.5, 0.5, 0.01).onChange(value => simulator.material.gravY = value);
  gui.add(materialParams, 'dt', 0.1, 1.0, 0.1).onChange(value => simulator.material.dt = value);
  gui.add(materialParams, 'clearScreen').onChange(value => simulator.material.clearScreen = value);
  //gui.add(materialParams, 'canvasRender').onChange(value => simulator.material.canvasRender = value);
  //gui.add(materialParams, 'svgRender').onChange(value => simulator.material.svgRender = value);

  const canvasRenderController = gui.add(materialParams, 'canvasRender').onChange(value => {
    materialParams.canvasRender = value;
    if (value) {
      materialParams.svgRender = false;
      svgRenderController.updateDisplay();
    }
    simulator.setRenderMode(value ? 'canvas' : 'svg'); // Assuming your simulator has a method to set render mode
  });

  const svgRenderController = gui.add(materialParams, 'svgRender').onChange(value => {
    materialParams.svgRender = value;
    if (value) {
      materialParams.canvasRender = false;
      canvasRenderController.updateDisplay();
    }
    simulator.setRenderMode(value ? 'svg' : 'canvas'); // Assuming your simulator has a method to set render mode
  });
 

  gui.add(materialParams, 'fps').listen();

  const controls = {
    start: () => {
      simulator.start();
    },
    pause: () => {
      simulator.pause();
    },
    step: () => {
      simulator.running = true;
      simulator.update();
      simulator.running = false;
    },
    reset: () => {
      simulator = new Simulator(canvasSizeX, canvasSizeY, numParticles);
    }
  };

  gui.add(controls, 'start');
  gui.add(controls, 'pause');
  gui.add(controls, 'step');
  gui.add(controls, 'reset');

  window.addEventListener("resize", () => {
    //canvas.width = window.innerWidth;
    //canvas.height = window.innerHeight;
    simulator.resize(canvasSizeX, canvasSizeY);
  });

  window.addEventListener("pointermove", (e) => {
    simulator.mouseX = e.clientX;
    simulator.mouseY = e.clientY;
  });

  window.addEventListener("pointerdown", (e) => {
    simulator.mouseX = e.clientX;
    simulator.mouseY = e.clientY;
    simulator.mousePrevX = e.clientX;
    simulator.mousePrevY = e.clientY;

    if (e.button == 0) {
      simulator.drag = true;
    }
  });

  window.addEventListener("pointerup", (e) => {
    if (e.button == 0) {
      simulator.drag = false;
    }
  });

  const actionKeys = { "e": "emit", "d": "drain", "a": "attract", "r": "repel" };

  window.addEventListener("keydown", (e) => {
    if (actionKeys[e.key]) {
      simulator[actionKeys[e.key]] = true;
    }
  });

  window.addEventListener("keyup", (e) => {
    if (actionKeys[e.key]) {
      simulator[actionKeys[e.key]] = false;
    }
  });

  window.addEventListener("blur", () => {
    for (let key in actionKeys) {
      simulator[actionKeys[key]] = false;
    }

    simulator.drag = false;
  });
}
