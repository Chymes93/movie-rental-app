const { User, validate } = require('../models/user');

const express = require('express');

const router = express.Router();

const _ = require('lodash');

const bcrypt = require('bcrypt');




router.post('/', async(req, res) => {
    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send('User already registered.');

    user = new User(_.pick(req.body, ['name', 'email', 'password']))
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    await user.save();
    const token = user.generateAuthToken();
    res.header('x-auth-token', token).send(_.pick(user,['_id', 'name', 'email']));
})


router.put('/:id', async (req, res) => {
    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true });
    if (!user) return res.status(404).send('User not found.');

    await user.save();
    res.send(user);

})

router.delete('/:id', async (req, res) => {
    const user = await User.findByIdAndDelete(req.params.id)
    if (!user) return res.status(400).send('User with the given id not found');

    res.send(user);
})

module.exports = router;