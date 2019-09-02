import { Pose, Kinematic } from './structure.js';


class Agent {
  constructor(movement) {
    this.movement = movement;
    this.radius = 8;
  }
  
  set target(target) {
    this.movement.target = target;
  }
  
  revolve(stage) {
    const revolveAxis = axis => {
      const dimension = axis === 'x' ? 'width' : 'height';
      if (this.pose.position[axis] + this.radius < 0) {
        this.pose.position[axis] += stage.canvas.el[dimension] + this.radius;
      } else if (this.pose.position[axis] - this.radius >= stage.canvas.el[dimension]) {
        this.pose.position[axis] -= stage.canvas.el[dimension] + this.radius;
      }
    };

    if (!!stage) {
      revolveAxis('x');
      revolveAxis('y');
    }
  }
}

export class KinematicAgent extends Agent {
  constructor(movement, pose = new Pose()) {
    super(movement);
    this.pose = pose;
  }
  
  update(time, stage) {
    const steering = this.movement.getSteering(this.pose);
    this.pose.update(steering, time);
    this.revolve(stage);
  }
}

export class DynamicAgent extends Agent {
  constructor(movement) {
    super(movement);
    this.pose = new Kinematic();
  }
  
  update(time, stage) {
    const steering = this.movement.getSteering();
    this.pose.update(steering, time);
    this.revolve(stage);
  }
}