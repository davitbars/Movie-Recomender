const admin = require('firebase-admin');
const axios = require('axios'); // Library for making HTTP requests
const fs = require('fs');
const csv = require('csv-parser');
const { Storage } = require('@google-cloud/storage'); // Google Cloud Storage library
const serviceAccount = require('./moviesite-55fb2-firebase-adminsdk-wzl14-c8f1e4aec0.json');

// Initialize Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'moviesite-55fb2.appspot.com',
});

const firestore = admin.firestore();
const storage = new Storage();

// Function to fetch movie data by IMDb ID
async function fetchMovieByImdbId(imdbId) {
    try {
        // Make a request to the OMDB API by IMDb ID
        const omdbApiKey = '65a51464';
        const omdbUrl = `http://www.omdbapi.com/?apikey=${omdbApiKey}&i=${imdbId}`;
        const response = await axios.get(omdbUrl);

        if (response.data.Response === 'True') {
            // Movie data fetched successfully
            return response.data;
        } else {
            // Movie not found or other error
            console.error(`Error fetching movie data for IMDb ID ${imdbId}: ${response.data.Error}`);
            return null;
        }
    } catch (error) {
        console.error(`Error fetching movie data for IMDb ID ${imdbId}: ${error.message}`);
        return null;
    }
}

// Function to download and upload movie poster to Firebase Storage
async function uploadPosterToStorage(imdbId, posterUrl) {
    try {
        // Fetch movie data by IMDb ID
        const movieData = await fetchMovieByImdbId(imdbId);
        if (movieData && movieData.Poster) {
            // Download the poster image from the provided URL
            const posterResponse = await axios.get(movieData.Poster, { responseType: 'stream' });
            const posterStream = posterResponse.data;
            const fileName = `${imdbId}.jpg`; // Assuming posters are JPEGs

            // Upload the poster image to Firebase Storage
            const file = storage.bucket().file(fileName);
            await posterStream.pipe(file.createWriteStream());

            console.log(`Poster for IMDb ID ${imdbId} uploaded to Firebase Storage.`);
        }
    } catch (error) {
        console.error(`Error uploading poster for IMDb ID ${imdbId}: ${error.message}`);
    }
}

// Read and parse the CSV file
const csvFilePath = './src/cleanMetadata.csv';

fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on('data', async (row) => {
        // Upload movie poster to Firebase Storage
        const imdbId = row.imdb_id;
        const posterUrl = row.poster_path;
        uploadPosterToStorage(imdbId, posterUrl);
    })
    .on('end', () => {
        console.log('Data import completed.');
    });
