const express = require('express');
const Review = require('../models/Review');
const Movie = require('../models/Movie');

const router = express.Router();

router.get('/:movieId', async (req, res) => {
   try {
      const movieId = req.params.movieId;
      const reviews = await Review.find({ movie: movieId });

      if (reviews.length === 0) {
         return res.status(404).json({ message: 'No reviews found for this movie' });
      }

      res.status(200).json(reviews);
   } catch (err) {
      res.status(500).json({ error: err.message });
   }
});

router.post('/:movieId', async (req, res) => {
   try {
      const movieId = req.params.movieId;
      const { user, comment } = req.body;

      const movie = await Movie.findById(movieId);
      if (!movie) return res.status(404).json({ message: 'Movie not found' });

      const review = new Review({
         movie: movieId,
         user,
         comment
      });

      const savedReview = await review.save();
      res.status(201).json(savedReview);
   } catch (err) {
      res.status(400).json({ error: err.message });
   }
});



module.exports = router;
