import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import sampleMovies from './sampleMovies'; // Import your movie data
import './MovieDetail.css'; // You can create a separate CSS file for this component

const MovieDetail = () => {
  const { movieId } = useParams(); // Access the movieId from the URL
  const [movie, setMovie] = useState(null);
  const [rating, setRating] = useState(0);

  useEffect(() => {
    // Find the movie with a matching ID from sampleMovies
    const selectedMovie = sampleMovies.find((m) => m.id.toString() === movieId);

    if (selectedMovie) {
      setMovie(selectedMovie);
    }
  }, [movieId]);

  if (!movie) {
    return <div>Loading...</div>;
  }

  const handleStarClick = (selectedRating) => {
    setRating(selectedRating);
  };  

  const stars = Array.from({ length: 5 }, (_, index) => (
    <span
      key={index}
      className={`star ${rating >= index + 1 ? 'selected' : ''}`}
      onClick={() => handleStarClick(index + 1)}
    >
      ★
    </span>
  ));
  
  return (
    <div className="movie-detail">
      <div className="poster-container">
        <img src={movie.poster} alt={movie.title} />
      </div>
      <div className="movie-info">
        <h2 className='movie-title'>{movie.title}</h2>
        <div className="info-row">
          <p className='runtime movie-text'>Runtime: {movie.runtime} minutes</p>
          <p className='rating movie-text'>Rating: {movie.rating}</p>
        </div>
        <p className='plot movie-text'>{movie.plot}</p>
        <div className="rating-input">
          <label className='rating movie-text'>Rate this movie:</label>
          {stars}
        </div>
        <div className='metadata'>
        <p className='genre movie-text'>
          {movie.genres.length === 1 ? 'Genre' : 'Genres'}: {movie.genres.join(', ')}
        </p>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
