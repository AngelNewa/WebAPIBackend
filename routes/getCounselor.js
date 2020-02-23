const express = require('express');
const Counselor = require('../models/counselors');
const router = express.Router();

router.get('/allCounselors',(req,res,next)=>{
    Counselor.find().then(function(counselors){
        res.send(counselors);
    }).catch(function (e) {
        res.send(e);
    });
});
module.exports = router;

