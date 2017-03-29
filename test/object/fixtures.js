export default {
  boolean: true,
  null: null,
  number: 1.11,
  string: 'test',
  function() { },
  object: {
    boolean: true,
    null: null,
    number: 1.11,
    string: 'test',
    function() { },
    object: {
      string: 'test',
    },
  },
  veryLongString: Array(100).fill('1').join(''),
  veryDeepObject: {
    object: { object: { object: { object: { object: { object: { string: 'test' } } } } } },
  },
};
