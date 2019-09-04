import { KinematicAgent, DynamicAgent } from "./ai/agent.js";
import { KinematicSeek, KinematicArrive, KinematicWander } from "./ai/kinematic/kinematic-movement.js";
import { Pose } from "./ai/structure.js";
import { Vector2 } from "./math/vector.js";
import { Toolbar } from "./tools/tool.js";
import { AddAgentTool } from "./tools/addAgentTool.js";
import { DynamicSeek, DynamicFlee, DynamicArrive } from "./ai/dynamic/dynamic-movement.js";

// Um palco pode ter vários agentes,
// um objetivo, vários obstáculos
export default class Stage {
  
  constructor() {
    this.agents = [];
    this.target = new Pose();
    this.kinematic = {
      seek: new KinematicSeek( 100),
      flee: new KinematicSeek(-100),
      arrive: new KinematicArrive(100),
      wander: new KinematicWander(100, 10)
    };
    this.dynamic = {
      seek: new DynamicSeek(100, 400),
      flee: new DynamicFlee(100, 400),
      arrive: new DynamicArrive(100, 400),
    };
    this.toolbar = new Toolbar(document.createElement('div'));
    this.toolbar.addTool(new AddAgentTool(this, this.kinematic, KinematicAgent.factory));
    this.toolbar.addTool(new AddAgentTool(this, this.dynamic, DynamicAgent.factory));
    document.body.appendChild(this.toolbar.el);
  }

  attachTo(canvas) {
    canvas.onClick = this.click.bind(this);
    canvas.onMouseMove = this.mouseMove.bind(this);
    canvas.onUpdate = this.update.bind(this);
    canvas.onRender = this.render.bind(this);
    this.canvas = canvas;
  }

  update(time) {
    // atualiza agentes
    this.agents.forEach(a => a.update(time, this, this.dynamic.arrive.maxSpeed));

    // atualiza rotação e escala do alvo, pra ficar bonito
    this.target.orientation += 0.5 * time;
    this.target.scale = Math.sin(this.target.orientation * Math.PI) / 5 + 2;
  }

  render(ctx) {
    ctx.save();
    // desenha o cenário

    // desenha os agentes
    this.agents.forEach(a => {
      ctx.save();
      ctx.translate(a.pose.position.x, a.pose.position.y);
      ctx.rotate(a.pose.orientation);
      ctx.beginPath();
      ctx.moveTo(-a.radius, -a.radius/2);
      ctx.lineTo(-a.radius,  a.radius/2);
      ctx.lineTo( a.radius,  0);
      ctx.closePath();
      ctx.fillStyle = '#333';
      ctx.fill();
      ctx.restore();
    });

    // desenha o objetivo
    ctx.save();
    ctx.setLineDash([2, 1]);/*dashes are 5px and spaces are 3px*/
    ctx.beginPath();
    ctx.translate(this.target.position.x, this.target.position.y);
    ctx.rotate(this.target.orientation);
    ctx.scale(this.target.scale, this.target.scale);
    ctx.arc(0, 0, 8, 0, 2*Math.PI, false);
    ctx.stroke();
    ctx.restore();

    // desenha os obstáculos

    ctx.restore();
  }

  click(e) {
    // define posição do alvo
    switch (e.button) {
      case 0: // left
      case 1: // middle
        break;
      case 2: // right
        this.target.position = new Vector2(e.clientX, e.clientY);
    }
  }

  mouseMove(e) {

  }

  addAgent(position = Vector2.ZERO, orientation = 0, movement, agentFactory) {
    const newAgent = agentFactory.create(movement, position, orientation);
    newAgent.target = this.target;
    this.agents.push(newAgent);
  }

  getRandomPosition() {
    return new Vector2(
      Math.random() * this.canvas.el.width,
      Math.random() * this.canvas.el.height
    );
  }

}