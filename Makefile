.PHONY: *

pretty:
	npx prettier --write .

build:
	npx grunt browserify

watch:
	npx grunt

dev:
	npm run dev

deploy:
	npm run deploy