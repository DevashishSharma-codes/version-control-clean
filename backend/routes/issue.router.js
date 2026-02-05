const express = require('express');
const IssueRouter = express.Router();
const issueController = require('../controllers/issueController');
IssueRouter.post('/issue/create', issueController.createIssue);
IssueRouter.get('/issue/all', issueController.getAllIssues);
IssueRouter.get('/issue/:id', issueController.getIssueById);
IssueRouter.put('/issue/update/:id', issueController.updateIssueById);
IssueRouter.delete('/issue/delete/:id', issueController.deleteIssueById);

module.exports = IssueRouter;
