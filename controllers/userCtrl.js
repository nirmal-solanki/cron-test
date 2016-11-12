var userSchema = require("../schema/userSchema");
var moment = require('moment');
var jwt = require('jwt-simple');


/*
 |--------------------------------------------------------------------------
 | Generate JSON Web Token
 |--------------------------------------------------------------------------
 */
function createJWT(user) {
    var payload = {
        sub: user._id,
        iat: moment().unix(),
        exp: moment().add(14, 'days').unix()
    };
    return jwt.encode(payload, 'secret');
}

/*
 * GET users listing.
 */
exports.getUsers = function (req, res) {
    var response = {};
    userSchema.find({}, function (err, data) {
        if (err) {
            response = {"error": true, "message": "Error fetching data"};
        } else {
            response = {"error": false, "message": data};
        }
        res.json(response);
    });
};

/*
 * POST create user.
 */
exports.createUser = function (req, res) {
    req.assert('email','A valid email is required').isEmail();
    req.assert('password','Password is required').notEmpty();

    var errors = req.validationErrors();
    if(errors){
        res.status(422).json({"error": true, "message": "Email and Password are required"});
        return;
    }

    var db = new userSchema();
    var response = {};
    db.email = req.body.email;
    //db.userPassword = require('crypto').createHash('sha1').update(req.body.password).digest('base64');
    db.password = req.body.password;
    db.save(function (err) {
        if (err) {
            response = {"error": true, "message": "Error adding data"};
        } else {
            response = {"error": false, "message": "Data added"};
        }
        res.json(response);
    });
};

/*
 * GET user by id.
 */
exports.getUser = function (req, res) {
    var response = {};
    userSchema.findById(req.params.id, function (err, data) {
        if (err) {
            response = {"error": true, "message": "Error fetching data"};
        } else {
            response = {"error": false, "message": data};
        }
        res.json(response);
    });
};

/*
 * UPDATE user.
 */
exports.updateUser = function (req, res) {
    req.assert('email','A valid email is required').isEmail();
    req.assert('password','Password is required').notEmpty();

    var errors = req.validationErrors();
    if(errors){
        res.status(422).json({"error": true, "message": "email and password are required"});
        return;
    }


    var response = {};
    userSchema.findById(req.params.id, function (err, data) {
        if (err) {
            response = {"error": true, "message": "Error fetching data"};
        } else {
            if (req.body.userEmail !== undefined) {
                data.userEmail = req.body.userEmail;
            }
            if (req.body.userPassword !== undefined) {
                data.userPassword = req.body.userPassword;
            }
            data.save(function (err) {
                if (err) {
                    response = {"error": true, "message": "Error updating data"};
                } else {
                    response = {"error": false, "message": "Data is updated for " + req.params.id};
                }
                res.json(response);
            })
        }
    });
};

/*
 * DELETE user.
 */
exports.deleteUser = function (req, res) {
    var response = {};
    userSchema.findById(req.params.id, function (err, data) {
        if (err) {
            response = {"error": true, "message": "Error fetching data"};
        } else {
            userSchema.remove({_id: req.params.id}, function (err) {
                if (err) {
                    response = {"error": true, "message": "Error deleting data"};
                } else {
                    response = {"error": true, "message": "Data associated with " + req.params.id + "is deleted"};
                }
                res.json(response);
            });
        }
    });
};

/*
 * POST login.
 */
exports.login = function (req, res) {
    var response = {};
    userSchema.findOne({ email: req.body.email }, function(err, user) {
        if (!user) {
            return res.status(401).send({ message: 'Invalid email and/or password' });
        }

        if(user.password === req.body.password){
            res.send({ token: createJWT(user), message: 'Login successfully'});
        }else{
            return res.status(401).send({ message: 'Invalid email and/or password' });
        }
    });

};