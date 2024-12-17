const express = require('express');
const Movie = require('../models/Movie');

const router = express.Router();

// Додання нового фільму
router.post('/', async (req, res) => {
   try {
      const movie = new Movie(req.body);
      const savedMovie = await movie.save();
      res.status(201).json(savedMovie);
   } catch (err) {
      res.status(400).json({ error: err.message });
   }
});

// Виведення всіх фільмів
router.get('/', async (req, res) => {
   try {
      const movies = await Movie.find();
      res.status(200).json(movies);
   } catch (err) {
      res.status(500).json({ error: err.message });
   }
});

// Вивести топ-3 фільми кожного режисера за рейтингом
router.get('/top3bydirector', async (req, res) => {
   try {
      const topMovies = await Movie.aggregate([
         {
            $sort: { director: 1, rating: -1 } // Спочатку сортуємо за режисером, потім за рейтингом у спадному порядку
         },
         {
            $group: {
               _id: '$director',
               topMovies: { $push: '$$ROOT' } // Групуємо фільми по режисеру
            }
         },
         {
            $project: {
               director: '$_id',
               topMovies: { $slice: ['$topMovies', 3] } // Обмежуємо до топ-3 фільмів
            }
         }
      ]);
      res.status(200).json(topMovies);
   } catch (err) {
      res.status(500).json({ error: err.message });
   }
});


// Пошук фільму за id
router.get('/:id', async (req, res) => {
   try {
      const movie = await Movie.findById(req.params.id);
      if (!movie) 
        return res.status(404).json({ message: 'Movie not found' });
      res.status(200).json(movie);
   } catch (err) {
      res.status(500).json({ error: err.message });
   }
});

// Оновлення інформації про фільм
router.put('/:id', async (req, res) => {
   try {
      const updatedMovie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updatedMovie) return res.status(404).json({ message: 'Movie not found' });
      res.status(200).json(updatedMovie);
   } catch (err) {
      res.status(400).json({ error: err.message });
   }
});

// Видалення фільму
router.delete('/:id', async (req, res) => {
   try {
      const deletedMovie = await Movie.findByIdAndDelete(req.params.id);
      if (!deletedMovie) return res.status(404).json({ message: 'Movie not found' });
      res.status(200).json({ message: 'Movie deleted' });
   } catch (err) {
      res.status(500).json({ error: err.message });
   }
});

// Видалення всіх фільмів
router.delete('/', async (req, res) => {
    try {
        await Movie.deleteMany();
        res.status(200).json({ message: 'All movies deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete movies' });
    }
});

// отримання фільмів після заданого року
router.get('/year/after/:year', async (req, res) => {
  
   const minYear = parseInt(req.params.year);
   try {
      const movies = await Movie.find({ year: { $gt: minYear } });
      res.status(200).json(movies);
   } catch (err) {
      res.status(500).json({ error: err.message });
   }
});



module.exports = router;
