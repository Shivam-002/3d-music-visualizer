// Create an event emitter object
export default function EventEmitter() {
    this.events = {};
  }
  
EventEmitter.prototype.on = function (event, listener) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
  };
  
EventEmitter.prototype.off = function (event, listener) {
    if (this.events[event]) {
      this.events[event] = this.events[event].filter((l) => l !== listener);
    }
  };
  
EventEmitter.prototype.emit = function (event, ...args) {
    if (this.events[event]) {
      this.events[event].forEach((listener) => listener(...args));
    }
  };    
  