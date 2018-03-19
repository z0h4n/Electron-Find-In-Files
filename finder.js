const $ = require('jquery');
const find = require('find');
const { dialog } = require('electron').remote;
const findInFiles = require('find-in-files');
const path = require('path');
const search = require('recursive-search');

const finder = {
  dir: '',
  is_searching: false,
  filter_ext: [],
  filter_files: [],

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
    if ($("#directory > input").val() === '') {
      return false;
    }

    if ($("#search_text").val() === '') {
      return false;
    }

    finder.is_searching = true;
    finder.search_filter = $("#search_filter").val().trim();

    search.recursiveSearch('*', finder.dir, finder.onFileFound, finder.onSearchComplete);
  },

  onFileFound(err, file_path) {
    const parsed_path = path.parse(file_path);
    const filter = finder.search_filter;

    if (filter && !(parsed_path.base.indexOf(filter) !== -1 || parsed_path.ext.indexOf(filter) !== -1)) {
      return false;
    }

    console.log(file_path);
  },

  onSearchComplete(results) {
    console.log('results');
  },

  filesFound(files = [], search_text) {
    $(this.elem.loader).hide();
    // findInFiles(files, search_text, this.matchFound, this.searchComplete);
  },

  matchFound(file, occurences) {
    this.addResult(`${file.replace(this.dir, '')} - [${occurences} hits]\n`);
  },

  searchComplete(stats) {
    this.addResult(`\nFinished searching ${stats.total_files} files`);
    this.addResult(`\nFound ${stats.total_hits} hits in ${stats.total_files_hit} files`);
  },

  addResult(text = '') {
    this.results += text;
    this.elem.results.value = this.results;
    this.elem.results.scrollTop = this.elem.results.scrollHeight;
  }
};

finder.init();