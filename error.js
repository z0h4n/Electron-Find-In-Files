const $ = require('jquery');
const error_elem = $('.error')[0];

$(error_elem).find('.button').on('click', hide);

function show(msg) {
  $(error_elem).show().find('.msg').text(msg);
}

function hide() {
  $(error_elem).hide();
}

module.exports = { show, hide };