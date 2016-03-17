var express = require('express');
var path = require('path');
var router = express.Router();
var patroni = require('./patroni.js');
var people = require('./people.js');

//Initial get to database
router.use('/people', people);

router.use('/patroni', patroni);




router.get('/*', function(req, res){
    var file = req.params[0] || "/views/index.html";
    res.sendFile(path.join(__dirname, "../public/" + file));
});


module.exports = router;
