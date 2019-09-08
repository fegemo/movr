import { KinematicAgent, DynamicAgent } from "./ai/agent.js";
import { KinematicSeek, KinematicArrive, KinematicWander } from "./ai/kinematic/kinematic-movement.js";
import { Pose } from "./ai/structure.js";
import { Target } from "./ai/target.js";
import { Vector2 } from "./math/vector.js";
import { Toolbar, ExclusionGroup } from "./tools/tool.js";
import { AddAgentTool } from "./tools/add-agent.js";
import { ClearTool } from "./tools/clear.js";
import { DynamicSeek, DynamicFlee, DynamicArrive } from "./ai/dynamic/dynamic-movement.js";

const GRID_SIZE = 30;

// Um palco pode ter vários agentes,
// um objetivo, vários obstáculos
export default class Stage {
  
  constructor() {
    this.agents = [];
    this.target = new Target();
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
    this.toolbar.addTool(new ClearTool(this));
    const exclusionGroup = new ExclusionGroup();
    this.toolbar.addTool(new AddAgentTool(this, this.kinematic, KinematicAgent.factory).addToExclusionGroup(exclusionGroup));
    this.toolbar.addTool(new AddAgentTool(this, this.dynamic, DynamicAgent.factory).addToExclusionGroup(exclusionGroup));
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
    this.target.update(time);
  }

  render(ctx) {
    ctx.save();
    // desenha o cenário
    ctx.strokeStyle = '#aaa';
    for (let x = 0; x < this.canvas.el.width; x += GRID_SIZE) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, this.canvas.el.height - 1);
    }
    for (let y = 0; y < this.canvas.el.height; y += GRID_SIZE) {
      ctx.moveTo(0, y);
      ctx.lineTo(this.canvas.el.width - 1, y);
    }
    ctx.strokeStyle = '#ddd';
    ctx.stroke();

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
    this.target.render(ctx);

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
        // se click acertou um agente, defini-lo como alvo
        const clickPosition = new Vector2(e.clientX, e.clientY);
        const agentHit = this.agents.find(a => a.pose.position.sub(clickPosition).norm() <= a.radius*2);
        if (agentHit) {
          this.target.agentTarget = agentHit;
        } else {
          this.target.staticTarget = new Vector2(e.clientX, e.clientY);
        }
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