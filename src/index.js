import path from 'path';
import { promises as fs } from 'fs';
import axios from 'axios';

export default (url, dirPath) => {
  const { hostname, pathname } = new URL(url);
  const template = /\W+/g;
  const name = pathname === '/' ? hostname : `${hostname}${pathname}`;
  const replacedName = name.replace(template, '-');
  const fileName = `${replacedName}.html`;
  const filePath = path.join(dirPath, fileName);

  return axios.get(url)
    .then(({ data }) => fs.writeFile(filePath, data))
    .then(() => fileName)
    .catch((error) => {
      throw error;
    });
};
