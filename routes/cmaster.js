/*
 * GET users listing.
 */
var db = require("../lib/sasdb");

exports.sessionlist = function(req, res) {
	var dbc = db.getDBCon();

  		dbc.query('SELECT * from ms_session', function(err, rows) {
			if (!err){
                console.log('Getting session list');
                res.send(rows);
			}
			else{
				console.log('Error while performing Query.');
			}
		});

};

exports.classlist = function(req, res) {
	var dbc = db.getDBCon();

  		dbc.query('SELECT * from ms_class', function(err, rows) {
			if (!err){
                console.log('Getting class list');
                res.send(rows);
			}
			else{
				console.log('Error while performing Query.');
			}
		});

};

exports.feeheadlist = function(req, res) {
	//getStudentList(req, res);
	var dbc = db.getDBCon();

  		dbc.query('SELECT * from ms_feehead', function(err, rows) {
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
exports.classwisefeehead = function(req, res) {
	//getStudentList(req, res);
	var dbc = db.getDBCon();
    console.log(req.params.id);

    dbc.query('SELECT fh.fhid, fh.feehead, fc.amount from rl_feehead_class fc, ms_feehead fh where fc.fhid = fh.fhid and fc.clsid =' + req.params.id, function(err, rows) {
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
