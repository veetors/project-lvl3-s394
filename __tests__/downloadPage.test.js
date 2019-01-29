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

const host = 'https://hexlet.io';
const fileName = 'hexlet-io.html';
let content;

beforeEach(async () => {
  const contentPath = path.join(__dirname, '__fixtures__', fileName);
  content = await fs.readFile(contentPath, 'utf-8');

  nock(host)
    .get('/')
    .reply(200, content);
});

test('compare fileNames', async () => {
  const currentFileName = await loadPage(host, os.tmpdir());

  expect(currentFileName).toBe(fileName);
});

test('compare content', async () => {
  const currentFileName = await loadPage(host, os.tmpdir());
  const fileContent = await fs.readFile(path.join(os.tmpdir(), currentFileName), 'utf-8');

  expect(content).toBe(fileContent);
});
