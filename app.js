'use strict';

// load modules
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const routes = require('./routes');
const { sequelize } = require('./models');

// create the Express app
const app = express();

// variable to enable global error logging
const enableGlobalErrorLogging =
	process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true';

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.json());

// setup morgan which gives us http request logging
app.use(morgan('dev'));

// API routes
app.use('/api', routes);

(async () => {
	try {
		await sequelize.authenticate();
		console.log('Database has successfully connected');
	} catch (error) {
		console.log('Not able to connect to the database:', error);
	}
})();

// send 404 if no other route matched
app.use((req, res) => {
	res.status(404).json({
		message: 'Route Not Found'
	});
});

// setup a global error handler
app.use((err, req, res, next) => {
	if (enableGlobalErrorLogging) {
		console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
	}

	res.status(err.status || 500).json({
		message: err.message,
		error: {}
	});
});

// set our port
app.set('port', process.env.PORT || 5000);

// start listening on our port
const server = app.listen(app.get('port'), () => {
	console.log(`Express server is listening on port ${server.address().port}`);
});
