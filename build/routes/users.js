var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/register', function(req, res, next) {
  res.render('register', {
	'title': 'Register'
  });
});

router.post('/register', function(req, res, next) {
    if(!req.body) {
        return res.sendStatus(400);
    }
    res.send('Welcome, ' + req.body.username);
});

router.get('/login', function(req, res, next) {
  res.render('login', {
	'title': 'Login'
  });
});

//router.post('/login', passport.authenticate('local', {});

//router.get('/logout', function(req, res) {});

module.exports = router;
