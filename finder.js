const $ = require('jquery');
const find = require('find');
const { dialog } = require('electron').remote;
const error = require('./error');
const findInFiles = require('./findInFiles');

const finder = {
  dir: '',
  results: '',
  elem: {
    loader: $('.loader')[0],
    results: $('.results')[0],
    dir_button: $('.directory .button')[0],
    dir_input: $('.directory .input')[0],
    search_button: $('.search .button')[0],
    search_input: $('.search .input')[0]
  },

  init() {
    ['selectDirectory', 'directorySelected', 'search', 'filesFound', 'matchFound', 'searchComplete'].forEach((fn) => {
      this[fn] = this[fn].bind(this);
    });

    $(this.elem.dir_button).on('click', this.selectDirectory);
    $(this.elem.search_button).on('click', this.search);
  },

  selectDirectory() {
    dialog.showOpenDialog({ properties: ['openDirectory'] }, this.directorySelected);
  },

  directorySelected(files = []) {
    this.dir = files[0] || '';
    this.elem.dir_input.value = this.dir;
  },

  search() {
    if (this.elem.dir_input.value === '') {
      error.show('Please select a directory');
      return false;
    }

    if (this.elem.search_input.value === '') {
      error.show('Please enter the text to search');
      return false;
    }

    $(this.elem.loader).show();
    this.results = '';
    this.addResult();

    setTimeout(() => {
      find.file(this.elem.dir_input.value, (files) => {
        this.filesFound(files, this.elem.search_input.value);
      });
    }, 1000);
  },

  filesFound(files = [], search_text) {
    $(this.elem.loader).hide();
    findInFiles(files, search_text, this.matchFound, this.searchComplete);
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