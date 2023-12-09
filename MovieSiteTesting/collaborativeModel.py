# %%
import pandas as pd
import numpy as np
import seaborn as sns
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error
from sklearn.metrics import mean_absolute_error
from sklearn.metrics import f1_score

import math

# %%
ratings_dtypes = {
    'userId': 'int32',
    'movieId':'int32',
    'rating':'float',
}

movies_dtypes = {
        'genres':'object',
        'id':'int32',
        'title':'string',
}

all_ratings_df = pd.read_csv(r"C:\Users\davit\OneDrive\Desktop\Movie Recomendations\MovieSiteTesting\ratings.csv", 
                         dtype=ratings_dtypes, 
                         low_memory=False,
                         usecols = [
                             'userId','movieId', 'rating'
                         ])

movies_df = pd.read_csv(
    r'C:\Users\davit\OneDrive\Desktop\Movie Recomendations\MovieSiteTesting\cleanMetadata.csv', 
    dtype=movies_dtypes, 
    low_memory=False,
    usecols=['id','title'])

# %%             
df = pd.merge(all_ratings_df, movies_df, left_on='movieId', right_on='id', how='inner')

# Step 1: Filter out users with less than 50 ratings
user_ratings_count = df.groupby('userId')['rating'].count()
valid_users = user_ratings_count[user_ratings_count >= 100].index
df_filtered_users = df[df['userId'].isin(valid_users)]

# Step 2: Filter out movies with less than 500 total ratings
movie_ratings_count = df_filtered_users.groupby('movieId')['rating'].count()
valid_movies = movie_ratings_count[movie_ratings_count >= 500].index
df_filtered_movies = df_filtered_users[df_filtered_users['movieId'].isin(valid_movies)]
df_filtered_movies.info()

# %%
# transform the dataset into a matrix format. The rows of the matrix are users, and the columns of the matrix are movies. The value of the matrix is the user rating of the movie if there is a rating
matrix = df_filtered_movies.pivot_table(index='userId', columns='title', values='rating')
matrix.head()


# %%
# Normalize user-item matrix because some users tend to give higher general ratings. 
# If rating for indidivudal movie is less than average rating it gets negative score
matrix_norm = matrix.subtract(matrix.mean(axis=1), axis = 0)
matrix_norm

############################
# 3840 users by 317 movies #
############################

# %%
# Apply a pearson correlation to the normalized matrix to return similarity scores
user_similarity = matrix_norm.T.corr()
user_similarity

# %%
# Find similar users

# Pick a user ID
picked_userid = 150

# Remove picked user ID from the candidate list
user_similarity.drop(index=picked_userid, inplace=True)
user_similarity

# %%
# Number of similar users
n = 20

# User similarity threashold
user_similarity_threshold = 0.5

# Get top n similar users
similar_users = user_similarity[user_similarity[picked_userid]>user_similarity_threshold][picked_userid].sort_values(ascending=False)[:n]

# Print out top n similar users
print(f'The similar users for user {picked_userid} are', similar_users)

# %%

# Movies that the target user has watched
picked_userid_watched = matrix_norm[matrix_norm.index == picked_userid].dropna(axis=1, how='all')
picked_userid_watched

# %%

# Movies that similar users watched. Remove movies that none of the similar users have watched
similar_user_movies = matrix_norm[matrix_norm.index.isin(similar_users.index)].dropna(axis=1, how='all')
similar_user_movies

# %%

# Remove the watched movie from the movie list
similar_user_movies.drop(picked_userid_watched.columns,axis=1, inplace=True, errors='ignore')

# Take a look at the data
similar_user_movies

# %%
# A dictionary to store item scores
item_score = {}

# Loop through items
for i in similar_user_movies.columns:
  # Get the ratings for movie i
  movie_rating = similar_user_movies[i]
  # Create a variable to store the score
  total = 0
  # Create a variable to store the number of scores
  count = 0
  # Loop through similar users
  for u in similar_users.index:
    # If the movie has rating
    if pd.isna(movie_rating[u]) == False:
      # Score is the sum of user similarity score multiply by the movie rating
      score = similar_users[u] * movie_rating[u]
      # Add the score to the total score for the movie so far
      total += score
      # Add 1 to the count
      count += 1
  # Get the average score for the item
  item_score[i] = total / count

# Convert dictionary to pandas dataframe
item_score = pd.DataFrame(item_score.items(), columns=['movie', 'movie_score'])
    
# Sort the movies by score
ranked_item_score = item_score.sort_values(by='movie_score', ascending=False)

# Select top m movies
m = 25
ranked_item_score.head(m)
# %%
# predict the user's actual unnormalized rating

# Average rating for the picked user
avg_rating = matrix[matrix.index == picked_userid].T.mean()[picked_userid]

# Print the average movie rating for user 1
print(f'The average movie rating for user {picked_userid} is {avg_rating:.2f}')

# Calcuate the predicted rating
ranked_item_score['predicted_rating'] = round(ranked_item_score['movie_score'] + avg_rating, ndigits=2)

# Take a look at the data
ranked_item_score.head(m)


# %%
# Create Train test split
train_data, test_data = train_test_split(df_filtered_movies, test_size=0.2, random_state=42)

predicted_ratings = []

for _, row in test_data.iterrows():
    user_id = row['userId']
    movie_title = row['title']
    global_rating = row['rating']
    
    if user_id in matrix_norm.index and movie_title in ranked_item_score['movie'].values:
        predicted_rating = ranked_item_score[ranked_item_score['movie'] == movie_title]['predicted_rating'].values[0]
        predicted_ratings.append(predicted_rating)
    else:
        # If the user or movie is not in the training data, use the global rating for the movie
        predicted_ratings.append(global_rating)

# Calculate the mean squared error (MSE)
actual_ratings = test_data['rating']
# Mean Squared Error
mse = mean_squared_error(actual_ratings, predicted_ratings)
print(f'Mean Squared Error (MSE): {mse:.2f}')

# Root meant squared error
rmse = np.sqrt(mean_squared_error(actual_ratings, predicted_ratings))
print(f"Root mean squared error(RMSE): {rmse:.2f}")

#Mean Absolute Error
mae = mean_absolute_error(actual_ratings, predicted_ratings)
print(f'Mean absolute Error (MAE): {mae:.2f}')

# Mean absolute percentage error
mape = np.mean(np.abs((actual_ratings - predicted_ratings) / actual_ratings)) * 100
print(f'Mean absolute percentage error (MAPE): {mape:.2f}')

# %%
