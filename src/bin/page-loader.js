#!/usr/bin/env node

import program from 'commander';
import loadPage from '..';
import { handleError } from '../helpers';

program
  .version('0.0.5')
  .description('Save web-page to output directory')
  .option('--output [dir]', 'output directory (current by default)', process.cwd())
  .arguments('<url>')
  .action(url => loadPage(url, program.output)
    .then(() => process.exit(0))
    .catch(handleError))
  .parse(process.argv);
