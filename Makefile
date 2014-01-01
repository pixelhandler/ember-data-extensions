build: lint
	@brunch b

clean:
	@rm -fr ./dist/*

dist: clean build prod

doc:
	@yuidoc ./packages/* -c yuidoc.json --server 3333

install:
	@npm install
	@bower install

lint:
	@jshint packages/*

prod: lint
	@brunch build --production

test: lint
	@testem

ci: dist
	@testem ci

.PHONY: build doc install lint prod test ci
