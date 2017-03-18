#!/usr/bin/env node
'use strict';

const argv = require('yargs')
  .usage('Usage: $0 <command>')
  .command('file', 'Name of tab-delimited .txt file in META-INF directory to process')
  .demandCommand(1)
  .help('h')
  .alias('h', 'help')
  .argv;
const fs = require('fs');
const path = require('path');
const cwd = process.cwd();
const src_file_path = path.join(cwd, 'META-INF', argv._[0]);
const src_file_text = fs.readFileSync(src_file_path, 'UTF-8');
const src_entries = src_file_text.split('\r');
const text_dir_path = path.join(cwd, 'text');

for (let i = 0; i < src_entries.length; i++) {
  let current_entry = src_entries[i].split('\t');
  let from_file = current_entry[0];
  let to_file = current_entry[2];
  let from_string = current_entry[1].replace(/^"|"$/g, '').replace(/""/g, '\"');
  let to_html = current_entry[3].replace(/^"|"$/g, '').replace(/""/g, '\"');
}