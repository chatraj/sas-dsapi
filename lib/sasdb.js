var mysql = require('mysql');

var db_url = null;

var pool = null;

module.exports = {
	getDBCon : function() {
		return pool;
	},

	createDBCon : function() {
			// Check for DB Configuration
			if (process.env.JAWSDB_URL)
				db_url = process.env.JAWSDB_URL;
			else
				db_url = 'mysql://zvfi9h2xa67zo6ts:ye9drrew9r04yod7@ol5tz0yvwp930510.cbetxkdyhwsb.us-east-1.rds.amazonaws.com:3306/m9xtennwtfhdhcw9';
			console.log(process.env.JAWSDB_URL);
			pool = mysql.createPool(db_url);
			console.log("Database connection pool success...");
    }

};
