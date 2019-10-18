type DelayedCall = {
  tickToExecute: number;
  callback:Function;
}

class Metronome {
  // don't do work when there is nothing to do
  _sleepResolve:Function;

  _callbacks:DelayedCall[];
  _currentTick:number;
  constructor(){
    this._currentTick = 0;
    this._callbacks = [];
  }

  async start(ticksToExecute:number = Infinity):Promise<void> {
    return new Promise(async (resolve) => {
      while(ticksToExecute--) {
        await this.tick();
      }
      resolve();
    })

  }

  async tick():Promise<void> {
    this._currentTick++;
    for(let i = 0; i < this._callbacks.length; i++) {
      const call = this._callbacks[i];
      if(call.tickToExecute == this._currentTick){
        await call.callback();
        this._callbacks.slice(i, 1);
        i--;
      }
    }

    await this.sleep();
  }

  // halt until resolved
  private async sleep() {
    if(this._callbacks.length == 0) {
      await new Promise((resolve) => {
        this._sleepResolve = resolve;
      });
    }
  }

  private async awake() {
    if(this._sleepResolve) {
      this._sleepResolve();
      this._sleepResolve = null;
    }
  }

  setTimeout(callback:Function, ticks:number) {
    this._callbacks.push({
      callback,
      tickToExecute: this._currentTick + ticks
    })
    this.awake();
  }
}


export default Metronome;