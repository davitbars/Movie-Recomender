import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase'; // Import your Firestore configuration
import './MovieDetail.css'; // You can create a separate CSS file for this component
import { collection, query, where, getDocs } from 'firebase/firestore';
import Movierecommendations from './Movierecommendations';
import axios from 'axios';

const MovieDetail = () => {
  const { movieTitle } = useParams(); // Access the movieTitle from the URL
  const [movie, setMovie] = useState(null);
  const [rating, setRating] = useState(0);
  const [streamingInfo, setStreamingInfo] = useState(null);

  const getStreamingInfo = async (movieTitle) => {
    try {
      const tmdbApiKey = '806e4d4586d8412825f2a102fa289b33'; // Replace with your TMDb API key
      const tmdbApiUrl = `https://api.themoviedb.org/3/search/movie`;
      const params = {
        api_key: tmdbApiKey,
        query: movieTitle,
      };

      const response = await axios.get(tmdbApiUrl, { params });
      const movieId = response.data.results[0].id;

      const streamingInfoUrl = `https://api.themoviedb.org/3/movie/${movieId}/watch/providers`;
      const streamingInfoResponse = await axios.get(streamingInfoUrl, { params });

      // Adjust the logic here based on the structure of the TMDb API response
      const streamingProviders = streamingInfoResponse.data.results.US;
      setStreamingInfo(streamingProviders);
    } catch (error) {
      console.error('Error fetching streaming information:', error);
    }
  };

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const moviesCollection = collection(db, 'movies');

        const q = query(moviesCollection, where('title', '==', movieTitle));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
          const movieData = doc.data();
          setMovie(movieData);
        });

        await getStreamingInfo(movieTitle);
      } catch (error) {
        console.error('Error fetching movie details:', error);
      }
    };

    fetchMovieDetails();
  }, [movieTitle]);

  if (!movie || !streamingInfo) {
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
        <img
          className='poster'
          src={`https://image.tmdb.org/t/p/w185/${movie.poster_path}`}
          alt={movie.title}
        />
      </div>
      <div>
        <div className="movie-info" style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url(https://image.tmdb.org/t/p/original/${movie.backdrop_path})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center center'
        }}>


          <h2 className="movie-title">{movie.title}</h2>
          <h4 className="movie-tagline">{movie.tagline}</h4>
          <div className="info-row">
            <div className="rating-input">{stars}</div>
            <p className="runtime movie-text">{movie.runtime} min</p>
            <p className="rating movie-text">{(movie.vote_average / 8.5 * 5).toFixed(1)}<span>★</span></p>
            <p className="release-date movie-text">{movie.release_date}</p>
          </div>
          <h3>Available on:</h3>
          <div className='streaming-services'>
            <div className='logo-list'>
              {streamingInfo.buy.map((provider) => (
                <a
                  key={provider.provider_id}
                  href={provider.link}  // You might need to adjust this based on the actual structure of your streamingInfo
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  <img
                    src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                    alt={provider.provider_name}
                    className='logo-image'
                  />
                </a>
              ))}
            </div>
          </div>
          <p className="plot movie-text">{movie.overview}</p>
          <div className="metadata">
            <p className="genre movie-text">
              {movie.genres.length === 1 ? (
                <span>Genre:</span>
              ) : (
                <span>Genres:</span>
              )}{' '}
              {movie.genres.length === 1 ? movie.genres : movie.genres.join(', ')}
            </p>
            <p className="cast movie-text">
              <span>Cast:</span> {movie.cast.slice(0, 3).join(', ')}
            </p>
            <p className="crew movie-text">
              <span>Crew:</span> {movie.crew.slice(0, 3).join(', ')}
            </p>
          </div>

        </div>
        <Movierecommendations movieTitle={movie.title} />
      </div>
    </div>
  );
};

export default MovieDetail;
