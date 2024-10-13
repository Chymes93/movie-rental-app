const { Rental, validate } = require('../models/rental');
const { Movie } = require('../models/movie');
const { Customer } = require('../models/customer');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const express = require('express');
const router = express.Router();


router.get('/', [auth, admin], async (req, res ) => {
    const rentals = await Rental.find().sort('-dateOut');
    res.send(rentals);
})

router.post('/', auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const customer = await Customer.findById(req.body.customerId)
    if (!customer) return res.status(404).send('Invalid customer id.');

    const movie = await Movie.findById(req.body.movieId)
    if (!movie) return res.status(404).send('Invalid movie id.');

    if (movie.numberInStock === 0) return res.status(400).send('Movie is not available.');

    let rental = new Rental({
        customer: {
           _id: customer._id,
           name: customer.name, 
           phone: customer.phone
        },
        movie: {
            _id: movie._id,
            title: movie.title, 
            dailyRentalRate: movie.dailyRentalRate
        },

    })

    // number in stock reduces while rental true
    movie.numberInStock--
    rental = await rental.save();
    res.send(rental);
})








module.exports = router