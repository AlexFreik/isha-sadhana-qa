.PHONY: *

pretty:
	npx prettier --write .

build:
	npx grunt browserify

dev: build
	npx grunt & npm run dev

deploy:
	npm run deploy