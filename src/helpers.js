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

export {
  debug,
  getLinkName,
  getFileName,
  getDirName,
};
