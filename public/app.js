const API_URL = '/movies';
let editingMovieId = null;

async function loadMovies() {
   const response = await fetch(API_URL);
   const movies = await response.json();
   const moviesList = document.getElementById('movies-list');

   moviesList.innerHTML = '';

   if (movies.length === 0) {
      moviesList.innerHTML = '<p>No movies found. Add a new movie to get started!</p>';
      return;
   }

   movies.forEach(movie => {
      const movieCard = document.createElement('div');
      movieCard.className = 'movie-card';
      movieCard.innerHTML = `
         <h3>${movie.title}</h3>
         <p>Director: ${movie.director}</p>
         <p>Year: ${movie.year}</p>
         <p>Genre: ${movie.genre}</p>
         <p>Rating: ${movie.rating}</p>
         <button onclick="deleteMovie('${movie._id}')">Delete</button>
         <button onclick="startEditingMovie('${movie._id}')">Edit</button>
         <button onclick="loadReviews('${movie._id}')">Show Reviews</button>
         <button onclick="addReview('${movie._id}')">Add Review</button>
         <div id="reviews-list"></div>
      `;
      moviesList.appendChild(movieCard);
   });
   
}

async function deleteMovie(id) {
   await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
   loadMovies();
}

async function startEditingMovie(id) {
   editingMovieId = id;

   try {
      const response = await fetch(`${API_URL}/${id}`);
      const movie = await response.json();
      document.getElementById('title').value = movie.title;
      document.getElementById('director').value = movie.director;
      document.getElementById('year').value = movie.year;
      document.getElementById('genre').value = movie.genre;
      document.getElementById('rating').value = movie.rating;
      document.querySelector('#movie-form button').textContent = 'Update Movie';
   } catch (error) {
      console.error('Error fetching movie:', error);
   }
}

document.getElementById('movie-form').addEventListener('submit', async (e) => {
   e.preventDefault();

   const title = document.getElementById('title').value;
   const director = document.getElementById('director').value;
   const year = parseInt(document.getElementById('year').value);
   const genre = document.getElementById('genre').value;
   const rating = parseFloat(document.getElementById('rating').value);

   if (editingMovieId) {
      await fetch(`${API_URL}/${editingMovieId}`, {
         method: 'PUT',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ title, director, year, genre, rating }),
      });

      editingMovieId = null;
      document.querySelector('#movie-form button').textContent = 'Add Movie';
   } else {
      await fetch(API_URL, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ title, director, year, genre, rating }),
      });
   }

   document.getElementById('movie-form').reset();
   loadMovies();
});

document.getElementById('delete-all').addEventListener('click', async () => {
   if (confirm('Are you sure you want to delete all movies?')) {
      await fetch(API_URL, { method: 'DELETE' });
      loadMovies(); 
   }
});

loadMovies();


async function loadTopMoviesByDirector() {
   const response = await fetch(API_URL + '/top3bydirector');
   const topMovies = await response.json();
   const moviesList = document.getElementById('movies-list');

   moviesList.innerHTML = ''; // Очистить список фильмов

   if (topMovies.length === 0) {
      moviesList.innerHTML = '<p>No top movies found.</p>';
      return;
   }

   topMovies.forEach(directorData => {
      const directorCard = document.createElement('div');
      directorCard.className = 'director-card';
      directorCard.innerHTML = `
         <h3>Director: ${directorData.director}</h3>
         <ul>
            ${directorData.topMovies.map(movie => `
               <li>
                  <strong>${movie.title}</strong><br>
                  Year: ${movie.year}, Rating: ${movie.rating}
               </li>
            `).join('')}
         </ul>
      `;
      moviesList.appendChild(directorCard);
   });
}

async function loadMoviesAfterYear(year) {
   const response = await fetch(API_URL + '/year/after/' + year);
   const movies = await response.json();
   const moviesList = document.getElementById('movies-list');
   moviesList.innerHTML = ''; // Очистить список фильмов

   if (movies.length === 0) {
      moviesList.innerHTML = `<p>No movies found after ${year}.</p>`;
      return;
   }

   movies.forEach(movie => {
      const movieCard = document.createElement('div');
      movieCard.className = 'movie-card';
      movieCard.innerHTML = `
         <h3>${movie.title}</h3>
         <p>Director: ${movie.director}</p>
         <p>Year: ${movie.year}</p>
         <p>Genre: ${movie.genre}</p>
         <p>Rating: ${movie.rating}</p>
         <button onclick="deleteMovie('${movie._id}')">Delete</button>
         <button onclick="startEditingMovie('${movie._id}')">Edit</button>
         <button onclick="loadReviews('${movie._id}')">Show Reviews</button>
         <button onclick="addReview('${movie._id}')">Add Review</button>
         <div id="reviews-list"></div>
      `;
      moviesList.appendChild(movieCard);
   });
}


async function addReview(movieId) {
   const user = prompt('Enter your name:');
   const comment = prompt('Enter your comment:');

   if (!user || !comment) return;

   const response = await fetch(`/reviews/${movieId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user, comment })
   });

   if (response.ok) {
      alert('Review added!');
      loadReviews(movieId); // Перезавантажуємо відгуки
   } else {
      alert('Error adding review');
   }
}


async function loadReviews(movieId) {
   const response = await fetch(`/reviews/${movieId}`);
   const reviews = await response.json();
   const reviewsList = document.getElementById('reviews-list');

   reviewsList.innerHTML = ''; // Очищаємо список відгуків

   if (reviews.length === 0) {
      reviewsList.innerHTML = '<p>No reviews yet.</p>';
      return;
   }

   reviews.forEach(review => {
      const reviewCard = document.createElement('div');
      reviewCard.className = 'review-card';
      reviewCard.innerHTML = `
         <h4>${review.user}</h4>
         <p>${review.comment}</p>
      `;
      reviewsList.appendChild(reviewCard);
   });
}