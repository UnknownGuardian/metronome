type DelayedCall = {
  tickToExecute: number;
  callback:Function;
}

class Metronome {
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
    for(const call of this._callbacks) {
      if(call.tickToExecute == this._currentTick)
        await call.callback();
    }
  }

  setTimeout(callback:Function, ticks:number) {
    this._callbacks.push({
      callback,
      tickToExecute: this._currentTick + ticks
    })
  }
}


export default Metronome;