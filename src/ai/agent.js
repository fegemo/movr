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

  static get factory() {
    return {
      create(movement, position, orientation) {
        return new KinematicAgent(movement, new Pose(position, orientation));
      }
    }
  }
}

export class DynamicAgent extends Agent {
  constructor(movement, pose = new Kinematic()) {
    super(movement);
    this.pose = pose;
  }
  
  update(time, stage, maxSpeed) {
    const steering = this.movement.getSteering(this.pose);
    this.pose.update(steering, maxSpeed, time);
    this.revolve(stage);
  }
  
  static get factory() {
    return {
      create(movement, position, orientation) {
        return new DynamicAgent(movement, new Kinematic(position, orientation));
      }
    }
  }
}