const mongoose = require('mongoose');
const config = require('config');
const genreRoute = require('./routes/genres');
const customerRoute = require('./routes/customers');
const movieRoute = require('./routes/movies');
const rentalRoute = require('./routes/rentals');
const userRoute = require('./routes/users');
const login = require('./routes/auth');
const express = require('express');
const app = express();


if (!config.get('jwtPrivateKey')) {
    console.error('FATAL ERROR: jwtPrivateKey is not defined.');
    process.exit(1);
}


mongoose.connect('mongodb://localhost/movie')
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.log('Could not connect to MongoDB'));

app.use(express.json());
app.use('/api/genre', genreRoute)
app.use('/api/customers', customerRoute);
app.use('/api/movies', movieRoute);
app.use('/api/rentals', rentalRoute);
app.use('/api/register', userRoute);
app.use('/api/login', login);


const port = process.env.PORT || 3000
app.listen(port, () => console.log(`listening on port port ${port}`));