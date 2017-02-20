import $ from 'jquery';
import './../lib';

window.RC.uuid = 'test1';

$(document).ready(() => {
  const $input = $('#log');
  $('#submit').click(() => {
    console.log($input.val());
  });
});
