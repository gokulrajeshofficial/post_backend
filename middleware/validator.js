
const { check, validationResult } = require('express-validator');
 
exports.signupValidation = [
    check('username', 'Please include a valid email').isEmail().normalizeEmail({ gmail_remove_dots: true }),
    check('password', 'Password must be 6 or more characters').isLength({ min: 6 })
]
 
exports.loginValidation = [
     check('username', 'Please type a valid email').isEmail().normalizeEmail({ gmail_remove_dots: true }),
     check('password', 'Password must be 6 or more characters').isLength({ min: 6 })
 
]
exports.postValidation = [
    check('title', 'Please enter the title').exists(),
    check('body', 'Please enter the body').exists(),
    check('location', 'Location is required').exists()
    

]
module.exports.checkError = (req,res,next)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }else{
        next()
    }
}