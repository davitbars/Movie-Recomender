import pandas as pd
from scipy import sparse
from sklearn.metrics.pairwise import cosine_similarity

ratings = pd.read_csv(r"C:\Users\davit\OneDrive\Desktop\Movie Recomendations\Learning\Datasets\toy_dataset.csv", index_col=0)
ratings = ratings.fillna(0)

def standardize(row):
    new_row = (row - row.mean()) / (row.max() - row.min())
    return new_row

ratings_std = ratings.apply(standardize)

#Since this is going to be item to item collaborative we need to transpose the matrix because cosine_similarity is applied on the row
#By Transposing it the row becomes all of the ratings for a single movie, and we find the similarity between each rating
item_similarity = cosine_similarity(ratings_std.T)

item_similarity_df = pd.DataFrame(item_similarity, index = ratings.columns, columns = ratings.columns)

def get_similar_movies(movie_name, user_rating):
    similar_score = item_similarity_df[movie_name] * (user_rating-2.5)
    similar_score = similar_score.sort_values(ascending=False)

    return similar_score

#print(get_similar_movies("action1", 5))

action_love = [("action1", 5), ("romantic2", 1), ("romantic3", 1)]

similar_movies = pd.DataFrame()

for movie, rating in action_love:
    similar_movies = similar_movies.append(get_similar_movies(movie, rating), ignore_index=True)

print(similar_movies.head())

print(similar_movies.sum().sort_values(ascending=False))