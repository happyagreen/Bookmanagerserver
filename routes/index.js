var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var path = require('path');
var fs = require('fs');
var exec = require('child_process').exec;

var dbclient = mysql.createConnection({
    host :"localhost",
    user :"root",
    password :"z1x2c3v4b5",
    database :"ebook"
})

dbclient.connect(function(err,results){});

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});
router.get('/get/bookid/:isbn', function(req, res, next) {
    dbclient.query(
        'select id from bookinformation where isbn = ?',
        [req.params.isbn],
        function(err, result) {
            res.send(result[0])
        });
});

router.get('/get/bookshelf/id/:name/:account', function(req, res, next) {
    dbclient.query(
        'select id from bookshelf where (name =? and account =?)',
        [req.params.name,req.params.account],
        function(err, result) {
            res.send(result[0])
        });
});


router.get('/upload/bookshelf/:id/:name/:line/:column/:account',function (req,res,next)
{
    dbclient.query(
        'INSERT INTO bookshelf VALUES(null,?,?,?,?)',
        [req.params.name,req.params.column,req.params.line,req.params.account],
        function (err, result) {
            if(err){
                res.send("false");
            }
            else res.send("true")
        }
    );
});


router.get('/upload/book/:bookid/:bookshelf/:account/:column/:line',function (req,res,next)
{
    dbclient.query(
        'INSERT INTO relation VALUES(null,?,?,?,?,?)',
        [req.params.bookid,req.params.bookshelf,req.params.account,req.params.line,req.params.column],
        function (err, result) {
            if(err)res.send(err);
            else res.send("true");
        }
    );
});

router.get('/get/bookshelf/all/:account',function (req,res,next)
{
    dbclient.query(
        'select * from bookshelf where account =?',
        [req.params.account],
        function (err, result) {
            res.send(result)
        }
    );
});

router.get('/get/relation/:account',function (req,res,next)
{
    dbclient.query(
        'select * from relation where account =?',
        [req.params.account],
        function (err, result) {
            res.send(result)
        }
    );
});

router.get('/get/json/:id',function (req,res,next)
{
    dbclient.query(
        'select jsondata from bookinformation where id =?',
        [req.params.id],
        function (err, result) {
            res.send(result[0].jsondata)
        }
    );
});

router.get('/download/json/:isbn',function(req,res){
    var a = '';
    var jsondata;
    dbclient.query(
        'select jsondata from bookinformation where isbn = ?',
        [req.params.isbn],
        function(err, result) {
            var j = result.length;
            if(j == 0){
                exec('python '+'test.py'+' '+req.params.isbn,function(err,stdout,stdin){

                    if(err){
                        console.log(err);
                    }
                    if(stdout)
                    {
                        a = stdout;
                        jsondata = JSON.parse(a);
                        dbclient.query('update bookinformation set title= ?,jsondata = ? where isbn= ?',[jsondata.title,a,req.params.isbn], function(err, result) {
                            if (err) throw err;
                        });
                        res.send(a);
                    }


                });
            }
            else{
                res.send(result[0].jsondata);
            }
        }
    );
});

router.get('/download/image/:isbn',function(req,res){
    dbclient.query(
        'select coverpath from bookinformation where isbn = ?',
        [req.params.isbn],
        function(err, result) {
            console.log(result);
            var filePath = path.join(result[0].coverpath);
            fs.exists(filePath, function (exists) {
                res.sendfile(exists ? filePath : path.join(targetDir, config.default));
            });
        }
    );
});

router.get('/search/name/:key',function(req,res){
    var selectsen = "select id from bookinformation where title like '%"+req.params.key+"%'";
    dbclient.query(
        selectsen,
        function(err, result) {
            res.send(result);
        }
    );
});

router.get('/search/isbn/:isbn',function(req,res){

    dbclient.query(
        "select id from bookinformation where isbn = ?",
        [req.params.isbn],
        function(err, result) {
            res.send(result);
        }
    );
});



router.get('/search/name/all/:key',function(req,res){
    var selectsen = "select id from bookinformation where title like '%"+req.params.key+"%'";
    dbclient.query(
        selectsen,
        function(err, result) {
            res.send(result);
        }
    );
});

router.get('/search/isbn/all/:isbn',function(req,res){
    dbclient.query(
        "select jsondata from bookinformation where isbn = ?",
        [req.params.isbn],
        function(err, result) {
            res.send(result[0].jsondata);
        }
    );
});

router.get('/get/allid/',function(req,res){
    dbclient.query(
        "select id from bookinformation",
        function(err, result) {
            res.send(result);
        }
    );
});

router.get('/download/jsonbyid/:id',function(req,res){
    dbclient.query(
        "select jsondata from bookinformation where id = ?",
        [req.params.id],
        function(err, result) {
            res.send(result[0].jsondata);
        }
    );
});

router.get('/delete/book/:id/:bookshelfid',function(req,res){
    dbclient.query(
        "delete from relation where bookid = ? AND bookshelfid = ?",
        [req.params.id,req.params.bookshelfid],
        function(err, result) {
            res.send("true");
            if(err)
                res.send("false")
        }
    );
});

router.get('/delete/bookshelf/:id',function(req,res){
    dbclient.query(
        "delete from bookshelf where id = ?",
        [req.params.id],
        function(err, result) {
            res.send("true");
            if(err)
                res.send("false")
        }
    );
});

router.get('/upload/collection/:bookid/:account',function(req,res){
    dbclient.query(
        "INSERT INTO collection VALUES(null,?,?)",
        [req.params.account,req.params.bookid],
        function(err, result) {
            res.send("true");
            if(err)
                res.send("false")
        }
    );
});

router.get('/get/collection/:account',function(req,res){
    dbclient.query(
        "select bookid from collection where account =?",
        [req.params.account],
        function(err, result) {
            res.send(result);
        }
    );
});

router.get('/delete/collection/:bookid/:account',function(req,res){
    dbclient.query(
        "delete from collection where bookid = ? and account = ?",
        [req.params.bookid,req.params.account],
        function(err, result) {
            res.send("true");
            if(err)
                res.send("false")
        }
    );
});

var asdasd = function() {
    jQuery.no
        .ajax({
            url: '',
            success: function (data) {
                console.log(data);
            }
        });
}


module.exports = router;
