import fs from 'fs';
import path from 'path';
import url from 'url';
import cheerio from 'cheerio';
import axios from 'axios';
import {
  checkIsPathExist,
  getLinkName,
  getFileName,
  getDirName,
} from './helpers';

const proccesHtml = (data, localPath) => {
  const links = [];
  const tags = {
    img: 'src',
    script: 'src',
    link: 'href',
  };
  const $ = cheerio.load(data);

  Object.keys(tags)
    .forEach((key) => {
      $(key).each((i, elem) => {
        const res = $(elem).attr(tags[key]);
        if (res) {
          const linkObj = url.parse(res);
          if (!linkObj.protocol) {
            links.push(res);
            const newPath = path.join(localPath, getLinkName(res));
            $(elem).attr(tags[key], newPath);
          }
        }
      });
    });

  return {
    links,
    html: $.html,
  };
};

const downloadFile = (urlLink, resourceLink, localFolder) => {
  const downloadLink = url.resolve(urlLink, resourceLink);
  const fileName = getLinkName(resourceLink);
  const newPathToFile = path.join(localFolder, fileName);
  return axios.get(downloadLink, { responseType: 'stream' })
    .then(({ data }) => data.pipe(fs.createWriteStream(newPathToFile)));
};

const downloadFiles = (urlLink, resourceLinks, localFolder) => {
  const newDirName = getDirName(urlLink);
  const newDirPath = path.join(localFolder, newDirName);
  return checkIsPathExist(newDirPath)
    .then((isPathExist) => {
      if (!isPathExist) {
        return fs.promises.mkdir(newDirPath);
      }
    })
    .then(() => Promise.all(
      resourceLinks.map(currLink => downloadFile(urlLink, currLink, newDirPath)),
    ));
};

export default async (urlLink, localFolder) => {
  const fileName = getFileName(urlLink);
  return checkIsPathExist(localFolder)
    .then((isPathExist) => {
      if (!isPathExist) {
        return fs.promises.mkdir(localFolder);
      }
    })
    .then(() => axios.get(urlLink))
    .then(({ data }) => {
      const { links, html } = proccesHtml(data, getDirName(urlLink));
      downloadFiles(urlLink, links, localFolder);
      fs.promises.writeFile(path.join(localFolder, fileName), html, 'utf-8');
    })
    .then(() => fileName);
};
