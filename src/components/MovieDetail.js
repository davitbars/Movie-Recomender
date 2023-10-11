import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import sampleMovies from './sampleMovies'; // Import your movie data

const MovieDetail = () => {
  const { movieId } = useParams(); // Access the movieId from the URL
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    // Debugging: Output the `movieId` to the console
    console.log('Movie ID:', movieId);

    // Find the movie with a matching ID from sampleMovies
    const selectedMovie = sampleMovies.find((m) => m.id.toString() === movieId);
    
    if (selectedMovie) {
      setMovie(selectedMovie);
    }
  }, [movieId]);

  if (!movie) {
    return <div>Loading...</div>;
  }
  
  return (
    <div className="movie-detail">
      <div className="poster-container">
        <img src={movie.poster} alt={movie.title} />
      </div>
      <div className="movie-info">
        <h2>{movie.title}</h2>
        <div className="info-row">
          <p>Runtime: {movie.runtime} minutes</p>
          <p>Rating: {movie.rating}</p>
        </div>
        <p>{movie.plot}</p>
        <div className="rating-input">
          <label>Rate this movie (1-10):</label>
          <input type="number" min="1" max="10" step="1" />
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
