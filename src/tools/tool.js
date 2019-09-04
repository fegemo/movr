const TOOL_SIZE = 30;

export class Tool {
  constructor(el) {
    this.el = el;
    if (el.tagName.toLowerCase() === 'button') {
      this.styleSimpleButton(el);
    }
  }
  
  styleSimpleButton(el) {
    el.innerHTML = this.icon;
    el.style.width = `${TOOL_SIZE}px`;
    el.style.height = `${TOOL_SIZE}px`;
    el.style.display = 'block';
    el.style.fontSize = `${(TOOL_SIZE-1)/2}px`;
    el.style.padding = '0';
    el.style.textAlign = 'center';
    el.addEventListener('click', this.do.bind(this));
  }
  
  do() {
    throw new Error('Tool should not be instantiated directly - method do() is abstract.');
  }
  
  get icon() {
    throw new Error('Tool should not be instantiated directly - method get icon() is abstract.');
  }
}

export class ToggleTool extends Tool {
  constructor(el, state) {
    super(el);
    this.state = state;
  }
  
  do() {
    this.state = !this.state;
    this.buttonEl = this.el.tagName.toLowerCase() === 'button' ? this.el : this.el.querySelector('button');
    this.buttonEl.style.filter = this.state ? 'invert(100%)' : 'inherit';

    // se há um grupo de ferramentas e esta acabou de ser habilitada, desabilitar as outras
    if (this.group && this.state) {
      this.group.setActive(this);
    }
  }

  addToExclusionGroup(group) {
    this.group = group;
    group.addTool(this);
    return this;
  }
}

export class Toolbar {
  constructor(el) {
    this.el = el;
    this.el.style.display = 'flex';
    this.el.style.flexDirection = 'row';
    this.el.style.justifyContent = 'flex-start';
    this.el.style.alignItems = 'center';
    this.el.style.width = '100%';
    this.el.style.height = TOOL_SIZE;
    this.el.style.position = 'absolute';
    this.el.style.bottom = '0';
    this.el.style.zIndex = '1';
    this.tools = [];
  }

  addTool(tool) {
    this.tools.push(tool);
    this.el.appendChild(tool.el);
  }
}

export class ExclusionGroup {
  constructor() {
    this.tools = [];
  }

  addTool(tool) {
    this.tools.push(tool);
    
  }

  setActive(tool) {
    // ativa a ferramenta solicitada
    this.tools.filter(t => t === tool && !t.state).forEach(t => t.do());

    // desativa as ferramentas que estavam ativas (esperado no máximo 1)
    this.tools.filter(t => t !== tool && t.state).forEach(t => t.do());
  }
}