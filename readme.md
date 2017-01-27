#Simple E-Commerce Web App

An ES2015 javascript e-commerce web app that is simple, maintainable, easily extensible, and quick to get up and running.
Stack consists of a Node backend running an Express server/API, and a React frontend with vanilla flux pattern.
Designed for deployment on a cloud application platform like Heroku. Uses Postgres, AWS S3 for hosting static assets,
Stripe for processing payments, Sendgrid for sending email, Mixpanel for event-tracking, NewRelic for monitoring,
and Rollbar for error logging. Frontend javascript transpiled with Babel; bundled and uglified with Webpack.
Uses Webpack Dev Server and hot reloading in development environment, and gulp for running tasks.

----------------------------------------------

##First time requirements:

- Postgres installed and running (i.e a local db & a production DB)

- AWS account with S3 setup (don't forget to configure CORS to accept requests from your domain(s))

- A Stripe account

- A Sendgrid account

- A Newrelic account

- A Rollbar account

- A Mixpanel account

##First time installation:

###Clone repo

###Set local ENV Vars

Create a .env file in project root, add to gitignore, set following variables:

NODE_ENV (i.e. 'development' vs 'production')

PORT

ADMIN_EMAIL (where to send email notifications when an order/payment is successfully completed)

DATABASE_URL

AWS_USER

AWS_ACCESS_KEY_ID

AWS_SECRET_ACCESS_KEY

S3_BUCKET

STRIPE_SECRET_KEY

STRIPE_PUBLISHABLE_KEY

SENDGRID_API_KEY

###Set production ENV Vars

E.g. on Heroku this can be done via CLI or in your app's settings / config

###Install modules

`npm install`

###Migrate DB schema and test data

Run contents of schema.sql on local Postgres DB (e.g via psql at command-line or PSequel GUI), then sync with production DB

----------------------------------------------

#Before running locally:

Ensure in webpack.config.js that 'devtools' is set to 'source-map', and that plugins are commented out

Run `npm run gulp dev` to ensure bundle path points to Webpack Dev Server. This will change the following:

1: Inside `./views/index.ejs`:
```
<script src="/js/app.js" charset="utf-8"></script>
```
Will change to:
```
<script src="http://localhost:8080/app.js" charset="utf-8"></script>
```

`npm run dev` will run webpack dev server at localhost:8080

Run either `heroku local` or `node index.js` to start the application server on localhost:5000

----------------------------------------------

#Before deploying to production:

Ensure in webpack.config.js that 'devtools' is set to 'cheap-module-source-map', and that plugins are uncommented

Run `npm run gulp production` to ensure bundle path points to public JS folder. This will change the following:

1: Inside `./views/index.ejs`:
```
<script src="http://localhost:8080/app.js" charset="utf-8"></script>
```
Will change to:
```
<script src="/js/app.js" charset="utf-8"></script>
```

----------------------------------------------

####Testing

In order to run Unit Tests use:

`mocha --compilers js:babel-core/register`

####Notes:

- If deploying to Heroku, Webpack will auto-compile front-end JS during the build step (via postinstall script in package.json). Otherwise, run the `webpack` command (to recompile app.js, etc.) before committing and deploying to production.

- Has a Redis handler (/lib/redis.js) ready to go

- Recommended to push to origin while app is in `Production` state (i.e. after running `npm run gulp production`)
