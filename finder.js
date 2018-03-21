const $ = require('jquery');
const { dialog } = require('electron').remote;
const findInFile = require('find-in-file');
const path = require('path');
const fileFinder = require('recursive-search');

const finder = {
  dir: '',
  is_searching: false,
  search_filter: '',
  text_to_search: '',
  files_to_search: [],
  total_files: 0,
  total_hits: 0,
  total_hits_files: 0,

  init() {
    $("#directory").on("click", finder.selectDirectory);
    $("#search").on("click", finder.search);
  },

  selectDirectory() {
    dialog.showOpenDialog({ properties: ['openDirectory'] }, finder.directorySelected);
  },

  directorySelected(folders = []) {
    finder.dir = folders[0] || finder.dir;
    $("#directory > input").val(finder.dir);
  },

  search() {
    if (finder.is_searching) {
      finder.is_searching = false;
      $('#search').prop('disabled', true);
      return;
    }

    if ($("#directory > input").val() === '') {
      return false;
    }

    if ($("#search_text").val().trim() === '') {
      return false;
    }

    finder.is_searching = true;
    finder.text_to_search = $("#search_text").val();
    finder.search_filter = $("#search_filter").val().trim().split('.');
    $("#results").val('');

    [`Search Directory : ${finder.dir}`, `\nSearch Text : ${finder.text_to_search}`, `\nSearch Filter : ${finder.search_filter.join('.')}`, '\n'].forEach(function (msg) {
      finder.writeLine(msg);
    });

    finder.files_to_search = [];
    finder.total_files = 0;
    finder.total_hits = 0;
    finder.total_hits_files = 0;

    $('#search').prop('disabled', true).text('Searching...');

    fileFinder.recursiveSearch('*', finder.dir, finder.onFileFound, finder.onFindingFilesComplete);
  },

  onFileFound(err, file_path) {
    const parsed_path = path.parse(file_path);
    const filter = finder.search_filter;

    if ((filter[0] && parsed_path.base.split('.')[0] !== filter[0]) || (filter[1] && parsed_path.ext.split('.')[1] !== filter[1])) {
      return false;
    }

    finder.files_to_search.push(file_path);
  },

  onFindingFilesComplete(results) {
    finder.total_files = results.length;

    $('#search').prop('disabled', false).text('Stop Searching');

    if (finder.files_to_search.length) {
      finder.searchInFiles(0);
    } else {
      finder.searchComplete(0);
    }
  },

  searchInFiles(file_index) {
    const file = finder.files_to_search[file_index];
    const char_limit = 32;

    $('#search_current').text(`...${file.substr(-char_limit, file.length)}`);

    findInFile({ files: file, find: finder.text_to_search }, function (err, matchedFiles) {
      if (matchedFiles.length) {
        finder.total_hits += matchedFiles[0].occurrences;
        finder.total_hits_files += 1;
        finder.writeLine(`\n${matchedFiles[0].file.replace(finder.dir, '')} - [${matchedFiles[0].occurrences} hits]`);
        finder.scroll();
      }

      file_index += 1;

      if (finder.is_searching && file_index < finder.files_to_search.length) {
        finder.setProgress(file_index);
        finder.searchInFiles(file_index);
        return;
      }

      finder.searchComplete(file_index);
    });
  },

  searchComplete(files_searched) {
    ['\n', `\nFinished searching ${files_searched} files`, `\nFound ${finder.total_hits} hits in ${finder.total_hits_files} files`, '\n'].forEach(function (msg) {
      finder.writeLine(msg);
    });

    finder.is_searching = false;
    $('#search').prop('disabled', false).text('Search');
    $('#search_current').text('');

    finder.scroll();
    finder.setProgress(0);
  },

  writeLine(msg) {
    const val = $("#results").val();
    $("#results").val(val + msg);
  },

  scroll() {
    var results = $('#results')[0];
    results.scrollTop = results.scrollHeight;
  },

  setProgress(file_index) {
    $("#progress_fill").css('width', `${(file_index / finder.files_to_search.length) * 100}%`);
  }
};

finder.init();