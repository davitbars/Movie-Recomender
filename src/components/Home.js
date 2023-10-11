import React from 'react';
import { Link } from 'react-router-dom'; // Import Link
import sampleMovies from './sampleMovies'; // Import your sample movie data
import './Home.css';

const Home = () => {
  // Group movies by genre
  const groupedMovies = sampleMovies.reduce((acc, movie) => {
    movie.genres.forEach((genre) => {
      if (!acc[genre]) {
        acc[genre] = [];
      }
      acc[genre].push(movie);
    });
    return acc;
  }, {});

  return (
    <div className="home">
      {Object.entries(groupedMovies).map(([genre, movies]) => (
        <div key={genre}>
          <h2>{genre}</h2>
          <div className="movie-row">
            {movies.map((movie) => (
              <Link to={`/movie/${movie.id}`} key={movie.id}>
                <img
                  className="movie-row-poster"
                  src={movie.poster}
                  alt={movie.title}
                />
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Home;
