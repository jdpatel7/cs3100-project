const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const compression = require('compression');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();
app.use(helmet());
app.use(compression());

// https://www.npmjs.com/package/express-rate-limit
const limiter = rateLimit({
  // 1 minute
  windowMs: 60 * 1000, 
  // limit each IP to 100 requests per windowMs
  max: 100,
});
app.use(limiter);

// Configure Express
// app.set('view engine', 'pug');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const robots = require('./backend/robots');
app.use('/robots.txt', robots.txt);

// API routes to backend logic
const apiRouter = require('./backend/api');
app.use('/api', apiRouter);

// Serve static React frontend
app.use(express.static(path.join(__dirname, 'frontend/build')));
app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.type('text');
  res.send(err.status + ' ' + res.locals.message);

  next();
});

module.exports = app;
