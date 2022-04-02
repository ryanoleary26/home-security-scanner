var createError = require('http-errors');
var express = require('express');
// var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config();
const cors = require('cors');

const indexRouter = require('./routes/index');
const appRouter = require('./routes/scan');

app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors());
app.use('/', indexRouter);
app.use('/api', appRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  console.log(err.message);
  res.send('error');
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`listening on port: ${PORT}`);
});
