#!/usr/bin/env node

import program from 'commander';
import loadPage from '..';

program
  .version('0.0.1')
  .description('Save web-page to output directory')
  .option('--output [dir]', 'output directory (current by default)', process.cwd())
  .arguments('<url>')
  .action(url => loadPage(url, program.output))
  .parse(process.argv);
