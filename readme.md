#Setup Requirements
-Setup Postgres DB
-Setup AWS User and S3 bucket
-Setup Heroku app
-Create .env, set the following vars:
NODE_ENV ('development' or 'production')
PORT
PG_URL
AWS_USER
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
S3_BUCKET

#Before running locally:

##To install and run

`npm install`

`npm run gulp dev` to update the app script url in index.ejs, reversing the corresponding gulp production command

`npm run dev` will run webpack dev server at localhost:8080

####Run either `heroku local` or `node index.js` to start the application server on localhost:5000

##Data API

Be sure to have postgres installed and running

Add connection URL strig to config/db

##Testing

In order to run Unit Tests use:

`mocha --compilers js:babel-core/register`

###Notes:
####Webpack Bundle Prep: Inside webpack config, switch devtools to source-map, and comment out plugins
####Don't forget to run a local redis server (or other DB) if you intend to use redis

----------------------------------------------

#Before deploying to production:

####Run `npm run gulp production`. This will change the following:

#####1: Inside `./views/index.ejs`:
```
<script src="http://localhost:8080/app.js" charset="utf-8"></script>
```
#####Will change to:
```
<script src="/js/app.js" charset="utf-8"></script>
```

###Notes:
####Webpack Bundle Prep: Inside webpack config, switch devtools to cheap-module-source-map, and uncomment plugins
####Run the `webpack` command (to recompile app.js, etc.) before committing and deploying to production, unless this is handled in the build step (e.g. on Heroku via postinstall script in package.json).

----------------------------------------------

#Important Note: Deploy and/or push to origin while app is in the `Production` state.
