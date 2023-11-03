import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import "./MovieDetail.css";

const MovieRecommendations = ({ movieTitle }) => {
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/api/recommendations/${movieTitle}`);

        if (response.ok) {
          const data = await response.json();
          console.log('Response data:', data); // Log response data
          setRecommendations(data.similar_movies);
        } else {
          console.error('Error fetching recommendations:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      }
    };
  
    fetchRecommendations();
  }, [movieTitle]);
  

  return (
    <div className='recommendations'>
      <h3>Similar Movies</h3>
      <div className="movie-row-similar">
        {recommendations.map((movie) => (
          <Link to={`/movie/${movie.title}`} key={movie.title}>
            <img
              className="movie-row-poster-similar"
              src={`https://image.tmdb.org/t/p/w185/${movie.poster_path}`}
              alt={movie.title}
            />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MovieRecommendations;
