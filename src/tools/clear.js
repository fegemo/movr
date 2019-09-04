import { Tool } from "./tool.js";

export class ClearTool extends Tool {
  constructor(stage) {
    super(document.createElement('button'));
    this.stage = stage;
  }

  do() {
    this.stage.agents = [];
  }

  get icon() {
    return '🗑';
  }

}