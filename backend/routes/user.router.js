const express = require('express');
const userRouter = express.Router();
const userController = require('../controllers/userController');



userRouter.get('/allUsers',userController.getAllUsers );
userRouter.post('/signup', userController.signup);
userRouter.post('/login', userController.login);
userRouter.post('/logout', userController.logout);
userRouter.get('/userProfile/:id', userController.getUserProfile);
userRouter.put('/updateProfile/:id', userController.updateUserProfile);
userRouter.delete('/deleteProfile/:id', userController.deleteUserProfile);
userRouter.post('/userProfile/:id/star', userController.toggleStar);

module.exports = userRouter;
