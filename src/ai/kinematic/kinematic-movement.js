import { KinematicSteeringOutput } from '../structure.js';
// import { Vector2 } from '../../math/vector.js';

class KinematicMovement {
  constructor(name, maxSpeed) {
    this.name = name;
    // dados estáticos sobre o agente e seu alvo
    this.target = null;
    // velocidade máxima que o agente pode viajar
    this.maxSpeed = maxSpeed;
  }

  getSteering() {
    throw new Error('Should not instantiate class KinematicMovement directly - getSteering() is an abstract method.');
  }

  getNewOrientation(currentOrientation, velocity) {
    if (!velocity.isZero()) {
      return Math.atan2(velocity.y, velocity.x);
    }
    return currentOrientation;
  }
}

export class KinematicSeek extends KinematicMovement {
  constructor(maxSpeed) {
    super('Seek', maxSpeed);
  }

  getSteering(agentPose) {
    // pega a direção até o alvo
    let velocity = this.target.position.sub(agentPose.position);
    velocity = velocity.normalize().mult(this.maxSpeed);

    // vira para a direção da velocidade
    agentPose.orientation = super.getNewOrientation(agentPose.orientation, velocity);

    return new KinematicSteeringOutput(velocity, 0);
  }
}