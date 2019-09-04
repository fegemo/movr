import { SteeringOutput } from '../structure.js';
import { Vector2 } from '../../math/vector.js';

class DynamicMovement {
  constructor(maxSpeed, maxAcceleration) {
    this.target = null;
    this.maxSpeed = maxSpeed;
    this.maxAcceleration = maxAcceleration;
  }

  getSteering() {
    throw new Error('Should not instantiate class DynamicMovement directly - getSteering() is an abstract method.');
  }

  getNewOrientation(currentOrientation, velocity) {
    if (!velocity.isZero()) {
      return Math.atan2(velocity.y, velocity.x);
    }
    return currentOrientation;
  }
}

export class DynamicSeek extends DynamicMovement {
  constructor(maxSpeed, maxAcceleration) {
    super(maxSpeed, maxAcceleration);
  }

  getSteering(agentPose) {
    let linear = this.target.position.sub(agentPose.position).normalize().mult(this.maxAcceleration);
    agentPose.orientation = super.getNewOrientation(agentPose.orientation, agentPose.velocity)
    return new SteeringOutput(linear, 0);
  }
}

export class DynamicFlee extends DynamicSeek {
  constructor(maxSpeed, maxAcceleration) {
    super(maxSpeed, maxAcceleration);
  }

  getSteering(agentPose) {
    let seekSteering = super.getSteering(agentPose);
    seekSteering.linear = seekSteering.linear.mult(-1);
    return seekSteering;
  }
}

export class DynamicArrive extends DynamicMovement {
  constructor(maxSpeed, maxAcceleration, targetRadius = 5, slowRadius = 125) {
    super(maxSpeed, maxAcceleration);
    this.targetRadius = targetRadius;
    this.slowRadius = slowRadius;
    this.timeToTarget = 0.1;
  }

  getSteering(agentPose) {
    let direction = this.target.position.sub(agentPose.position);
    const distance = direction.norm();
    
    if (distance < this.targetRadius) {
      return new SteeringOutput(agentPose.velocity.mult(-1), 0);
    }
    
    let targetSpeed = this.maxSpeed;
    if (distance <= this.slowRadius) {
      targetSpeed *= distance / (this.slowRadius - this.targetRadius);
    }

    let targetVelocity = direction.mult(targetSpeed / distance);

    let linear = targetVelocity.sub(agentPose.velocity);
    linear = linear.mult(1/this.timeToTarget);

    if (linear.norm() > this.maxAcceleration) {
      linear = linear.normalize().mult(this.maxAcceleration);
    }

    agentPose.orientation = super.getNewOrientation(agentPose.orientation, agentPose.velocity)
    return new SteeringOutput(linear, 0);
  }
}