var mysql = require('mysql');

/*var db_config = {
	host     : 'localhost',
	user     : 'winkuser',
	password : 'password',
	database : 'winkdb'
};*/

/*var db_config = {
	host     : 'us-cdbr-sl-dfw-01.cleardb.net',
	user     : 'b715fa727d737c',
	password : '9af0415c',
	database : 'ibmx_6b2ad6cb2648fb3'
};*/


var db_config = {
	host     : 'eu-cdbr-sl-lhr-01.cleardb.net',
	user     : 'b5ed5c48f53f16',
	password : '0e53cc45',
	database : 'ibmsl_f7107a364008ac283c8a'
};


var con = null;

function handleDisconnect() {
  con = mysql.createConnection(db_config); // Recreate the connection, since
                                                  // the old one cannot be reused.
  con.connect(function(err) {              // The server is either down
    if(err) {                                     // or restarting (takes a while sometimes).
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
    }else {
	  console.log("Database connection success...");    
	}                                     // to avoid a hot loop, and to allow our node script to
  });                                     // process asynchronous requests in the meantime.
                                          // If you're also serving http, display a 503 error.
  con.on('error', function(err) {
    console.log('db error', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
      handleDisconnect();                         // lost due to either server restart, or a
	  //con = null;
    } else {                                      // connnection idle timeout (the wait_timeout
      throw err;                                  // server variable configures this)
    }
  });
}

module.exports = {
	getDBCon : function() {
	//	if (con != null)
			return con;
	//	else {
	//		console.log('Reconnect the DB Server');
	//		handleDisconnect();	
	//	}
	},
	
	createDBCon : function() {
		handleDisconnect();
    }

};