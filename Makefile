install:
	npm install

run:
	npx babel-node -- 'src/bin/page-loader.js'

build:
	rm -rf dist
	npm run build

test:
	DEBUG='page-loader' npm test

watch:
	DEBUG='page-loader' npm test -- --watch

lint:
	npx eslint .

publish:
	npm publish

.PHONY: test
