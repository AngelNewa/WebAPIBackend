const express = require('express');
const Appoinments = require('../models/appointment');
const auth = require('../auth');

const router = express.Router();

router.route("/")
    .get(auth.verifyUser, (req, res, next) => {
        Appoinments.find({ bookedBy: req.user._id })
            .populate({
                path: 'counselor'
            })

            .then(appoinment => {
                res.json(appoinment);
            })
            .catch(next);

    })
    .post(auth.verifyUser, (req, res, next) => {
        let appoinment = new Appoinments(req.body);
        appoinment.user = req.user._id;
        appoinment.save()
            .then(appoinment => {
                res.statusCode = 201;
                res.json(appoinment);
            })
            .catch(next);
    })
    .put((req, res, next) => {
        res.statusCode = 405;
        res.json({ message: "Method not allowed." });

    })
    .delete(auth.verifyUser, (req, res, next) => {
        Appoinments.deleteMany({ user: req.user._id })
            .then(response => {
                console.log("Appoinments doesnot belong to you")
                res.json(response);
            })
            .catch(next);
    })
router.route("/:id")
    .get(auth.verifyUser, (req, res, next) => {
        Appoinments.findOne({ bookedBy: req.user._id, _id: req.params.id })
            .populate({
                path: 'counselor'
            })
            .then(appoinment => {
                console.log(appoinment)
                res.json(appoinment);
            })
            .catch(next);
    })
    .post(auth.verifyUser, (req, res, next) => {
        res.statusCode = 405;
        res.json({ message: "Method not allowed." });
    })
    .put(auth.verifyUser, (req, res, next) => {
        Appoinments.findOneAndUpdate(
            { user: req.user._id, _id: req.params.id },
            { $set: req.body },
            { new: true }
        )
            .populate({
                path: 'counselor'
            })
            .then(reply => {
                res.json(reply);
            })
            .catch(next);
    })
    .delete(auth.verifyUser, (req, res, next) => {
        Appoinments.findOneAndDelete({ user: req.user._id, _id: req.params.id })
            .populate({
                path: 'counselor'
            })
            .then(response => {
                res.json(response);
            })
            .catch(next);
    })

module.exports = router;