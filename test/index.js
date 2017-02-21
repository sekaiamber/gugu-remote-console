import $ from 'jquery';

$(document).ready(() => {
  const $input = $('#log');
  $('#submit').click(() => {
    console.log($input.val());
  });
});
