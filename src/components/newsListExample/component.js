// Импорт модулей, используемых компонентом (свои или сторонние)
import ModuleName from './modules/ModuleName.js';

class ComponentName {
  constructor() {
    this.componentName = 'ComponentName';
    this.test();
  }

  test() {
    console.log(`log: test ${this.componentName}`);
    ModuleName.test();
  }
}

export default ComponentName;
