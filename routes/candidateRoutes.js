const express = require('express');
const { getCandidateList, addCandidate, candidateCount, deleteCandidate } = require('../controllers/candidate/candidateController');
const { authCheck } = require('../controllers/middlewares');
const candidateRouter = express.Router();

candidateRouter.use(authCheck);
candidateRouter.get('/:examId',getCandidateList); // all candidates for a given exam
candidateRouter.get('/count/:examId',candidateCount); //number of candidate assigned for a given exam
candidateRouter.post('/add',addCandidate); // adding new candidate for a given exam
candidateRouter.delete('/delete/:serialNumber/:examId',deleteCandidate);

module.exports = candidateRouter;