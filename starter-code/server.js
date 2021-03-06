'use strict';

// TODO: Install and require the NPM Postgres package 'pg' into your server.js, and ensure that it is then listed as a dependency in your package.json
const pg = require('pg');
const fs = require('fs');
const express = require('express');

// REVIEW: Require in body-parser for post requests in our server. If you want to know more about what this does, read the docs!
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3000;
const app = express();

// TODO: Complete the connection string for the url that will connect to your local postgres database
// Windows and Linux users; You should have retained the user/pw from the pre-work for this course.
// Your url may require that it's composed of additional information including user and password
// const conString = 'postgres://USER:PASSWORD@HOST:PORT/DBNAME';
const conString = 'postgres://postgres:1234@localhost:5432/database';

// TODO: Our pg module has a Client constructor that accepts one argument: the conString we just defined.
//       This is how it knows the URL and, for Windows and Linux users, our username and password for our
//       database when client.connect is called on line 26. Thus, we need to pass our conString into our
//       pg.Client() call.
const client = new pg.Client(conString);

// REVIEW: Use the client object to connect to our DB.
client.connect();


// REVIEW: Install the middleware plugins so that our app is aware and can use the body-parser module
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('./public'));


// REVIEW: Routes for requesting HTML resources
app.get('/new', function(request, response) {
  // COMMENT: What number(s) of the full-stack-diagram.png image correspond to the following line of code? Identify which line(s) of code from the client-side blog app are interacting with this particular piece of `server.js`, and the name of the method. Do those lines of code interact with or invoke a different portion of the blog, and if so, where? What part of CRUD is being enacted/managed by this particular piece of code?
  // Put your response here...
  // since we're sending the new.html file, number 5 would apply.  This is a get method where the user is getting a view.  This method is only acessed when the user navigates to the /new url.  No ajax method applies.
  response.sendFile('new.html', {root: './public'});
});


// REVIEW: Routes for making API calls to use CRUD Operations on our database
app.get('/articles', function(request, response) {
  // COMMENT: What number(s) of the full-stack-diagram.png image correspond to the following line of code? Identify which line(s) of code from the client-side blog app are interacting with this particular piece of `server.js`, and the name of the method. Do those lines of code interact with or invoke a different portion of the blog, and if so, where? What part of CRUD is being enacted/managed by this particular piece of code?
  // Put your response here...
  // since we are querying for data, numbers 3 and 4 would apply, this would be the READ in CRUD.  We're using a get method originating from an ajax request on article.js on lines 45-54.  The response from the databasse in being passed into Article.loadAll on line 50.
  client.query('SELECT * FROM articles')
  .then(function(result) {
    response.send(result.rows);
  })
  .catch(function(err) {
    console.error(err)
  })
});

app.post('/articles', function(request, response) {
  // COMMENT: What number(s) of the full-stack-diagram.png image correspond to the following line of code? Identify which line(s) of code from the client-side blog app are interacting with this particular piece of `server.js`, and the name of the method. Do those lines of code interact with or invoke a different portion of the blog, and if so, where? What part of CRUD is being enacted/managed by this particular piece of code?
  // Put your response here...
  // since we are adding items to the database using INSERT, 3 would apply.  This would be the CREATE in CRUD.  This route is hit from the post method originating in article.js on lines 69-75.  It doesn't invoke anything on the front end except for a console.log confirming the addition.
  client.query(
    `INSERT INTO
    articles(title, author, "authorUrl", category, "publishedOn", body)
    VALUES ($1, $2, $3, $4, $5, $6);
    `,
    [
      request.body.title,
      request.body.author,
      request.body.authorUrl,
      request.body.category,
      request.body.publishedOn,
      request.body.body
    ]
  )
  .then(function() {
    response.send('insert complete')
  })
  .catch(function(err) {
    console.error(err);
  });
});

app.put('/articles/:id', function(request, response) {
  // COMMENT: What number(s) of the full-stack-diagram.png image correspond to the following line of code? Identify which line(s) of code from the client-side blog app are interacting with this particular piece of `server.js`, and the name of the method. Do those lines of code interact with or invoke a different portion of the blog, and if so, where? What part of CRUD is being enacted/managed by this particular piece of code?
  // Put your response here...
  // we're updating data here and not passing it back to the front end, so only 3 would apply.  This is a PUT method.  This method is beinf called on lines 88-105 in article.js.
  client.query(
    `UPDATE articles
    SET
      title=$1, author=$2, "authorUrl"=$3, category=$4, "publishedOn"=$5, body=$6
    WHERE article_id=$7;
    `,
    [
      request.body.title,
      request.body.author,
      request.body.authorUrl,
      request.body.category,
      request.body.publishedOn,
      request.body.body,
      request.params.id
    ]
  )
  .then(function() {
    response.send('update complete')
  })
  .catch(function(err) {
    console.error(err);
  });
});

app.delete('/articles/:id', function(request, response) {
  // COMMENT: What number(s) of the full-stack-diagram.png image correspond to the following line of code? Identify which line(s) of code from the client-side blog app are interacting with this particular piece of `server.js`, and the name of the method. Do those lines of code interact with or invoke a different portion of the blog, and if so, where? What part of CRUD is being enacted/managed by this particular piece of code?
  // Put your response here...
  // like the put and post request, only 3 would apply.  Like the post/put methods, we're only sending a string confirmation back to the front end, so number 4 is skipped.  This method is being invoked by an AJAX request on lines 77-86 in article.js
  client.query(
    `DELETE FROM articles WHERE article_id=$1;`,
    [request.params.id]
  )
  .then(function() {
    response.send('Delete complete')
  })
  .catch(function(err) {
    console.error(err);
  });
});

app.delete('/articles', function(request, response) {
  // COMMENT: What number(s) of the full-stack-diagram.png image correspond to the following line of code?   Identify which line(s) of code from the client-side blog app are interacting with this particular piece of `server.js`, and the name of the method. Do those lines of code interact with or invoke a different portion of the blog, and if so, where? What part of CRUD is being enacted/managed by this particular piece of code?
  // Put your response hetre...
  //1.  This is to delete all the articles.  It is still #3.  Because we are not passing any data from the databaseto server.
  //2.  Lines 58-67
  //3.  Delete
  //4.  just deleting data, not immdeiately chhanginnngg the view
  //5. Destroy

  client.query(
    'DELETE FROM articles;'
  )
  .then(function() {
    response.send('Delete complete')
  })
  .catch(function(err) {
    console.error(err);
  });
});

// COMMENT: What is this function invocation doing?
// Put your response here...
// This line is calling the loadDB() function which create a table if there isnt one. And loads that table with the article data.
// the article data comes from the loadArticles() function whichh  get the data from hackerIpsum.json
loadDB();

app.listen(PORT, function() {
  console.log(`Server started on port ${PORT}!`);
});


//////// ** DATABASE LOADER ** ////////
////////////////////////////////////////
function loadArticles() {
  // COMMENT: What number(s) of the full-stack-diagram.png image correspond to the following line of code? Identify which line(s) of code from the client-side blog app are interacting with this particular piece of `server.js`, and the name of the method. Do those lines of code interact with or invoke a different portion of the blog, and if so, where? What part of CRUD is being enacted/managed by this particular piece of code?
  // Put your response here...
  //1.  3 and 4
  //2.  used by Article.fetchAll (line 45-54), doing a GET method.
  //3.  READ
  client.query('SELECT COUNT(*) FROM articles')
  .then(result => {
    // REVIEW: result.rows is an array of objects that Postgres returns as a response to a query.
    //         If there is nothing on the table, then result.rows[0] will be undefined, which will
    //         make count undefined. parseInt(undefined) returns NaN. !NaN evaluates to true.
    //         Therefore, if there is nothing on the table, line 151 will evaluate to true and
    //         enter into the code block.
    if(!parseInt(result.rows[0].count)) {
      fs.readFile('./public/data/hackerIpsum.json', (err, fd) => {
        JSON.parse(fd.toString()).forEach(ele => {
          client.query(`
            INSERT INTO
            articles(title, author, "authorUrl", category, "publishedOn", body)
            VALUES ($1, $2, $3, $4, $5, $6);
          `,
            [ele.title, ele.author, ele.authorUrl, ele.category, ele.publishedOn, ele.body]
          )
        })
      })
    }
  })
}

function loadDB() {
  // COMMENT: What number(s) of the full-stack-diagram.png image correspond to the following line of code? Identify which line(s) of code from the client-side blog app are interacting with this particular piece of `server.js`, and the name of the method. Do those lines of code interact with or invoke a different portion of the blog, and if so, where? What part of CRUD is being enacted/managed by this particular piece of code?
  // Put your response here...

  //1.  3 and 4. it creates a table if there isnt one. And loads that table with the article data.
  //2.  the article data comes from the loadArticles() function whichh  get the data from hackerIpsum.json.  There is no route, it's just a CREATE method.
    client.query(`
    CREATE TABLE IF NOT EXISTS articles (
      article_id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      author VARCHAR(255) NOT NULL,
      "authorUrl" VARCHAR (255),
      category VARCHAR(20),
      "publishedOn" DATE,
      body TEXT NOT NULL);`
    )
    .then(function() {
      loadArticles();
    })
    .catch(function(err) {
      console.error(err);
    }
  );
}
