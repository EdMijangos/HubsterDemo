require('dotenv').config();

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
const hbs          = require('hbs');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');
const passport     = require('./helpers/passport');
const session      = require('express-session');
const MongoStore   = require('connect-mongo')(session);
const cors         = require('cors')


mongoose.Promise = Promise;
mongoose
//mongodb://localhost/server  mongodb://demo:demo22@ds215502.mlab.com:15502/demo
//deberia ir en una variable de entorno
  .connect('mongodb://demo:demo22@ds215502.mlab.com:15502/demo', {useMongoClient: true})
  .then(() => {
    console.log('Connected to Mongo!')
  }).catch(err => {
    console.error('Error connecting to mongo', err)
  });

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

//passport setup
app.use(passport.initialize());
app.use(passport.session());
//se desactiva el CORS para el deploy
// app.use(cors({
//   origin:true,
//   credentials:true
// }));

//session setup
app.use(session({
  secret: 'hobby',
  resave: true,
  saveUninitialized: true,
  cookie: { httpOnly: true, maxAge: 2419200000},
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 60 * 60 * 24 * 30
  }),
}));

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express View engine setup

app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));
      

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));



// default value for title local
app.locals.title = 'Express - Generated with IronGenerator';



const index = require('./routes/index');
const auth = require('./routes/auth');
const views = require('./routes/views')
app.use('/api/', auth);
app.use('/api/', views);  
app.use('/api/', index);
app.get("*", (req, res)=>{
  res.sendFile(path.join(__dirname, 'public', "index.html"));
})


module.exports = app;
