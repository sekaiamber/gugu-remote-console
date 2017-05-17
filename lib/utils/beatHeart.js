import Emitter from 'event-emitter';

function getnextExpect(exclude) {
  let ret = parseInt(Math.random() * 1000, 10);
  while (ret === exclude) {
    ret = parseInt(Math.random() * 1000, 10);
  }
  return ret;
}

// 用户可以根据自己的算法来确定产生beat的函数
function defaultCreateNextBeat(receiveBeat) {
  // 如果收到的和当前一样，认为是回环，则返回null
  if (receiveBeat === this.prevBeat) {
    return null;
  }

  // 如果存在prevBeat
  if (this.prevBeat) {
    // 收到null，则回写
    if (!receiveBeat) {
      return this.prevBeat;
    }
    const receiveExpects = receiveBeat.split('|');
    if (receiveExpects[0] === this.prevBeat.split('|')[1]) {
      return receiveExpects[1] + '|' + getnextExpect();
    }
    return this.prevBeat;
  }

  // 如果不存在prevBeat
  // 收到null，创建第一个beat
  if (!receiveBeat) {
    return '|' + getnextExpect();
  }
  // 接收到远端等待
  return receiveBeat.split('|')[1] + '|' + getnextExpect();
}

export default class BeatHeart {
  constructor(arrestTime = 8000, createNextBeat = defaultCreateNextBeat) {
    this.prevBeat = null;
    this.arrestTime = arrestTime;
    this.prevBeatTime = new Date();
    this.createNextBeat = createNextBeat.bind(this);
  }

  beat(receiveBeat) {
    const nextBeat = this.createNextBeat(receiveBeat);
    if (nextBeat) {
      this.prevBeat = nextBeat;
      this.prevBeatTime = new Date();
      if (this._arrest) clearTimeout(this._arrest);
      this._arrest = setTimeout(() => {
        this.emit('arrest');
      }, this.arrestTime);
      this.emit('beat', nextBeat, receiveBeat);
    }
    return nextBeat;
  }
}

Emitter(BeatHeart.prototype);
