const db = require('./db_connection');

module.exports = function() {


    function findDepartments() {

        let stuff = db.connection.query("SELECT * FROM departments", function(err, data) {
            if(err) throw err;
            console.log("found some data");
            console.table(data);
        });
        return stuff;
    }

}