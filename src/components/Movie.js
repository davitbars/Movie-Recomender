import React from 'react';

function MovieList() {
  // Sample movie data (you can replace this with real data)
  const movies = [
    {
      id: 1,
      title: 'Movie 1',
      description: 'This is the description of Movie 1.',
      rating: 4.5,
    },
    {
      id: 2,
      title: 'Movie 2',
      description: 'This is the description of Movie 2.',
      rating: 3.8,
    },
    // Add more movie objects as needed
  ];

  return (
    <div className="movie-list">
      <h2>Movie List</h2>
      <ul className="movie-items">
        {movies.map((movie) => (
          <li key={movie.id} className="movie-item">
            <h3 className="movie-title">{movie.title}</h3>
            <p className="movie-description">{movie.description}</p>
            <p className="movie-rating">Rating: {movie.rating}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MovieList;
