export default class Component {
  constructor({
    element
  }) {
    this.element = element;
    this.callbackMap = {};
  }

  hide() {
    this.element.hidden = true;
  }

  show() {
    this.element.hidden = false;
  }
 
  subscribe(trigger, callback) {
    this.callbackMap[trigger] = callback;
  }

  emit(trigger, callbackaArg) {
    const tempFunction = this.callbackMap[trigger];
    if (!tempFunction) {
      return;
    }
    tempFunction(callbackaArg);
  }
}