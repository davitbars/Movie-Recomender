import pandas as pd
from scipy import sparse
from sklearn.metrics.pairwise import cosine_similarity

ratings = pd.read_csv(r"C:\Users\davit\OneDrive\Desktop\Movie Recomendations\Learning\Datasets\ratings.csv")
movies = pd.read_csv(r'C:\Users\davit\OneDrive\Desktop\Movie Recomendations\Learning\Datasets\movies.csv')

ratings = pd.merge(movies, ratings, on='movieId').drop(['genres', 'timestamp'], axis=1)
# print(ratings.head())

user_ratings = ratings.pivot_table(index=['userId'], columns=['title'], values='rating')
# print(user_ratings.head())

# Drop the Movies that have less than 10 ratings
user_ratings = user_ratings.dropna(thresh=10, axis=1).fillna(0)
# print(user_ratings.head())

# This time we use the pearson corrlation instead of cosine similarity
item_similarity_df = user_ratings.corr(method='pearson')
#print(item_similarity_df.head(50))

def get_similar_movies(movie_name, user_rating):
    similar_score = item_similarity_df[movie_name] * (user_rating-2.5)
    similar_score = similar_score.sort_values(ascending=False)

    return similar_score

action_lover = [("2 Fast 2 Furious (Fast and the Furious 2, The) (2003)", 5), ("12 Years a Slave (2013)", 4), ("2012 (2009)", 3), ("(500) Days of Summer (2009)", 2)]

similar_movies = pd.DataFrame()

for movie, rating in action_lover:
    similar_movies = similar_movies.append(get_similar_movies(movie, rating), ignore_index=True)

print(similar_movies.head())

print(similar_movies.sum().sort_values(ascending=False))