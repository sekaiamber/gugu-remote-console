/* eslint import/no-extraneous-dependencies: 0 */
import { expect } from 'chai';
import BeatHeart from '../../lib/utils/beatHeart';

describe('beat heart', () => {
  it('first beat', (done) => {
    const bh = new BeatHeart();
    bh.on('beat', (nextBeat) => {
      const reg = /^(\d+)?\|\d+/i;
      expect(reg.test(nextBeat)).to.equal(true);
      done();
    });
    bh.beat();
  });

  it('start a heart beat', (done) => {
    const bh = new BeatHeart();
    const revBeat = '111|222';
    bh.on('beat', (nextBeat) => {
      const reg = /^(\d+)?\|\d+/i;
      expect(reg.test(nextBeat)).to.equal(true);
      expect(nextBeat.split('|')[0]).to.equal(revBeat.split('|')[1]);
      done();
    });
    bh.beat(revBeat);
  });

  it('reflect once', (done) => {
    const bh1 = new BeatHeart();
    bh1.on('beat', (nextBeat) => {
      const bh2 = new BeatHeart();
      bh2.on('beat', (nextBeat2) => {
        expect(nextBeat2.split('|')[0]).to.equal(nextBeat.split('|')[1]);
        done();
      });
      bh2.beat(nextBeat);
    });
    bh1.beat();
  });

  it('reflect many times', (done) => {
    const bh1 = new BeatHeart();
    let time = 0;
    bh1.on('beat', (nextBeat) => {
      time += 1;
      if (time === 5) {
        done();
      }
      const bh2 = new BeatHeart();
      bh2.on('beat', (nextBeat2) => {
        expect(nextBeat2.split('|')[0]).to.equal(nextBeat.split('|')[1]);
        if (time < 5) bh1.beat(nextBeat2);
      });
      if (time < 5) bh2.beat(nextBeat);
    });
    bh1.beat();
  });
});
