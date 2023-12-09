import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
###### helper functions. Use them when needed #######
def get_title_from_index(index):
	return df[df.index == index]["title"].values[0]

def get_index_from_title(title):
	return df[df.title == title]["index"].values[0]
##################################################

movie_user_likes = "Interstellar"

##Step 1: Read CSV File
df = pd.read_csv(r'C:\Users\davit\OneDrive\Desktop\Movie Recomendations\Learning\Datasets\movie_dataset.csv')
# print(df.head())
# print(df.columns)

##Step 2: Select Features
features = ['keywords', 'cast', 'genres', 'director']

##Step 3: Create a column in DF which combines all selected features
for feature in features:
	df[feature] = df[feature].fillna('')

def combine_features(row):
    return row['keywords']+" "+row['cast']+" "+row['genres']+" "+row['director']

df['combined_features'] = df.apply(combine_features, axis=1)
# print("Combined Features: ", df['combined_features'].head())

##Step 4: Create count matrix from this new combined column
cv = CountVectorizer()
count_matrix = cv.fit_transform(df['combined_features'])

##Step 5: Compute the Cosine Similarity based on the count_matrix
similarity_scores = cosine_similarity(count_matrix)

## Step 6: Get index of this movie from its title
movie_index = get_index_from_title(movie_user_likes)

similar_movies = list(enumerate(similarity_scores[movie_index]))

# Step 6.5 
"""
Weighted Ratings
Formula: (v/(v+m)  *  R) + (m/(v+m)  * C)
v: the number of votes for the film
m: the minimum number of votes needed to enter the chart
R: average rating of the film
C: the average number of votes from all film universes
"""

global_average_rating = df['vote_average'].mean()

def get_rate_weight(row):
	minRates = 500
	part1 = (row['vote_count']/(row['vote_count'] + minRates)) * row['vote_average']
	part2 = (minRates/(minRates+row['vote_count'])) * global_average_rating
	return part1 + part2

df['weighted_rating'] = df.apply(get_rate_weight, axis=1)

# Calculate weighted similarity scores combinging content based similarity and weighted ratings
weighted_similarity_scores = []
for movie in similar_movies:
    movie_idx = movie[0]
    content_similarity = movie[1]
    weighted_rating = df.loc[movie_idx]['weighted_rating']
    
    # Combine content similarity and weighted rating using a simple average or another method
    combined_score = (content_similarity + content_similarity + weighted_rating) / 2
    
    weighted_similarity_scores.append((movie_idx, combined_score))

## Step 7: Get a list of similar movies in descending order of similarity score
sorted_weighted_similar_movies = sorted(weighted_similarity_scores, key=lambda x:x[1], reverse = True)

## Step 8: Print titles of first 50 movies
i=0
for movie in sorted_weighted_similar_movies:
	print(get_title_from_index(movie[0]) + " Rating: " +  str(movie[1]))
	i=i+1
	if i>50:
		break