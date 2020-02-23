const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./users');
const router = express.Router();
const auth = require('../auth');

router.post('/register', (req, res, next) => {
    let password = req.body.password;
    bcrypt.hash(password, 10, function (err, hash) {
        if (err) {
            let err = new Error('Could not hash..');
            err.status = 500;
            return next(err);
        }
        User.create({
            username: req.body.username,
            phone: req.body.phone,
            address: req.body.address,
            password: hash
        }).then((user) => {
            let token = jwt.sign({ _id: user._id }, process.env.SECRET);
            res.json({ status: "Registered successfully", token: token });


        }).catch(next);
    });
});

router.post('/login', (req, res, next) => {
    User.findOne({ username: req.body.username })
        .then((user) => {
            if (user == null) {
                let err = new Error('User not found');
                err.status = 401;
                return next(err);
            }
            else {
                bcrypt.compare(req.body.password)
                    .then((isMatch) => {
                        if (!isMatch) {
                            let err = new Error('Password does not match!!');
                            err.status = 401;
                            return next(err);
                        }
                        let token = jwt.sign({ _id: user._id }, process.env.SECRET);
                        res.json({ status: 'Login Successful!', token: token });

                    }).catch(next);
            }
        }).catch(next);
})
router.get('/me', auth.verifyUser, (req, res, next) => {
    User.findById({ _id: req.user._id })
        .then((result) => {
            res.json(result)
        })
        .catch(next)
})

router.get('/user', auth.verifyUser, (req, res, next) => {
    User.find({ admin: false })
        .then((result) => {
            res.json(result)
        })
        .catch(next)
})

router.put('/userUpdate', auth.verifyUser, (req, res, next) => {
    User.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, doc) => {
        if (!err) {
            res.json({ status: 'Profile updated' });
        } else {
            console.log('Error' + err);
            res.json('Error on updating');
        }
    });
});

router.get('/me', auth.verifyUser, (req, res, next) => {
    // res.json({ username: req.user.username, firstName: req.user.firstName, lastName: req.user.lastName });
    res.json(req.user);
});
router.put('/me', auth.verifyUser, (req, res, next) => {
    User.findByIdAndUpdate(req.user._id, { $set: req.body }, { new: true })
        .then((user) => {
            res.json(user);
        })
});

module.exports = router;