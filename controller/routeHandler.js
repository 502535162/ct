var jwt    		= require('jsonwebtoken');
var globals		= require('../config/global');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var PACKAGES 	= ["Basic Package", "Super Package", "Women Health", "Individual Checkup", "Weekly Deals", "Physio Theraphy"];

var smtpTransport = nodemailer.createTransport("SMTP",{
    host: "smtp.elasticemail.com",
    post: 2525,
    auth: {
        user: "sales@checkthat.in",
        pass: "27c4d4bc-06cf-4cac-881f-d42a1fc4b588"
    }
});

module.exports = function(app, utils){
	app.post('/signin', function(req, res){
		utils.getUserData(req.body, function(err, user){
			if(err)
				res.json({ success: false, message: 'User not found' });
			else{
				if (!user) {
					res.json({ success: false, message: 'Authentication failed. User not found.' });
				}else if(user){
					if (user.password != req.body.password) {
						res.json({ success: false, message: 'Authentication failed. Wrong password.' });
					}else{
						var token = jwt.sign(user, globals.secret, {
				          expiresInMinutes: 1440 // expires in 24 hours
				        });
				        var obj = {email:user.email, firstname:user.firstname, lastname:user.lastname, mobile:user.mobile, token:token}
				        res.json({success: true, userdetails: obj});
					}
				}
			}
		});
	});

	app.post('/signup', function(req, res){
		utils.getUserData(req.body, function(err, user){
			if(user)
				res.json({ success: false, message: 'User Already Exists' });
			else{
				utils.createuser(req.body, function(err, result){
					if(err)
						res.send(err);
					else{
						var mailOptions={
						   to : req.body.email,
						   subject : "Email Confirmation",
						   html : '<b>Account Created Successfully With Checkthat</b>'
						}

						// send mail with defined transport object
						smtpTransport.sendMail(mailOptions, function(error, info){
						    if(error){
						        return console.log(error);
						    }
						    res.json({success: true, message:"Account Created Successfully"});
						});
					}
				});
			}
		});
	});

	app.post('/update', function(req, res){
		utils.verifyToken(req.body.token, function(doc){
			if(doc.success == false){
				res.json(doc);
			}
			else{
				utils.updateuser(req.body, function(err, result){
					if(err)
						res.json({ success: false, message: 'Error in updating profile' });
					else
						res.json({success: true, message:"Profile Updated Successfully"});
				});
			}
		});
	});

	app.post('/logout', function (req, res){
		res.send("logout success");
	});

	app.get('/paypaltranscation', function(req, res){
		console.log("paypaltranscation");
		console.log(req);
		res.redirect('/');
	});

	app.post('/forgotPassword', function (req, res){
		utils.getUserData(req.body, function(err, user){
			if(err)
				res.json({ success: false, message: 'User not found' });
			else{
					if (!user) {
						res.json({ success: false, message: 'Authentication failed. User not found.' });
					}else if(user)
					{
						var mailOptions={
						   to : req.body.email,
						   subject : "Fogot password",
						   text : user.password,
						   html : '<b>'+user.password+'</b>'
						}

						// send mail with defined transport object
						smtpTransport.sendMail(mailOptions, function(error, info){
						    if(error){
						        return console.log(error);
						    }
						    res.json({success: true, message:"Password Sent To Your Registered E-Mail Id"});
						});
						
					}
				}
		});
	});

	app.get('/getpackages', function(req, res){
		var query   = 'SELECT * FROM packages WHERE display=1'
		utils.getpackages(query, function(err, doc){
			if(err){
				res.json({ success: false, message: 'No Tests at the moment' });
			}
			else{
				res.json({success: true, tests: doc});
			}
		});
	});

	app.post('/getPackagesinfo', function(req, res){
		if(req.body.city == "Hyderabad")
			cityFlag = 1;
		else
			cityFlag = 2;
		var query   = 'SELECT * FROM checkthat_package WHERE checkthat_package.Package_Name=? AND checkthat_package.City_Flag='+cityFlag
		
		utils.getpackageInfo(query, req.body.packagename, function(err, doc){
			if(err){
				res.json({ success: false, message: 'No Tests at the moment' });
			}
			else{
				res.json({success: true, tests: doc});
			}
		});
	});

	app.post('/getProfilesInfo', function(req, res){
		var query   = 'SELECT * FROM checkthat_profile'
		utils.getTestsandProfiles(query, function(err, doc){
			if(err){
				res.json({ success: false, message: 'No Tests at the moment' });
			}
			else{
				res.json({success: true, profiles: doc});
			}
		});
	});

	app.post('/getTestsInfo', function(req, res){
		var query   = 'SELECT * FROM checkthat_test'
		utils.getTestsandProfiles(query, function(err, doc){
			if(err){
				res.json({ success: false, message: 'No Tests at the moment' });
			}
			else{
				res.json({success: true, tests: doc});
			}
		});
	});

	app.post('/createPatientRec', function(req, res){
		utils.verifyToken(req.body.token, function(doc)
		{
			if(doc.success == false){
				res.json(doc);
			}
			else{
				var pDetails = {User_ID:doc.decoded.id, Patient_Last_Name:req.body.data.lastname, 
					Patient_First_Name:req.body.data.firstname,Patient_Mobile_Number:req.body.data.mobile, 
					Patient_Age:req.body.data.age, Patient_Gender:req.body.data.gender.name};
				utils.createpatientRec(pDetails, function(err, result){
					if(err){
						res.json({ success: false, message: 'Error in Saving Patient Information' });
					}
					else{
						res.json({success: true, pat_id:result.insertId});
					}
				})
			}
		});
	});

	app.post('/createServiceRec', function(req, res){
		utils.verifyToken(req.body.token, function(doc)
		{
			if(doc.success == false){
				res.json(doc);
			}
			else{
				if(req.body != undefined && req.body.data != undefined){
					var flag = false;
					if(req.body.data.venue == "sCollection")
						flag = true;

					var sDetails = {User_ID:doc.decoded.id, Patient_ID:req.body.data.pat_id, 
						Package_ID:req.body.data.packageid, Profile_ID:null, Test_ID:null, 
						SampleCollection_flag:flag, Inperson_flag:!flag, isTransport:req.body.data.isTransport, 
						Address1: req.body.data.pAddress1, Address2: req.body.data.pAddress2, City: req.body.data.pCity, 
						State: req.body.data.pCity, Zipcode: req.body.data.pZipcode, Appointment_date:req.body.data.dt, 
						Total_Cost:req.body.data.total_cost};

					utils.createserviceRec(sDetails, function(err, result){
						if(err){
							res.json({ success: false, message: 'Error in Saving Patient Information' });
						}
						else{
							res.json({success: true, service_id:result.insertId});
						}
					})
				}
			}
		});
	});

	app.post('/createsalesRec', function(req, res){
		utils.verifyToken(req.body.token, function(doc)
		{
			if(doc.success == false){
				res.json(doc);
			}
			else{
				var salesDetails = {User_ID:doc.decoded.id, Service_ID:req.body.data.service_id, 
					Patient_ID:req.body.data.pat_id, Package_ID:req.body.data.packageid, 
					Profile_ID:req.body.data.profileid, Test_ID:req.body.data.testid, Total_Cost:req.body.data.total_cost, 
					Transcation_ID:null, Transcation_Status:"pending"};

				utils.createsalesRec(salesDetails, function(err, result){
					if(err){
						res.json({ success: false, message: 'Error in Creating Transcation Details' });
					}
					else{
						res.json({success: true, pat_id:result.insertId});
					}
				})
			}
		});
	});

	app.post('/getPaitentRec', function(req, res){
		utils.verifyToken(req.body.token, function(doc)
		{
			if(doc.success == false){
				res.json(doc);
			}
			else{
				utils.getPatientRec("SELECT * FROM checkthat_patient_tbl WHERE User_ID=?", doc.decoded.id, 
					function(err, result){
						if(err){
							res.json({ success: false, message: 'No Patients' });
						}
						else{
							res.json({success: true, patients: result});
						}
				});
			}
		});
	});

	app.post("/transction", function(req, res){
		console.log(req);
		res.send("success");
	});
}