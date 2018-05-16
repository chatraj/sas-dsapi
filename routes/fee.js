/*
 * GET users listing.
 */
var db = require("../lib/sasdb");

var objUtil = require('./util');

exports.collection = function(req, res) {
	//getStudentList(req, res);
	var dbc = db.getDBCon();
  var cMonth = objUtil.getCurrentMonth();
		console.log(req.body);
    dbc.query("insert into trx_student_fee (ssid, type, month, amount) values (" + req.body.ssid + ", 'D', " + cMonth + ", "+ req.body.amount +")", function(err, result) {
        //connection.end();
        if (!err){
            console.log('Payment collection row inserted' + result);
            res.send(result);
        }
        else{
            console.log('Error while performing Query.');
        }
    });

};


exports.dues = function(req, res) {
	//getStudentList(req, res);
	var dbc = db.getDBCon();
	var cMonth = objUtil.getCurrentMonth();
		dbc.query('select type, sum(amount) as amount from `trx_student_fee` where ssid = '+ req.params.ssid + ' and month < ' + cMonth + ' group by type', function(err, rows) {
			//connection.end();
			if (!err){
                console.log('Getting previous fee record for a student');
				payableAmt = 0;
				paymentAmt = 0;
				rows.forEach(function (feerec) {
				// Generate due slip and update the status
				if (feerec.type == 'C')
					payableAmt = feerec.amount;
				else
					paymentAmt = feerec.amount

				});
				dbc.query('select mf.feehead, tsf.type, tsf.amount from `trx_student_fee` tsf left join `ms_feehead` mf on tsf.fcode = mf.fcode where ssid = '+ req.params.ssid + ' and month = ' + cMonth, function(err, curfees) {
					//connection.end();
					if (!err){
						console.log('Getting current month fee record for a student');
						curtotal = 0;
						curpmt = 0;
						curfees.forEach(function(frec){
							if (frec.type == 'C')
								curtotal = curtotal + frec.amount;
							else
								curpmt = curpmt + frec.amount;
						});
						res.send({"prevdues": payableAmt - paymentAmt, "curtotal": curtotal , "curpmt": curpmt , "curfees":curfees});
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

exports.payment = function(req, res) {
	//getStudentList(req, res);
	var dbc = db.getDBCon();

  		dbc.query('SELECT cdate, amount from trx_student_fee where ssid = ' + req.params.id + " and type = 'D'", function(err, rows) {
			//connection.end();
			if (!err){
                console.log('Getting payment record for a student');
                res.send(rows);
			}
			else{
				console.log('Error while performing Query.');
			}
		});

};
