import { Pose, Kinematic } from './structure.js';

class Agent {
  constructor(movement) {
    this.movement = movement;
  }

  set target(target) {
    this.movement.target = target;
  }
}

export class KinematicAgent extends Agent {
  constructor(movement, pose = new Pose()) {
    super(movement);
    this.pose = pose;
  }
  
  update(time) {
    const steering = this.movement.getSteering(this.pose);
    this.pose.update(steering, time);
  }
}

export class DynamicAgent extends Agent {
  constructor(movement) {
    super(movement);
    this.pose = new Kinematic();
  }

  update(time) {
    const steering = this.movement.getSteering();
    this.pose.update(steering, time);
  }
}