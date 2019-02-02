import { trimChars } from 'lodash/fp';

const debug = require('debug')('page-loader');

const getLinkName = (path) => {
  const str = trimChars('/', path);
  return str.replace(new RegExp('/', 'g'), '-');
};

const getNameFromUrl = (url) => {
  const { hostname, pathname } = new URL(url);
  const template = /\W+/g;
  const name = pathname === '/' ? hostname : `${hostname}${pathname}`;

  return name.replace(template, '-');
};

const getFileName = url => `${getNameFromUrl(url)}.html`;

const getDirName = url => `${getNameFromUrl(url)}_files`;

const handleError = (error) => {
  const { code, response } = error;
  const errors = {
    ENOENT: 'output directory does not exist, please select other directory',
    EACCES: 'do not have permission to write to the output directory, please select other directory',
    EEXIST: 'file or directory with this name already exists, please select another directory',
  };
  const message = errors[code];

  if (message) {
    console.error(`Error: ${message}`);
  } else if (response) {
    const { status, config: { url } } = response;

    console.error(`Error: ${status}, unreachable url ${url}`);
  } else {
    console.error(error);
  }
};

export {
  debug,
  getLinkName,
  getFileName,
  getDirName,
  handleError,
};
