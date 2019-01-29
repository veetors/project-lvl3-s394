install:
	npm install

run:
	npx babel-node -- 'src/bin/page-loader.js'

build:
	rm -rf dist
	npm run build

test:
	npm test

watch:
	npm test -- --watch

lint:
	npx eslint .

publish:
	npm publish

.PHONY: test
