var dotenv =require('dotenv').config()
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var connectDB = require("./config/dbConnect")
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var authRout = require('./routes/authRout');
var usersRouter = require('./routes/users');
const { notFound, errorHandler } = require('./middleware/errorHandler');

connectDB()
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/user', authRout);
app.use('/users', usersRouter);

app.use(notFound)
app.use(errorHandler)

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

module.exports = app;
