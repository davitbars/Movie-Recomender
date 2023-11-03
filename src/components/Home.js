import React, { useEffect, useState } from 'react';
import { db } from '../firebase'; // Import your Firestore configuration
import './Home.css';
import { collection, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom'; 


const Home = () => {
  const [groupedMovies, setGroupedMovies] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        // Create a reference to your 'movies' collection
        const moviesCollection = collection(db, 'movies');

        // Fetch data from the collection
        const querySnapshot = await getDocs(moviesCollection);

        const groupedMoviesData = {};

        querySnapshot.forEach((doc) => {
          const movie = doc.data();
          movie.genres.forEach((genre) => {
            if (!groupedMoviesData[genre]) {
              groupedMoviesData[genre] = [];
            }
            groupedMoviesData[genre].push(movie);
          });
        });

        setGroupedMovies(groupedMoviesData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching movies:', error);
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="home">
      {Object.entries(groupedMovies).map(([genre, movies]) => (
        <div key={genre}>
          <h2>{genre}</h2>
          <div className="movie-row">
            {movies.map((movie) => (
              <Link to={`/movie/${movie.title}`} key={movie.title}>
                <img
                  className="movie-row-poster"
                src={`https://image.tmdb.org/t/p/w185/${movie.poster_path}`}
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
