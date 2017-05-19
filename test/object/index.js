/* eslint import/no-extraneous-dependencies: 0 */
import { expect } from 'chai';
import { encoder } from 'gugu-remote-utils/lib/object';
import fixtures from './fixtures';

describe('object analysis', () => {
  it('basic types: boolean', (done) => {
    const ret = encoder(fixtures.boolean);
    expect(ret).to.equal(fixtures.boolean);
    done();
  });

  it('basic types: number', (done) => {
    const ret = encoder(fixtures.number);
    expect(ret).to.equal(fixtures.number);
    done();
  });

  it('basic types: null', (done) => {
    const ret = encoder(fixtures.null);
    expect(ret).to.equal(fixtures.null);
    done();
  });

  it('basic types: string', (done) => {
    const ret = encoder(fixtures.string);
    expect(ret).to.equal(fixtures.string);
    done();
  });

  it('basic types: function', (done) => {
    const ret = encoder(fixtures.function);
    expect(ret).to.equal('[Function]');
    done();
  });

  it('string: very long', (done) => {
    const ret = encoder(fixtures.veryLongString);
    expect(ret.length).to.equal(49);
    done();
  });

  it('object: immutable', (done) => {
    const ret = encoder(fixtures.object);
    expect(ret).not.to.equal(fixtures.object);
    done();
  });

  it('object: deep copy', (done) => {
    const obj = fixtures.object;
    const ret = encoder(obj);
    expect(ret.boolean).to.equal(obj.boolean);
    expect(ret.string).to.equal(obj.string);
    expect(ret.number).to.equal(obj.number);
    expect(ret.null).to.equal(obj.null);
    expect(ret.function).to.equal('[Function]');
    expect(ret.object).not.to.equal(obj.object);
    expect(ret.object.string).to.equal(obj.object.string);
    done();
  });

  it('object: very deep', (done) => {
    const ret = encoder(fixtures.veryDeepObject);
    let member = ret;
    while (member.object) {
      member = member.object;
    }
    expect(member).to.equal('[Object]');
    done();
  });
});
