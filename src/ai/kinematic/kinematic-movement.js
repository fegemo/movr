import { KinematicSteeringOutput } from '../structure.js';
import { Vector2 } from '../../math/vector.js';

class KinematicMovement {
  constructor(maxSpeed) {
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
    super(maxSpeed);
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

export class KinematicArrive extends KinematicMovement {
  constructor(maxSpeed) {
    super(maxSpeed);
    this.radius = 5;
    this.timeToTarget = 0.25;
  }

  getSteering(agentPose) {
    let velocity = this.target.position.sub(agentPose.position);
    
    // se estiver dentro do raio de satisfação, põe velocidade 0
    if (velocity.norm() < this.radius) {
      return new KinematicSteeringOutput(Vector2.ZERO, 0);
    }
   
    // vai reduzindo velocidade
    velocity = velocity.mult(1/this.timeToTarget);

    // limita a velocidade a maxSpeed
    if (velocity.norm() > this.maxSpeed) {
      velocity = velocity.normalize();
      velocity = velocity.mult(this.maxSpeed);
    }

    // orientação de acordo com velocidade
    agentPose.orientation = super.getNewOrientation(agentPose.orientation, velocity);

    return new KinematicSteeringOutput(velocity, 0);
  }
}

export class KinematicWander extends KinematicMovement {
  constructor(maxSpeed, maxRotation = 0.1) {
    super(maxSpeed);
    this.maxRotation = maxRotation;
  }

  getSteering(agentPose) {
    // pega a velocidade por meio do vetor orientação
    let velocity = Vector2.fromOrientation(agentPose.orientation).mult(this.maxSpeed);

    // altera a orientação aleatoriamente
    let rotation = this.randomBinomial() * this.maxRotation;
    
    return new KinematicSteeringOutput(velocity, rotation);
  }

  randomBinomial() {
    return Math.random() - Math.random();
  }
}