var jwt    		= require('jsonwebtoken');
var globals		= require('../config/global');
var nodemailer 	= require('nodemailer');
var PACKAGES 	= ["Basic Package", "Super Package", "Women Health", "Individual Checkup", "Weekly Deals", "Physio Theraphy"];

var smtpTransport = nodemailer.createTransport("SMTP",{
    service: "Gmail",
    auth: {
        user: "venkatasrinag",
        pass: "pvsrinag"
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
					else
						res.send({success: true, message:"Record Created Successfully"});
				});
			}
		});
	});

	app.post('/logout', function (req, res){
		res.send("logout success");
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
		var query   = 'SELECT * FROM checkthat_package WHERE checkthat_package.Package_Name=?'
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
				
			}
		});
	});
}