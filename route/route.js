var express = require("express");
const PrjCnt = require("../Controllers/Projects");
const UserCnt = require("../Controllers/User");

var router = express.Router();

router.get("/", (req, res) => {
  res.send("hello world");
});

// User Routes
router.post("/user/create", UserCnt.createUser);
router.post("/user", UserCnt.findUser);
router.delete("/user/delete/:id", UserCnt.deleteUser);
router.put("/user/update/:id", UserCnt.updateUser);

// Project Routes
router.get("/projects", PrjCnt.findAll);
router.get("/projects/new", PrjCnt.findByLimit);
router.post("/project/filter", PrjCnt.filter);
router.get("/project/filter-list", PrjCnt.filterList);
router.post("/project/create", PrjCnt.create.uploadForm);
router.post("/project/create/upload-banner", PrjCnt.create.uploadSingle);
router.post("/project/create/upload-gallery", PrjCnt.create.uploadMultiple);

router.get("/project/:id", PrjCnt.findOne);
router.get("/project/delete/:id", PrjCnt.delete);
router.put("/project/update/:id", PrjCnt.update);

module.exports = router;
