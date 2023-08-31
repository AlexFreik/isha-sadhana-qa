.PHONY: *

pretty:
	npx prettier --write .

build:
	node process-data.js
	npx grunt browserify

dev: build
	npx grunt & npm run dev
