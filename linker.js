#!/usr/bin/env node
'use strict';

const argv = require('yargs')
  .usage('Usage: $0 <command> <command>')
  .command('file', 'Name of tab-delimited .txt file in META-INF directory to process')
  .command('start-num', 'Number to start with for building unique ids')
  .demandCommand(2)
  .argv;
const fs = require('fs');
const path = require('path');
const cwd = process.cwd();
const src_file_path = path.join(cwd, 'META-INF', argv._[0]);
const src_file_text = fs.readFileSync(src_file_path, 'utf8').replace(/\r\n/g, '\n').replace(/\r/g, '\n');
const src_entries = src_file_text.split('\n');
const text_dir_path = path.join(cwd, 'OEBPS/text');

new Promise((resolve, reject) => {
  fs.readdir(text_dir_path, (err, text_file_list) => {
    if (err) { reject(err); }
    else {
      // loop through the files we got and remove any that begin with '.' (hidden files)
      for (let i = text_file_list.length - 1; i >= 0; i--) {
        if (text_file_list[i][0] === '.') {
          text_file_list.splice(i, 1);
        }
      }
      resolve(text_file_list);
    }
  });
}).then(text_file_list => getFileText(text_file_list))
  .then(text_files => {
    let inc = argv._[1];
    for (let i = 0; i < src_entries.length; i++) {
      let current_entry = src_entries[i].split('\t');
      let from_file = current_entry[0];
      let to_file = current_entry[2];
      let from_string = current_entry[1].replace(/^"|"$/g, '').replace(/""/g, '\"');
      let to_html = current_entry[3].replace(/^"|"$/g, '').replace(/""/g, '\"');
      let to_html_a = to_html.match(/^[^>]+/);
      let to_html_b = to_html.match(/>.*/);

      let from_string_repl = `<a href="${to_file}#ref${inc}">${from_string}<\/a>`;
      let to_html_repl = `${to_html_a} id="ref${inc}"${to_html_b}`;
      text_files[from_file] = text_files[from_file].replace(from_string, from_string_repl);
      text_files[to_file] = text_files[to_file].replace(to_html, to_html_repl);
      inc++;
    }
    return(text_files);
  }).then(text_files => writeFileText(Object.keys(text_files), text_files))
  .then(response => { console.log(response); })
  .catch(err => { console.log(err); });

function getFileText(file_array) {
  return new Promise((resolve, reject) => {
    let file_opener = [];
    let text_files = {};
    for (let i = 0; i < file_array.length; i++) {
      file_opener.push(new Promise((resolve, reject) => {
        fs.readFile(path.join(text_dir_path, file_array[i]), 'utf8', (err, text) => {
          if (err) {
            reject(err);
          }
          else {
            text_files[file_array[i]] = text;
            resolve();
          }
        });
      }));
    }
    Promise.all(file_opener).then(() => {
      resolve(text_files);
    }).catch(err => { reject(err); });
  });
}

function writeFileText(file_array, file_object) {
  return new Promise((resolve, reject) => {
    let file_writer = [];
    for (let i = 0; i < file_array.length; i++) {
      file_writer.push(new Promise((resolve, reject) => {
        fs.writeFile(path.join(text_dir_path, file_array[i]), file_object[file_array[i]], 'utf8', (err) => {
          if (err) {
            reject(err);
          }
          else {
            resolve();
          }
        });
      }));
    }
    Promise.all(file_writer).then(() => {
      resolve('Linking complete!');
    }).catch(err => { reject(err); });
  });
}


