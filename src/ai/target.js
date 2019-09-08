import { Pose } from "./structure.js";
import { Vector2 } from "../math/vector.js";

export class Target {
  constructor(position) {
    this.staticTargetPosition = position;
    this.agentTargetPosition = null;
    this.visualTarget = new Pose();
  }
  
  set staticTarget(position) {
    this.staticTargetPosition = position;
    this.agentTargetPosition = null;
  }

  set agentTarget(agent) {
    this.agentTargetPosition = agent;
    this.staticTargetPosition = null;
  }

  get position() {
    if (!!this.agentTargetPosition) {
      return this.agentTargetPosition.pose.position;
    } else if (!!this.staticTargetPosition) {
      return this.staticTargetPosition;
    }
    return Vector2.ZERO;
  }

  render(ctx) {
    ctx.save();
    ctx.strokeStyle = '#333';
    ctx.setLineDash([2, 1]);/*dashes are 5px and spaces are 3px*/
    ctx.beginPath();
    ctx.translate(this.position.x, this.position.y);
    ctx.rotate(this.visualTarget.orientation);
    ctx.scale(this.visualTarget.scale, this.visualTarget.scale);
    ctx.arc(0, 0, 8, 0, 2 * Math.PI, false);
    ctx.stroke();
    ctx.restore();
  }

  update(time) {
    this.visualTarget.orientation += 0.5 * time;
    this.visualTarget.scale = Math.sin(this.visualTarget.orientation * Math.PI) / 5 + 2;
  }
}