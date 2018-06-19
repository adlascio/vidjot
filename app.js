const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const mongoose = require('mongoose');


const app = express();

//Load routes
const ideas = require('./routes/ideas');
const users = require('./routes/users');

//Passport config
require('./config/passport')(passport);

//Map global promise - get rid of warning
//mongoose.Promise = global.Promise;

//Connect to mongoose
mongoose.connect('mongodb://localhost/vidjot-dev')
  .then(() => {
    console.log('MongoDB Connected');

  })
  .catch(err => console.log('Error connecting MongoDB', err));

//Handlebars Middleware
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

//Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Static folder
app.use(express.static(path.join(__dirname, 'public')));

//Method override middleware
app.use(methodOverride('_method'));

//Express session middleware
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

//Global variables
app.use(function(request, response, next){
  response.locals.success_msg = request.flash('success_msg');
  response.locals.error_msg = request.flash('error_msg');
  response.locals.error = request.flash('error');
  response.locals.user = request.user || null;
  next();
});

//Index Route
app.get('/', (request, response) => {
  const title = 'Welcome';
  response.render('index', {
    title: title
  });
});

//About Route
app.get('/about', (request, response) => {
  response.render('about');
});

//Use routes
app.use('/ideas', ideas);
app.use('/users', users);

const port = 5000;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});