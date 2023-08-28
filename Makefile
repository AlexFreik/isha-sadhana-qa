.PHONY: *

pretty:
	npx prettier --write .

watch:
	npx grunt

run:
	node app.js