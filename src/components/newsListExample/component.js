// Импорт модулей, используемых компонентом (свои или сторонние)
import ModuleName from './modules/ModuleName.js';

class ComponentName {
  constructor() {
    this.componentName = 'ComponentName';
    this.test();
  }

  static test() {
    console.log('log: test newsListExample');
    ModuleName.test();
  }
}

export default ComponentName;
