/*
 * GET users listing.
 */
var db = require("../lib/sasdb");

var objUtil = require('./util');

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
	var dbc = db.getDBCon();
  console.log(req.body);
	dbc.getConnection(function(error, con) {
		if (!error){
				con.beginTransaction(function(err){
					if (err) {
						res.send(err);
					}
			    con.query("insert into ms_student (fullname) values ('" + req.body.fullname + "')", function(err, result) {
			        if (!err){
			            console.log('Student row inserted' + JSON.stringify(result));
									// Insert row into student class mapping table
									sid = result.insertId;
									clsid = req.body.clsid;
									con.query("insert into rl_student_session(sid, sesid, clsid) values (" + sid + ", 1, " + clsid + ")", function(err, result) {
										if (!err){
											console.log('Student row inserted' + JSON.stringify(result));
											ssid = result.insertId;
											//effective month from when fee is applicable
											month = (req.body.month)?req.body.month:1;
											//transport applicable or not
											tspt = (req.body.transport)?req.body.transport:'N';
											updateFeeSchedule(con, {"ssid":ssid, "clsid":clsid, "month":month, "tspt":tspt, "tdid":req.body.tdid}, function(err){
												if (err) {
													console.log('Error while interting the fee record.');
													con.rollback(function() {
																con.release();
																res.send(err);
													});
												}else{
													// On successful insertion of fee record commit full transaction
													con.commit(function(err) {
					        					if (err) {
															console.log('Error while commit the transaction.');
															con.rollback(function() {
																		con.release();
							        							res.send(err);
							      					});
					        					}else {
															con.release();
					        						console.log('commit success!');
															res.send(result);
														}
					      					}); // End of transaction commit
												} // end of else
											}); // End of updateFeeSchedule
										}
										else{
											console.log('Error while executing second query.');
											con.rollback(function() {
														con.release();
			        							res.send(err);
			      					});
										}
									}); // End of second query
			        }
			        else{
			            console.log('Error while executing first query.');
									con.rollback(function() {
												con.release();
												res.send(err);
									});
			        }
			    }); // End of first query
				}); // End of Transaction
			}
		}); // End of connection
};

function updateFeeSchedule(dbc, pdata, callback){
	console.log(pdata);
	var sql = 'insert into trx_student_fee (ssid, type, month, fcode, amount) values ?';
	var rows = [];
	var insertEachRow = function () {
        dbc.query(sql, [rows], function (err, result) {
            if (err) {
							callback(err);
            }else{
							callback(null);
						}
        });
  };

	// Compile fee records for Tuition Fee
	dbc.query('select amount from ms_tuition_fee where clsid = ' + pdata.clsid, function(err, resObj) {
			if (err){
					callback(err);
			}
			if (resObj.length > 0){
				for (i = pdata.month; i <= 12; i++) {
					rows.push([pdata.ssid, 'C', i, 'T', resObj[0].amount]);
				}
			}
			// Compile the fee records for Transport Fee
			if (pdata.tspt == 'Y'){
				dbc.query('select amount from ms_transport_fee where tdid = ' + pdata.tdid, function(err, resTF) {
						if (err){
								callback(err);
						}
						if (resTF.length > 0){
							for (i = month; i <= 12; i++) {
								rows.push([ssid, 'C', i, 'C', resTF[0].amount]);
							}
						}
						insertEachRow();
				});
			}else {
				insertEachRow();
			}
	});
}

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
	sid = req.params.id;
	dbc.beginTransaction(function(err){
		if (err) {
			res.send(err);
		}
		dbc.query("delete from trx_student_fee where ssid in (select ssid from rl_student_session where sid = " + sid + ")", function(err, result) {
			if (err) {
				console.log('Error while deleting the fee record.');
				dbc.rollback(function() {
							res.send(err);
				});
			}
			dbc.query("delete from rl_student_session where sid = " + sid, function(err, result) {
				if (err) {
					console.log('Error while deleting the fee record.');
					dbc.rollback(function() {
								res.send(err);
					});
				}
				dbc.query("delete from rl_student_session where sid = " + sid, function(err, result) {
					if (err) {
						console.log('Error while deleting the fee record.');
						dbc.rollback(function() {
									res.send(err);
						});
					}
					// On successful deletion of student records from all respective tables
					dbc.commit(function(err) {
						if (err) {
							console.log('Error while commit the transaction.');
							dbc.rollback(function() {
										res.send(err);
							});
						}
						console.log('commit success!');
						res.send(result);
					}); // End of transaction commit
				}); // End of delete statement from ms_student
			}); // End of delete statement from rl_student_session
    }); // End of delete statement from trx_student_fee
	}); // End of Transaction
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
