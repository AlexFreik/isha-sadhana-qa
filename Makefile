.PHONY: *

pretty:
	npx prettier --write .

watch:
	npx grunt

dev:
	npm run dev

deploy:
	npm run deploy