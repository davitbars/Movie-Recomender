import pandas as pd
import re
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from flask import Flask, request, jsonify
from flask_cors import CORS
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel

app = Flask(__name__)
# CORS(app, resources={r"/api/recommendations/*": {"origins": "*"}})
CORS(app, resources={r"/*": {"origins": "*"}})


# Load your movie data from the CSV file
df = pd.read_csv('final_movie_data.csv')
ratings_df = pd.read_csv('ratings_small.csv')


# Define a function to clean and preprocess text data
def clean_text(text):
    # Remove square brackets and double quotes
    text = re.sub(r'[\[\]"\'()]', '', text)
    # Remove extra whitespaces
    text = ' '.join(text.split())
    return text

# Apply the clean_text function to relevant columns
df['genres'] = df['genres'].apply(clean_text)
df['cast'] = df['cast'].apply(clean_text)
df['crew'] = df['crew'].apply(clean_text)
df['overview'] = df['overview'].apply(clean_text)
df['keywords'] = df['keywords'].apply(clean_text)

# Combine the cleaned columns with weights to create 'combined_features'
df['combined_features'] = (
    df['genres'] * 5 +   # Genres are heavily weighted
    df['cast'] +         # Cast
    df['crew'] +         # Crew
    df['overview'] +     # Overview
    df['keywords']       # Keywords
)

cv = CountVectorizer()
count_matrix = cv.fit_transform(df['combined_features'])

# Compute similarity scores
similarity_scores = cosine_similarity(count_matrix)

def get_title_from_index(index):
    try:
        title = df.loc[index, 'title']
        return title
    except KeyError:
        return None

def get_index_from_title(title):
    try:
        index = df[df['title'] == title].index[0]
        return index
    except IndexError:
        return None

def get_poster_path(movie_index):
    if movie_index < len(df):
        poster_path = df.loc[movie_index, 'poster_path']
        return poster_path
    else:
        return None
    
ratings_movies_df = pd.merge(df, ratings_df, left_on='id', right_on='movieId', how='inner')

# Transform dataset to matrix. The rows of the matrix are users, and the columns of the matrix are movies. The value of the matrix is the user rating of the movie if there is a rating
matrix = ratings_movies_df.pivot_table(index='userId', columns='title', values='rating')

# Normalize user-item matrix because some users tend to give higher general ratings. 
# If rating for indidivudal movie is less than average rating it gets negative score
matrix_norm = matrix.subtract(matrix.mean(axis=1), axis = 0)

# Apply a pearson correlation to the normalized matrix to return similarity scores
user_similarity = matrix_norm.T.corr()

@app.route('/api/recommendations/<string:movie_title>')
def get_movie_recommendations(movie_title):
    movie_index = get_index_from_title(movie_title)
    if movie_index is not None:
        similar_movies = []
        for i, score in enumerate(similarity_scores[movie_index]):
            similar_movies.append({
                'title': get_title_from_index(i),
                'similarity_score': score,
                'poster_path': get_poster_path(i)
            })
        sorted_similar_movies = sorted(similar_movies, key=lambda x: x['similarity_score'], reverse=True)

        result = {'similar_movies': sorted_similar_movies[1:10]}

        # Return the JSON data as a response
        print(result)
        return jsonify(result)

    else:
        return jsonify({'error': 'Movie not found'}, 404)


@app.route('/api/recommendations/preferences', methods=['POST'])
def get_user_preferences_recommendations():
    filtered_movies = df

    # Combine the cleaned columns with weights to create 'combined_features'
    filtered_movies['combined_features2'] = (
        filtered_movies['genres'] * 3 +  # Genres are heavily weighted
        filtered_movies['overview'] +  # Overview
        filtered_movies['keywords'] * 2 # Keywords
    )

    user_preferences = request.get_json()
    print("Received user preferences:", user_preferences)

    # Extract user preferences from the JSON data
    genres = user_preferences.get('genres', [])
    tagline = user_preferences.get('tagline', '')
    keywords = user_preferences.get('keywords', [])

    # Calculate cosine similarity based on genres, overview, and keywords
    tfidf_vectorizer = TfidfVectorizer(stop_words='english')
    tfidf_matrix = tfidf_vectorizer.fit_transform(filtered_movies['combined_features2'])
    user_combined_features = ' '.join(genres + keywords)
    user_tfidf_vector = tfidf_vectorizer.transform([user_combined_features])
    genre_similarity_scores = linear_kernel(user_tfidf_vector, tfidf_matrix).flatten()

    # Calculate cosine similarity based on taglines
    tagline_tfidf_vectorizer = TfidfVectorizer(stop_words='english')
    tagline_tfidf_matrix = tagline_tfidf_vectorizer.fit_transform(filtered_movies['tagline'].fillna(''))
    tagline_tfidf_user_vector = tagline_tfidf_vectorizer.transform([tagline])
    tagline_similarity_scores = linear_kernel(tagline_tfidf_user_vector, tagline_tfidf_matrix).flatten()

    # Combine similarity scores from both approaches
    combined_similarity_scores = genre_similarity_scores*3 + tagline_similarity_scores

    # Add the combined similarity scores to the DataFrame
    filtered_movies['similarity_score'] = combined_similarity_scores
    filtered_movies = filtered_movies.sort_values(by='similarity_score', ascending=False)

    # Classify movies based on feelings
    classified_movies = pd.DataFrame()

    # Combine and deduplicate recommendations
    recommended_movies = pd.concat([filtered_movies, classified_movies])
    recommended_movies = recommended_movies.drop_duplicates(subset='title', keep='first')

    recommended_movies = recommended_movies[:20]  # Limit the number of recommendations

    # Prepare the results
    result = {
        'similar_movies': recommended_movies[['title', 'poster_path']].to_dict(orient='records')
    }

    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)