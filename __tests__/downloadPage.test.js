/**
 * @jest-environment node
 */

import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';
import nock from 'nock';
import axios from 'axios';
import adapter from 'axios/lib/adapters/http';
import loadPage from '../src';
import { checkIsPathExist } from '../src/helpers';

axios.defaults.adatper = adapter;

const hostName = 'https://hexlet.io';
const pathName = '/courses';
const fileName = 'hexlet-io-courses.html';
const pageContentPath = path.join(__dirname, '__fixtures__', 'hexlet-io-courses.html');
const pageContentLocalPath = path.join(__dirname, '__fixtures__', 'hexlet-io-courses_local.html');
const fileContentPath = path.join(__dirname, '__fixtures__', 'hexlet-io-courses_local.html');
let currentFileName;
let pageContent;
let pageContentLocal;
let imageContent;
let stylesContent;
let scriptContent;

beforeAll(async () => {
  pageContent = await fs.readFile(pageContentPath, 'utf-8');
  pageContentLocal = await fs.readFile(pageContentLocalPath, 'utf-8');

  nock.disableNetConnect();

  nock(hostName)
    .get(pathName)
    .reply(200, pageContent);

  nock(hostName)
    .get('/local_resources/img/image.jpg')
    .reply(200, imageContent);

  nock(hostName)
    .get('/local_resources/css/styles.css')
    .reply(200, stylesContent);

  nock(hostName)
    .get('/local_resources/js/script.js')
    .reply(200, scriptContent);

  currentFileName = await loadPage(`${hostName}${pathName}`, os.tmpdir());
});

test('compare fileNames', async () => {
  expect(currentFileName).toBe(fileName);
});

test('compare page content', async () => {
  const fileContent = await fs.readFile(fileContentPath, 'utf-8');

  expect(fileContent).toBe(pageContentLocal);
});

test('is styles file exist', async () => {
  const isFileExist = await checkIsPathExist(path.join(os.tmpdir(), 'hexlet-io-courses_files', 'local_resources-css-styles.css'));

  expect(isFileExist).toBeTruthy();
});

test('is script file exist', async () => {
  const isFileExist = await checkIsPathExist(path.join(os.tmpdir(), 'hexlet-io-courses_files', 'local_resources-js-script.js'));

  expect(isFileExist).toBeTruthy();
});

test('is image file exist', async () => {
  const isFileExist = await checkIsPathExist(path.join(os.tmpdir(), 'hexlet-io-courses_files', 'local_resources-img-image.jpg'));

  expect(isFileExist).toBeTruthy();
});
