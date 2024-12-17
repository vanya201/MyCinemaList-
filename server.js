const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URI, {
   useNewUrlParser: true,
   useUnifiedTopology: true,
}).then(() => {
   console.log('Connected to MongoDB');
}).catch(err => {
   console.error('Error connecting to MongoDB', err);
});

app.listen(PORT, () => {
   console.log(`Server running on http://localhost:${PORT}`);
});

const movieRoutes = require('./routes/movies');
const reviewRoutes = require('./routes/reviews');
app.use('/movies', movieRoutes);
app.use('/reviews', reviewRoutes);
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));
