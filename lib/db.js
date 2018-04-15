var mongo = require("mongojs");

var con;

module.exports = {
	getDBCon : function() {
		return con;
	},
	createDBCon : function() {	
	        //con = mongo("mongodb://sftadmin:password@ds023118.mlab.com:23118/sftdb", ["student"]);
            //con = mongo("mongodb://sftadmin:password@ds023118.mlab.com:23118/sftdb");
            con = mongo("mongodb://admin:JSZFWKJXLTHHNOMI@bluemix-sandbox-dal-9-portal.7.dblayer.com:25708,bluemix-sandbox-dal-9-portal.6.dblayer.com:25708/admin?ssl=true");
            console.log("DB connection created");			
        }
};