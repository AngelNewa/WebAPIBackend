const express = require('express');
const Counselor = require('../models/counselors');
const auth = require('../auth');

const router = express.Router();

//Updated Schema
router.route('/')
    .get(auth.verifyUser, (req, res, next) => {
        Counselor.find()
            .then(counselor => {
                res.json(counselor);
            })
            .catch(next);

    })
    .post(auth.verifyUser, (req, res, next) => {
        let counsoler = new Counselor(req.body);
        owner = req.user._id;
        counsoler.save()
            .then(counsoler => {
                res.statusCode = 201;
                res.json(counsoler);
            })
            .catch(next);
    })

    .put((req, res, next) => {
        res.statusCode = 405;
        res.json({ message: "Method not allowed." });

    })
    .delete(auth.verifyAdmin, (req, res, next) => {
        Counselor.deleteMany()
            .then(response => {
                console.log("You need to be admin for this operation.")
                res.json(response);
            })
            .catch(next);
    })

router.route('/myCounsolerProfile')
    .get(auth.verifyUser, (req, res, next) => {
        Counselor.find({ owner: req.user._id })
            .then((counselor) => {
                res.json(counselor);
            }).catch(next);
    })

//Previous Schema
router.post('/counselors', auth.verifyUser, (req, res, next) => {
    Counselor.create({
        image: req.body.image,
        counselorName: req.body.counselorName,
        Price: req.body.Price,
        Description: req.body.description,
    })
        .then((counselor) => {
            res.statusCode = 200; 01
            res.json(counselor);
        }).catch(next);
})


router.route('/:id')
    .get(auth.verifyUser, (req, res, next) => {
        Counselor.findOne({ owner: req.user._id, _id: req.params.id })
            //Counselor.findOne({ owner: req.user._id, _id: req.params.id })
            .then((counselor) => {
                if (counselor == null)
                    throw new Error("No counselor found!")
                res.json(counselor);
            }).catch(next);
    })

    .post((req, res) => {
        res.statusCode = 405;
        res.json({ message: "Invalid method for inserting data." })
    })

    // .put(auth.verifyUser, (req, res, next) => {
    //     Counselor.findOneAndUpdate({
    //         owner: req.user._id,
    //         _id: req.params.id
    //     },
    //         {
    //             $set: req.body
    //         },
    //         {
    //             new: true
    //         })
    //         .then((reply) => {
    //             if (reply == null)
    //                 throw new Error("Counselor not found!");
    //             res.json(reply);
    //         }).catch(next);
    // })
    .put(auth.verifyUser, (req, res, next) => {
        Counselor.findOneAndUpdate(
            { owner: req.user._id, _id: req.params.id },
            { $set: req.body },
            { new: true }
        )
            .populate({
                path: 'owner'
            })
            .then(reply => {
                res.json(reply);
            })
            .catch(next);
    })
    .delete(auth.verifyUser, (req, res, next) => {
        Counselor.findOneAndDelete({ owner: req.user._id, _id: req.params.id })
            .populate({
                path: 'owner'
            })
            .then(response => {
                res.json(response);
            })
            .catch(next);
    });

module.exports = router;