if(process.env.NODE_ENV === 'production'){
  module.exports = {
    mongoURI: 'mongodb://adlascio:arthur1@ds163480.mlab.com:63480/vidjot-live'
  };
} else {
  module.exports = {
    mongoURI: 'mongodb://localhost/vidjot-dev'
  };
}