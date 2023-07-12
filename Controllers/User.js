const User = require('../models/user')

// Create and new User
exports.createUser = (req, res) => {
    // Create a User
    var db = new User({username : req.body.username, password: req.body.password});
    // Save project in the database
    db.save()
        .then(data => {
            res.send(data);
        }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the User."
        });
    });
};

// Find a User with id
exports.findUser = (req, res) => {
    User.findOne({username:req.body.username, password: req.body.password})
        .then(prj => {
            if(!prj) {
                return res.status(404).send({
                    success: false,
                    message: "Invalid Credentials"
                });
            }
            res.send({success: true, data: prj});
        }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                success: false,
                message: "User not found"
            });
        }
        return res.status(500).send({
            success: false,
            message: "Error retrieving user"
        });
    });
};


// Create and delete User
exports.deleteUser = (req, res) => {
    // Create a project
    // var db = new User({username : req.body.username, password: req.body.password});
    // Save project in the database
    User.findByIdAndRemove(req.params.id)
        .then(todo => {
            if(!todo) {
                return res.status(404).send({
                    message: "User not found with id " + req.params.id
                });
            }
            res.send({message: "User deleted successfully!"});
        }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "User not found with id " + req.params.todo
            });
        }
        return res.status(500).send({
            message: "User not delete todo with id " + req.params.id
        });
    });
};

// Create and delete User
exports.updateUser = (req, res) => {
    // Create a project
    User.findByIdAndUpdate(req.params.id, {
        username : req.body.username,
        password: req.body.password
    }, {new: true})
        .then(prj => {
            if(!prj) {
                return res.status(404).send({
                    message: "User not found with id " + req.params.id
                });
            }
            res.send(prj);
        }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "User not found with id " + req.params.id
            });
        }
        return res.status(500).send({
            message: "User updating Project with id " + req.params.id
        });
    });
};