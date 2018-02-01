var express = require('express');
var mysql = require('mysql');
var dbclient = mysql.createConnection({
    host :"localhost",
    user :"root",
    password :"z1x2c3v4b5",
    database :"ebook"
})

//dbclient.query("INSERT INTO bookinformation VALUES(NULL,'asd','D:/asd','12345','asdasdassd')")
var router = express.Router();

/* GET users listing. */

var tours = [
    { id: 0, name: 'Hood River', price: 99.99 },
    { id: 1, name: 'Oregon Coast', price: 149.95 },
];

router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

router.get('/login/:account/:password', function(req, res, next) {
    dbclient.query(
        'select password from users where account = ?',
        [req.params.account],
        function(err, result) {
            if(result.length <= 0){
                res.send('false');
            }else {
                if(result[0].password == req.params.password){
                    res.send('true');
                }else
                    res.send('false');
            }
        });
});

router.get('/register/:account/:password', function(req, res, next) {
    dbclient.query(
        'select password from users where account = ?',
        [req.params.account],
        function(err, result) {
            if(result.length > 0){
                res.send('existence');
            }else {
                dbclient.query("INSERT INTO users VALUES(?,?)",[req.params.account,req.params.password])
                res.send('true');
            }
        });
});

router.get('/headers', function(req,res){
    res.set('Content-Type','text/plain');
    var s = '';
    for(var name in req.headers) s += name + ': ' + req.headers[name] + '\n';
    res.send(s);
});





module.exports = router;
