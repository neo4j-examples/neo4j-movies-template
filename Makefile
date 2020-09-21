deploy-api:
	git branch -f heroku-api
	git branch -D heroku-api
	git subtree split --prefix flask-api -b heroku-api
	git push heroku-api heroku-api:master --force

deploy-web:
	git branch -f heroku-web
	git branch -D heroku-web
	git subtree split --prefix web -b heroku-web
	git push heroku-web heroku-web:master --force
