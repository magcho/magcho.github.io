build:
	node build.js
	gulp build --env production

clean:
	rm -rf ./dist
	rm -f ./src/pug/md/--generated/*.pug
