const express = require('express');
const { getScholarList, AddScholar, UpdateScholar, DeleteScholar, getFilteredScholarList } = require('../controllers/scholar/scholarController');
const { authCheck } = require('../controllers/middlewares');
const ScholarRouter = express.Router();

ScholarRouter.use(authCheck);

ScholarRouter.get("/list",getScholarList);
ScholarRouter.get("/filteredlist/:examId",getFilteredScholarList);
ScholarRouter.post("/add",AddScholar);
ScholarRouter.put("/update",UpdateScholar);
ScholarRouter.delete("/delete/:id",DeleteScholar);

module.exports = ScholarRouter;