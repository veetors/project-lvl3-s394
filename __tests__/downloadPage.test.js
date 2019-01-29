/**
 * @jest-environment node
 */

import { promises as fs } from 'fs';
// import fs from 'fs';
import path from 'path';
import os from 'os';
import nock from 'nock';
import axios from 'axios';
import adapter from 'axios/lib/adapters/http';
import loadPage from '../src';

axios.defaults.adatper = adapter;

const hostName = 'https://hexlet.io';
const pathName = '/courses';
const fileName = 'hexlet-io-courses.html';
let content;

beforeEach(async () => {
  const contentPath = path.join(__dirname, '__fixtures__', fileName);
  content = await fs.readFile(contentPath, 'utf-8');

  nock(hostName)
    .get(pathName)
    .reply(200, content);
});

test('compare fileNames', async () => {
  const currentFileName = await loadPage(`${hostName}${pathName}`, os.tmpdir());

  expect(currentFileName).toBe(fileName);
});

test('compare content', async () => {
  const currentFileName = await loadPage(`${hostName}${pathName}`, os.tmpdir());
  const fileContent = await fs.readFile(path.join(os.tmpdir(), currentFileName), 'utf-8');

  expect(content).toBe(fileContent);
});
