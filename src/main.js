import { Canvas } from './graphics/canvas.js';
import Stage from './stage.js';

const canvasEl = document.querySelector('#main-canvas');
const canvas = new Canvas(canvasEl);
const stage = new Stage();

stage.attachTo(canvas);
stage.addAgent()
canvas.start();
