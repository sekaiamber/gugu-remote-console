import Emitter from 'event-emitter';

// 用户可以根据自己的算法来确定产生beat的函数
function defaultCreateNextBeat(receiveBeat) {
  const nextExpect = parseInt(Math.random() * 1000, 10);

  // 如果存在prevBeat
  if (this.prevBeat) {
    // 收到null，则回写
    if (!receiveBeat) {
      return this.prevBeat;
    }
    const receiveExpects = receiveBeat.split('|');
    if (receiveExpects[0] === this.prevBeat.split('|')[1]) {
      return receiveExpects[1] + '|' + nextExpect;
    }
    return this.prevBeat;
  }

  // 如果不存在prevBeat
  // 收到null，创建第一个beat
  if (!receiveBeat) {
    return '|' + nextExpect;
  }
  // 接收到远端等待
  return receiveBeat.split('|')[1] + '|' + nextExpect;
}

export default class BeatHeart {
  constructor(prevBeat = null, createNextBeat = defaultCreateNextBeat) {
    this.prevBeat = prevBeat;
    this.createNextBeat = createNextBeat.bind(this);
  }

  beat(receiveBeat) {
    const nextBeat = this.createNextBeat(receiveBeat);
    this.emit('beat', nextBeat, receiveBeat);
  }
}

Emitter(BeatHeart.prototype);
