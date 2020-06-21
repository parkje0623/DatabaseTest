const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

var util = require('util');

const { Pool } = require('pg')
var pool;
pool = new Pool({
  connectionString: process.env.DATABASE_URL
  //'postgres://postgres:cmpt276@localhost/people'
  //When pushing to Heroku server, change connectionString to 'process.env.DATABASE_URL'
})

express()
  .use(express.json())
  .use(express.urlencoded({extended:false}))

  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))

  .get('/database', (req, res) => {
    var getPeopleQuery = 'SELECT * FROM person';
    pool.query(getPeopleQuery, (error, result) => {
      if (error)
        res.end(error);
      var results = {'rows':result.rows};
      res.render('pages/db', results);
    })
  })

  .get('/individual', (req, res) => {
    var getPeopleQuery = 'SELECT name, type FROM person';
    pool.query(getPeopleQuery, (error, result) => {
      if (error)
        res.end(error);
      var results = {'rows':result.rows};
      res.render('pages/individual', results);
    })
  })

  .post('/add', (req, res) => {
    var addName = req.body.Name;
    var addSize = req.body.Size;
    var addHeight = req.body.Height;
    var addType = req.body.Type;
    var addPeopleQuery = "INSERT INTO person (name, size, height, type) VALUES ('%s', '%s', '%s', '%s')";
    var addQuery = util.format(addPeopleQuery, addName, addSize, addHeight, addType);
    pool.query(addQuery, (error, result) => {
      if (error)
        res.end(error);
      res.render('pages/return');
    });
  })

  .post('/delete', (req, res) => {
    var deletName = req.body.DName;
    var deleteType = req.body.DType;
    var deletePeopleQuery = "DELETE FROM person WHERE name='%s' and type='%s'";
    var deleteQuery = util.format(deletePeopleQuery, deletName, deleteType);
    pool.query(deleteQuery, (error, result) => {
      if (error)
        res.end(error);
      res.render('pages/return');
    });
  })

  .post('/update', (req, res) => {
    var updateName = req.body.UName;
    var updateType = req.body.UType;
    var updatingAttr = req.body.UAttr;
    var newValue = req.body.UNew;
    var updatePeopleQuery = "UPDATE person SET %s='%s' WHERE name='%s' and type='%s'";
    var updateQuery = util.format(updatePeopleQuery, updatingAttr, newValue, updateName, updateType);
    pool.query(updateQuery, (error, result) => {
      if (error)
        res.end(error);
      res.render('pages/return');
    });
  })

  .post('/single', (req, res) => {
    var viewName = req.body.EnterName;
    var viewType = req.body.EnterType;
    var getPersonQuery = "SELECT * FROM person WHERE name='%s' and type='%s'";
    var getQuery = util.format(getPersonQuery, viewName, viewType);
    pool.query(getQuery, (error, result) => {
      if (error)
        res.end(error);
      var results = {'rows':result.rows};
      res.render('pages/singleValue', results);
    });
  })

  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
