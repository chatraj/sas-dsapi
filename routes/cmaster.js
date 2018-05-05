/*
 * GET users listing.
 */
var db = require("../lib/sasdb");

exports.sessionlist = function(req, res) {
	var dbc = db.getDBCon();
	dbc.getConnection(function(error, con) {
		if (!error){
  		con.query('select sesid, sesname from ms_session where status = 1', function(err, rows) {
				con.release();
				if (!err){
            console.log('Getting session list');
            res.send(rows);
				}
				else{
					console.log('Error while performing Query.');
				}
			});// End of query execution
		} // If no error in getting connection
	}); // End of db connection
};

exports.classlist = function(req, res) {
	var dbc = db.getDBCon();
	dbc.getConnection(function(error, con) {
		if (!error){
  		con.query('select clsid, clsname from ms_class', function(err, rows) {
				con.release();
				if (!err){
            console.log('Getting class list');
            res.send(rows);
				}
				else{
					console.log('Error while performing Query.');
				}
			}); // End of query execution
		} // If no error in getting connection
	}); // End of db connection
};

exports.feeheadlist = function(req, res) {
	//getStudentList(req, res);
	var dbc = db.getDBCon();

  		dbc.query('select fhid, feehead, cycle from ms_feehead where status = 1', function(err, rows) {
			//connection.end();
			if (!err){
                console.log('Getting feehead list');
                res.send(rows);
			}
			else{
				console.log('Error while performing Query.');
			}
		});

};

exports.distancetype = function(req, res) {
	//getStudentList(req, res);
	var dbc = db.getDBCon();

  		dbc.query('select tdid, distance from ms_transport_fee where status = 1', function(err, rows) {
			//connection.end();
			if (!err){
                console.log('Getting Transport distance type list');
                res.send(rows);
			}
			else{
				console.log('Error while performing Query.');
			}
		});

};

exports.classwisefeehead = function(req, res) {
	//getStudentList(req, res);
	var dbc = db.getDBCon();
    console.log(req.params.id);

    dbc.query('select fh.fhid, fh.feehead, fc.amount from rl_feehead_class fc, ms_feehead fh where fc.fhid = fh.fhid and fc.clsid =' + req.params.id, function(err, rows) {
        if (!err){
            console.log('Getting feehead list for a class ' + req.params.id);
            console.log(rows);
            res.send(rows);
        }
        else{
            console.log('Error while performing Query.');
        }
    });

};
