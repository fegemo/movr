import { ToggleTool } from "./tool.js";
import { Vector2 } from "../math/vector.js";

export class AddAgentTool extends ToggleTool {
  constructor(stage, movements, agentFactory) {
    super(document.createElement('div'));
    this.stage = stage;
    this.movements = movements;
    this.agentFactory = agentFactory;
    const divEl = this.el;
    const buttonEl = document.createElement('button');
    const selectEl = document.createElement('select');
    divEl.appendChild(selectEl);
    divEl.appendChild(buttonEl);
    Object.keys(movements).forEach(movement => {
      const optionEl = document.createElement('option');
      optionEl.value = movement;
      optionEl.innerHTML = movement.charAt(0).toUpperCase() + movement.slice(1);
      selectEl.appendChild(optionEl);
    });
    super.styleSimpleButton(buttonEl);
    divEl.style.display = 'flex';
    this.el = divEl;
    this.createAgentAt = this.createAgentAt.bind(this);
  }

  do() {
    super.do();
    if (this.state) {
      this.stage.canvas.el.addEventListener('click', this.createAgentAt);
    } else {
      this.stage.canvas.el.removeEventListener('click', this.createAgentAt);
    }
  }

  createAgentAt(e) {
    const orientation = Math.random() * Math.PI * 2;
    const currentMovement = this.el.querySelector('select').value;
    this.stage.addAgent(
      new Vector2(e.clientX, e.clientY),
      orientation,
      this.movements[currentMovement],
      this.agentFactory
    );
  }

  get icon() {
    return '▶';
  }
}