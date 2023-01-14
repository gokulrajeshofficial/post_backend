var express = require('express');
var router = express.Router();
const {autherizationCheck} = require('../middleware/Authorization')
const {register, login, home, createPost, deletePost, editPost, locationPost, dashboard} =require('../controller/userController');
const passport = require('passport');
const {signupValidation , loginValidation , checkError, postValidation} = require('../middleware/validator')
/* GET home page. */

/* Register */
router.post('/register',signupValidation,checkError, register);

/* Login  */
router.post('/login',loginValidation,checkError,login)

/* Read post */ 
router.get('/home',passport.authenticate('jwt',{session : false}),home)

/*Create Post */
router.post('/post/create',postValidation , checkError ,passport.authenticate('jwt',{session : false}),createPost)

/*Delete Post */
router.delete('/post/delete',passport.authenticate('jwt',{session : false}), autherizationCheck , deletePost )

/*update Post*/
router.put('/post/update', passport.authenticate('jwt',{session : false}), autherizationCheck ,  editPost ) 

router.get('/post/location',passport.authenticate('jwt',{session : false}) , locationPost)

router.get('/dashboard', passport.authenticate('jwt',{session : false}) ,dashboard)

module.exports = router;
