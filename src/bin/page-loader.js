#!/usr/bin/env node

import program from 'commander';
import pageLoader from '..';

program
  .version('0.0.1')
  .description('Save web-page to output directory')
  .option('--output [dir]', 'output directory (current by default)')
  .arguments('<url>')
  .action((url) => {
    const dirPath = program.output || process.cwd();

    pageLoader(url, dirPath);
  })
  .parse(process.argv);
