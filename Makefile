.PHONY: start dev install clean

dev:
	nodemon app.js

start:
	node app.js

install:
	npm install

clean:
	rm -rf node_modules package-lock.json
