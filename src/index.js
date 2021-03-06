import fs from 'fs';
import path from 'path';
import url from 'url';
import cheerio from 'cheerio';
import axios from 'axios';
import {
  debug,
  runTasks,
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

  debug(`links for download:  ${links}`);

  return {
    links,
    html: $.html,
  };
};

const downloadAndSaveFile = (urlLink, resourceLink, localFolder) => {
  const downloadLink = url.resolve(urlLink, resourceLink);
  const fileName = getLinkName(resourceLink);
  const newPathToFile = path.join(localFolder, fileName);

  debug(`newPathToFile: ${newPathToFile}`);
  debug(`downloadLink: ${downloadLink}`);
  debug(`local resource fileName: ${fileName}`);

  return axios.get(downloadLink, { responseType: 'stream' })
    .then(({ data }) => data.pipe(fs.createWriteStream(newPathToFile)))
    .then(() => debug(`saved to file ${newPathToFile}`));
};

const downloadFiles = (urlLink, resourceLinks, localFolder) => {
  const newDirName = getDirName(urlLink);
  const newDirPath = path.join(localFolder, newDirName);

  debug(`dir for local resources: ${newDirPath}`);

  const tasks = resourceLinks.map((link) => {
    const task = {
      title: `Downloading ${link}`,
      task: () => downloadAndSaveFile(urlLink, link, newDirPath),
    };

    return task;
  });

  debug(tasks);

  return fs.promises.mkdir(newDirPath)
    .then(() => runTasks(tasks));
};

export default (urlLink, localFolder) => {
  const fileName = getFileName(urlLink);
  let proccesedHtml;

  debug(`localFolder: ${localFolder}`);
  debug(`page fileName: ${fileName}`);

  return axios.get(urlLink)
    .then(({ data }) => proccesHtml(data, getDirName(urlLink)))
    .then(({ links, html }) => {
      proccesedHtml = html;
      return downloadFiles(urlLink, links, localFolder);
    })
    .then(() => fs.promises.writeFile(path.join(localFolder, fileName), proccesedHtml, 'utf-8'))
    .then(() => fileName);
};
