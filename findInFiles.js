const find = require('find-in-file');
const $ = require('jquery');

let file_index = 0;
let total_hits = 0;
let total_files_hit = 0;

function findInFiles(files, search_text, cb_match, cb_complete) {
  const file = files[file_index];

  if (file) {
    find({ files: file, find: search_text }, function (err, matched) {
      if (err) {
        console.log(err);
      }
      if (matched.length) {
        total_hits += matched[0].occurrences;
        total_files_hit += 1;
        cb_match(matched[0].file, matched[0].occurrences);
      }

      file_index += 1;

      const percent = (file_index / files.length) * 100;

      $('.progress .progress_bar').css('width', `${percent}%`);
      $('.progress .progress_text').text(`${Math.floor(percent)}%`);

      findInFiles(files, search_text, cb_match, cb_complete);
    });
  } else {
    const stats = { total_hits, total_files_hit, total_files: file_index };
    file_index = 0;
    total_hits = 0;
    total_files_hit = 0;
    cb_complete(stats);
  }
}

function search(files, search_text, cb_match, cb_complete) {
  const file = files[file_index];

  if (file) {
    find()
  } else {
    cb_complete(total_hits, total_files);
  }
}

module.exports = findInFiles;