var express = require('express');
var router = express.Router();
var pg = require('pg');
var connectionString;

if(process.env.DATABASE_URL) {//connecting to outside heroku database
  pg.defaults.ssl = true;
  connectionString = process.env.DATABASE_URL;
} else{//connecting to local database before being connected to heroku for testing purposes
  connectionString = 'postgress://localhost:5432/patroni_assigner';
}




router.post("/*", function(req,res){
  var first_name = req.body.first_name;
  var last_name = req.body.last_name;


  console.log("totally people bro",req.body);

  pg.connect(connectionString, function(err, client, done){
    if (err){
      console.log('error connecting to DB:', err);
      res.status(500).send(err);
      done();
      return;

    }
    var query = client.query('INSERT INTO tbl_people (first_name, last_name) VALUES ($1,$2);',[first_name, last_name]);

    query.on('end', function(){
      res.status(200).send("succues insert");
      done();
    });

    query.on('error', function(error){
      console.log("error inserting perosn into DB:", error);
      res.status(500).send(error);
      done();

    });


  })



});

router.get("/*", function(req,res){

  console.log("hey you got get got goot people");

  pg.connect(connectionString, function(err, client, done){
    if (err){
      console.log('error connecting to DB:', err);
      res.status(500).send(err);
      done();
      return;

    }
    var results=[];
    var query = client.query('SELECT * FROM tbl_people WHERE patronus_id IS NULL;');


    query.on('row', function(row){
      console.log("we got a row",row);
      results.push(row);


    });

    query.on('end', function(){
      res.send(results);

      done();
    });

    query.on('error', function(error){
      console.log("error inserting perosn into DB:", error);
      res.status(500).send(error);
      done();

    });


  })

});

// var connectionString;
//
// if(process.env.DATABASE_URL) {//connecting to outside heroku database
//   pg.defaults.ssl = true;
//   connectionString = process.env.DATABASE_URL;
// } else{//connecting to local database before being connected to heroku for testing purposes
//   connectionString = 'postgress://localhost:5432/patroni_assigner';
// }

// pg.connect(connectionString, function(err, client, done){
//   if (err){
//     console.log("Error connecting to DB!", err);
//   } else {
//     var query = client.query('CREATE TABLE IF NOT EXISTS tbl_patroni (' +
//                               'patronus_id SERIAL PRIMARY KEY,' +
//                               'patronus_name varchar(20) NOT NULL );' +
//                               'CREATE TABLE IF NOT EXISTS tbl_people (' +
//                               'person_id SERIAL PRIMARY KEY,' +
//                               'first_name varchar(20) NOT NULL,' +
//                               'last_name varchar(20) NOT NULL,' +
//                               'patronus_id integer FOREIGN KEY REFERENCES tbl_patroni(patronus_id));');
//   }
//
//   query.on('end')
//
// });

module.exports = router;
