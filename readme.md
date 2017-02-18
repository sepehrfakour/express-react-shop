#Express React Shop

##A simple and fast marketplace web application

An ES2015 javascript single-page marketplace app that is simple, maintainable, easily extensible, and quick to get up and running. Stack consists of a Node backend running an Express server/API, and a React frontend using flux pattern. Configured to use Postgres, AWS S3 for static assets, Stripe for processing payments, Sendgrid for sending email, Mixpanel for event-tracking, NewRelic for monitoring, and Rollbar for error logging. Frontend javascript transpiled, bundled, and uglified with Webpack/Babel. SASS bundled via middleware. Uses Webpack Dev Server with hot-reloading. Uses Gulp for running tasks.

----------------------------------------------

##Requirements:

- Postgres installed and running (local db and separate production DB)

- Accounts for the following services:

- AWS account with S3

- Stripe

- Sendgrid

- Newrelic

- Rollbar

- Mixpanel

----------------------------------------------

##First time installation:


####1 - Clone repo, `npm install`

####2 - Set local environment variables

Create a .env file in project root and set the following:

- NODE_ENV ('development' or 'production')

- PORT

- ADMIN_EMAIL (where to send email notifications when an order/payment is successfully completed)

- ADMIN_USERNAME (admin dashboard authentication)

- ADMIN_PASSWORD (admin dashboard authentication)

- SESSION_SECRET (for configuring express-session middleware)

- SESSION_NAME (for configuring express-session middleware)

- DATABASE_URL

- AWS_USER

- AWS_ACCESS_KEY_ID

- AWS_SECRET_ACCESS_KEY

- S3_BUCKET

- STRIPE_SECRET_KEY

- STRIPE_PUBLISHABLE_KEY

- SENDGRID_API_KEY

- NEW_RELIC_APP_NAME (only used on 'production' env. use different names on different environments)

- NEW_RELIC_LICENSE_KEY (only used on 'production' env)

- NEW_RELIC_NO_CONFIG_FILE (only used on 'production' env. recommended setting: `true` i.e. no config file)

- NEW_RELIC_LOG (only used on 'production' env. recommended setting: `stdout` i.e. no log file)

- ROLLBAR_ACCESS_TOKEN (only used on 'production' env)

####3 - Set production environment variables

####4 - Install modules

`npm install`

####5 - Migrate DB schema and seed

Run contents of schema.sql on local Postgres DB (use psql from the command line or a GUI like PSequel), then sync with production DB. Insert a few rows of test data into items table in local DB.

----------------------------------------------

#Before running locally:

- Ensure in webpack.config.js that 'devtools' is set to 'source-map', and that plugins are commented out

- Run `npm run gulp dev` to ensure bundle path points to Webpack Dev Server

- `npm run dev` will run webpack dev server at localhost:8080

- Run either `heroku local` or `node index.js` to start the application server on localhost:5000

----------------------------------------------

#Before deploying to production:

- Ensure in webpack.config.js that 'devtools' is set to 'cheap-module-source-map', and that plugins are uncommented

- Run `npm run gulp production` to ensure bundle path points to public JS folder

----------------------------------------------

####Testing

In order to run Unit Tests use:

`mocha --compilers js:babel-core/register`

####Notes:

- If deploying to Heroku, Webpack will auto-compile front-end JS during the build step (via postinstall script in package.json). Otherwise, run the `webpack` command (to recompile app.js, etc.) before committing and deploying to production.

- Current session/user authentication system is suitable for having one or a small number of admin accounts only. Use an appropriate (external) session store for handling customer/user accounts.

- Has a Redis handler (/lib/redis.js) ready to go, just add REDIS_URL environment variable

- Recommended to push to origin while app is in `Production` state (i.e. after running `npm run gulp production`)

####Roadmap:

- Allow admin to add items as a group, set order status, edit banner images

- Add pagination for admin items and orders views

- Add New Relic and Rollbar

- Lazy load images a bit below the fold
