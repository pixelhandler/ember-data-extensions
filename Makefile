build: lint
	@brunch b

clean:
	@rm -fr ./dist/*

dist: clean build prod

doc:
	@yuidoc ./packages/* -c yuidoc.json --server 3333

docfiles: lint
	@yuidoc ./packages/* -c yuidoc.json

install:
	@npm install
	@npm install grunt-blanket-qunit --save-dev
	@bower install

canary:
	@bin/canary.sh

lint:
	@jshint packages/*

prod: lint
	@brunch build --production

test: lint
	@testem

coverage: lint
	@open http://localhost:8080/tests/coverage.html?coverage=true
	@python -m SimpleHTTPServer 8080

ci: dist
	@grunt blanket_qunit --verbose

.PHONY: build clean dist doc docfiles install lint prod test coverage ci
