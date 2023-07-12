const Projects = require('../models/projects')
var multer = require('multer');
var multipleFileUpload = require('./file-upload');

// const { body, validationResult } = require('express-validator');


// db.smartphones.find({}, { name: 1, price: 1 });

// Retrieve and return Filter List  from  database.
exports.filterList = (req, res) => {
    Projects.aggregate([
        { $group:
       {_id:0,
           Locations: {$addToSet: '$location'},
           PropertyType: {$addToSet: '$property_type'},
           Status: {$addToSet: '$status'},
           Type: {$addToSet: 'area_type'},
        }}
    ])
        .then(prjs => {
            res.send(prjs);
        }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving todos."
        });
    });
};


// Retrieve and return Projects by limit from the database.
exports.findByLimit = (req, res) => {
    Projects.find().sort({timestamp: -1}).limit(8)
        .then(prjs => {
            res.send(prjs);
        }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving todos."
        });
    });
};

// Retrieve and return all Project from the database.
exports.findAll = (req, res) => {
    Projects.find()
        .then(prjs => {
            res.send(prjs);
        }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving todos."
        });
    });
};

// Create project and upload images.
exports.create = {
    uploadForm: function (req, res) {
        console.log(req.body.gallery)
        const PM = new Projects({
            project_name: req.body.project_name,
            location: req.body.location,
            area: req.body.area,
            rent: req.body.rent,
            property_type: req.body.property_type,
            no_of_floors_available: req.body.no_of_floors_available,
            number_of_floors: req.body.number_of_floors,
            status: req.body.status,
            gallery: req.body.gallery,
            description: req.body.description,
            price: req.body.price,
            banner: req.body.banner,
            area_type: req.body.area_type
        });

        // Save project in the database
        PM.save()
            .then(data => {
                res.send({success: true, message: "Project Created Successfully"});
                console.log(data);
            }).catch(err => {
            res.status(500).send({
                success: false,
                message: err.message || "Some error occurred while creating the Project."
            });
        });
    },
    uploadSingle: function (req, res) {
        var upload = multer({
            storage: multipleFileUpload.fileupload.storage(),
            allowedImage: multipleFileUpload.fileupload.allowedImage
        }).single('banner');
        upload(req, res, function (err) {
            if (err instanceof multer.MulterError) {
                res.status(404).send(err);
            } else if (err) {
                res.status(404).send(err);
            } else {
                res.send({success: true, banner: req.file.filename});
            }
        })
    },
    uploadMultiple: function (req, res) {
        var upload = multer({
            storage: multipleFileUpload.fileupload.storage(),
            allowedImage: multipleFileUpload.fileupload.allowedImage
        }).array('gallery', 30);
        upload(req, res, function (err) {
            if (err instanceof multer.MulterError) {
                res.status(404).send(err);
            } else if (err) {
                res.status(404).send(err);
            } else {
                const array = [];
                for (i = 0; i < req.files.length; i++) {
                    array.push(req.files[i].originalname)
                }
                res.send({success: true, data: array});
            }
        })
    }
}

// Delete a Project with the specified id in the request
exports.delete = (req, res) => {
    Projects.findByIdAndRemove(req.params.id)
        .then(prj => {
            if (!prj) {
                return res.status(404).send({
                    success: false,
                    message: "Project not found with id " + req.params.id
                });
            }
            res.send({success: true, message: "Project deleted successfully!"});
        }).catch(err => {
        if (err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Project not found with id " + req.params.todo
            });
        }
        return res.status(500).send({
            success: false,
            message: "Project not delete todo with id " + req.params.id
        });
    });
};

// Update a Project identified by the id in the request
exports.update = (req, res) => {
    console.log(req.body.galery)
    // Find Project and update it with the request body
    Projects.findByIdAndUpdate(req.params.id, {
        project_name: req.body.project_name,
        location: req.body.location,
        area: req.body.area,
        rent: req.body.rent,
        property_type: req.body.property_type,
        no_of_floors_available: req.body.no_of_floors_available,
        number_of_floors: req.body.number_of_floors,
        status: req.body.status,
        gallery: req.body.gallery,
        description: req.body.description,
        price: req.body.price,
        banner: req.body.banner,
        area_type: req.body.area_type
    }, {new: true})
        .then(prj => {
            if (!prj) {
                return res.status(404).send({
                    succes: false,
                    message: "Project not found with id " + req.params.id
                });
            }
            res.send({succes: true, message: "Project Updated Successfully"});
        }).catch(err => {
        if (err.kind === 'ObjectId') {
            return res.status(404).send({
                succes: false,
                message: "Project not found with id " + req.params.id
            });
        }
        return res.status(500).send({
            succes: false,
            message: "Error updating Project with id " + req.params.id
        });
    });
};

// Find a single Project with a id
exports.findOne = (req, res) => {
    console.log(req.body)
    Projects.findById(req.params.id)
        .then(prj => {
            if (!prj) {
                return res.status(404).send({
                    succes: false,
                    message: "Project not found with id " + req.params.id
                });
            }
            res.send({success:true, data:prj});
        }).catch(err => {
        if (err.kind === 'ObjectId') {
            return res.status(404).send({
                succes: false,
                message: "Project not found with id " + req.params.id
            });
        }
        return res.status(500).send({
            succes: false,
            message: "Error retrieving Project with id " + req.params.id
        });
    });
};


// Find a single Project with a id
exports.filter = (req, res) => {
    console.log(req.body.price)

    var query = {};

    if (req.body.project_name){
        query.project_name = req.body.project_name;
    }
    if (req.body.area) {
        query.area = { $gte: req.body.area };
    }
    if (req.body.property_type) {
        query.property_type = req.body.property_type;
    }
    if (req.body.status) {
        query.status = req.body.status;
    }
    if (req.body.no_of_floors_available) {
        query.no_of_floors_available = req.body.no_of_floors_available;
    }
    if (req.body.number_of_floors) {
        query.number_of_floors = req.body.number_of_floors;
    }
    if (req.body.location) {
        query.location = req.body.location;
    }
    if (req.body.location) {
        query.location = req.body.location;
    }
    // if (req.body.price) {
    //     query.price = { $gte: req.body.price };
    // }
    if (req.body.area_type) {
        query.type = req.body.area_type;
    }

    console.log(query)

    Projects.find(query)
        .then(prj => {
            if (!prj) {
                return res.status(404).send({
                    succes: false,
                    message: "Project not found with query"
                });
            }
            res.send({succes: true, data: prj});
        }).catch(err => {
        if (err.kind === 'ObjectId') {
            return res.status(404).send({
                succes: false,
                message: "Project not found with query "
            });
        }
        return res.status(500).send({
            succes: false,
            message: "Error retrieving Projects"
        });
    });
};

