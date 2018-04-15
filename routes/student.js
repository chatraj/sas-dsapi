/*
 * GET users listing.
 */
var db = require("../lib/sasdb");

exports.list = function(req, res) {
	//getStudentList(req, res);
	var dbc = db.getDBCon();

  		dbc.query('select s.fullname, c.clsname from ms_student s, rl_student_session ss, ms_class c where s.sid = ss.sid and ss.clsid = c.clsid', function(err, rows) {
			//connection.end();
			if (!err){
                console.log('Getting student list');
                res.send(rows);
			}
			else{
				console.log('Error while performing Query.');
			}
		});

};

exports.find = function(req, res) {
	//getStudentList(req, res);
	var dbc = db.getDBCon();
    console.log(req.params.id);

    dbc.query('SELECT * from ms_student where sid =' + req.params.id, function(err, rows) {
        if (!err){
            console.log('Getting student detail for sid ' + req.params.id);
            console.log(rows[0]);
            res.send(rows[0]);
        }
        else{
            console.log('Error while performing Query.');
        }
    });

};

exports.create = function(req, res) {
	//getStudentList(req, res);
	var dbc = db.getDBCon();
    console.log(req.body);

    dbc.query("insert into ms_student (fullname) values ('" + req.body.fullname + "')", function(err, result) {
        //connection.end();
        if (!err){
            console.log('Student row inserted' + JSON.stringify(result));
            //res.send(result);
			// Insert row into student class mapping table
			sid = result.insertId;
			dbc.query("insert into rl_student_session(sid, sesid, clsid) values (" + sid + ", 1, " + req.body.clsid + ")", function(err, result) {
				//connection.end();
				if (!err){
					console.log('Student row inserted' + JSON.stringify(result));
					res.send(result);
				}
				else{
					console.log('Error while performing Query.');
				}
			});
        }
        else{
            console.log('Error while performing Query.');
        }
    });

};

exports.update = function(req, res) {
	//getStudentList(req, res);
	var dbc = db.getDBCon();
    console.log(req.body);

    dbc.query("update ms_student set fullname = '" + req.body.fullname + "' where sid = " + req.params.id, function(err, result) {
        //connection.end();
        if (!err){
            console.log('Student row updated' + result);
            res.send(result);
        }
        else{
            console.log('Error while performing Query.');
        }
    });

};

exports.delete = function(req, res) {
	//getStudentList(req, res);
	var dbc = db.getDBCon();
    console.log('Row to be deleted for record:- ' + Number(req.params.id));
    dbc.query("delete from ms_student where sid = " + req.params.id, function(err, result) {
        //connection.end();
        if (!err){
            console.log('Student row deleted' + result);
            res.send(result);
        }
        else{
            console.log('Error while performing Query.');
        }
    });
};

exports.enroll = function(req, res) {
	//getStudentList(req, res);
	var dbc = db.getDBCon();
    console.log(req.body);

    dbc.query("insert into rl_student_session (sid, sesid, clsid) values (" + req.body.sid + ", " + req.body.sesid + ", " + req.body.clsid +")", function(err, result) {
        //connection.end();
        if (!err){
            console.log('Student enrollment row inserted' + result);
            res.send(result);
        }
        else{
            console.log('Error while performing Query.');
        }
    });

};

exports.enrollupdate = function(req, res) {
	//getStudentList(req, res);
	var dbc = db.getDBCon();
    console.log(req.body);

    dbc.query("update rl_student_session set sid = " + req.body.sid + ", sesid = " + req.body.sesid + ", clsid = " + req.body.clsid + " where ssid = " + req.params.id, function(err, result) {
        //connection.end();
        if (!err){
            console.log('Student enrollment row updated' + result);
            res.send(result);
        }
        else{
            console.log('Error while performing Query.');
        }
    });

};

exports.sessionwisestudent = function(req, res) {
	//getStudentList(req, res);
	var dbc = db.getDBCon();

  		dbc.query('SELECT * from rl_student_session where sesid = ' + req.params.id, function(err, rows) {
			//connection.end();
			if (!err){
                console.log('Getting student list for a given session');
                res.send(rows);
			}
			else{
				console.log('Error while performing Query.');
			}
		});

};

exports.classwisestudent = function(req, res) {
	//getStudentList(req, res);
	var dbc = db.getDBCon();

  		dbc.query('select s.fullname, ss.ssid, ss.clsid from ms_student s, rl_student_session ss where s.sid = ss.sid and ss.clsid =' + req.params.id, function(err, rows) {
			//connection.end();
			if (!err){
                console.log('Getting student list for a given class');
                res.send(rows);
			}
			else{
				console.log('Error while performing Query.');
			}
		});

};
