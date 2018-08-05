var mysql      = require('mysql');
var database = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '123456',
    database : 'database',
    port     : '3306'
});

database.connect();

var req = 'SELECT * FROM database.user LIMIT 0, 1000';

database.query(req, function (error, results, fields) {
    if (error) throw error;
    for (x in results) {
        console.log(results[x]);
    }
});