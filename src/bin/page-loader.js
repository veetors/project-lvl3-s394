#!/usr/bin/env node

import program from 'commander';
import loadPage from '..';
import { handleError } from '../helpers';

program
  .version('0.1.0')
  .description('Save web-page to output directory')
  .option('--output [dir]', 'output directory (current by default)', process.cwd())
  .arguments('<url>')
  .action(url => loadPage(url, program.output)
    .then(() => process.exit(0))
    .catch((error) => {
      handleError(error);
      process.exit(1);
    }))
  .parse(process.argv);
