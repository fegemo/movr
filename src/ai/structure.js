import { Vector2 } from '../math/vector.js';

export class Pose {
  constructor(position = Vector2.ZERO, orientation = 0) {
    this.position = position;
    this.orientation = orientation;
  }

  update(steering, time) {
    // atualiza a posição e orientação
    this.position = this.position.add(steering.velocity.mult(time));
    this.orientation = this.orientation + steering.rotation * time;
  }
}

export class Kinematic extends Pose {
  constructor(position, orientation, velocity = Vector2.ZERO, rotation = 0) {
    super(position, orientation);
    this.velocity = velocity;
    this.rotation = rotation;
  }
  
  update(steering, maxSpeed, time) {
    this.position = this.position.add(this.velocity.mult(time));
    this.orientation = this.orientation + this.rotation * time;

      // atualiza a velocidade linear e angular
    this.velocity = this.velocity.add(steering.linear.mult(time));
    this.orientation = this.orientation + (steering.angular * time);

    // se a velocidade linear exceder a máxima, limitar
    if (this.velocity.norm() > maxSpeed) {
      this.velocity = this.velocity.normalize().mult(maxSpeed);
    }
  }
}

export class KinematicSteeringOutput {
  constructor(velocity = Vector2.ZERO, rotation = 0) {
    this.velocity = velocity;
    this.rotation = rotation;
  }
}

export class SteeringOutput {
  constructor(linear = Vector2.ZERO, angular = 0) {
    this.linear = linear;
    this.angular = angular;
  }
}