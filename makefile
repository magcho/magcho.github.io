build:
	node build.js
	gulp build --env production

clean:
	rm -f ./dist/*.*
	rm -f ./src/pug/_generated/*.*
