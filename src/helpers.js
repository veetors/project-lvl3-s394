import { promises as fs } from 'fs';
import debug from 'debug';
import { trim } from 'lodash/fp';

const getLog = (massage) => {
  const logger = debug('page-loader');
  return logger(massage);
};

const checkIsPathExist = dirPath => fs.access(dirPath)
  .then(() => true)
  .catch((error) => {
    if (error && error.code === 'ENOENT') {
      return false;
    }

    throw error;
  });

const getLinkName = (path) => {
  const str = trim(path);
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
  getLog,
  checkIsPathExist,
  getLinkName,
  getFileName,
  getDirName,
};
