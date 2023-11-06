import React, { Component } from 'react';
import "./MoviePicker.css";

class MoviePicker extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentQuestion: 0, // Index of the current question
            answers: [], // Store user's answers
            movieRecommendations: [], // Store movie recommendations based on user preferences
            selectedMovies: [], // Store user-selected movies
            questions: [
                {
                    text: 'Which genres are you currently looking for?',
                    choices: ['No Preference', 'Action', 'Drama', 'Sci-Fi', 'Romance', 'Comedy', 'Fantasy', 'Thriller'],
                    selectedChoices: [],
                },
                {
                    text: 'Choose a tagline that resonates with you:',
                    choices: [
                        'Roll the dice and unleash the excitement!',
                        'A Los Angeles Crime Saga',
                        'Part Dog. Part Wolf. All Hero.',
                        'Get on, or GET OUT THE WAY!',
                        'The mob is tough, but itâ€™s nothing like show business.',
                        'The true story of the death of innocence and the birth of an artist.',
                        'Beyond the horizon lies the secret to a new beginning.',
                        'Is anyone really who they seem to be?'
                    ],
                    selectedChoice: 'No Preference',
                },  
                {
                    text: 'Which keywords stand out to you?',
                    choices: ["Love", "Friendship", "Betrayal", "Family", "Adventure", "Mystery", "Power", "Survival", "Bank",
                        "Revenge", "Discovery", "Journey", "Secret", "Conflict", "Intrigue", "Redemption", "Escape", "Rivalry", "Passion",
                        "Hope", "Dream", "Heist", "Conspiracy", "Hero", "Villain", "Marriage", "Robot", "Magic", "Quest", "Jealousy"],
                    selectedChoices: [],
                },              
            ],
        };
    }

    componentDidMount() {
        // Fetch movie recommendations only when the user has answered all questions
        if (this.state.answers.length === this.state.questions.length) {
            this.fetchMovieRecommendations();
        }
    }
    
    fetchMovieRecommendations = (answers) => {
        console.log("Fetching movie recommendations...");
    
        console.log("Sending user preferences:", answers);
    
        fetch('http://localhost:5000/api/recommendations/preferences', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(answers),
        })
        .then(response => response.json())
        .then(data => {
            this.setState({ movieRecommendations: data.similar_movies });
        })
        .catch(error => console.error('Error fetching recommendations:', error));
    };
    
    handleKeywordSelection = (selectedKeyword) => {
        const { questions, currentQuestion } = this.state;
        const updatedQuestions = [...questions];
    
        if (!updatedQuestions[currentQuestion].selectedChoices) {
            updatedQuestions[currentQuestion].selectedChoices = [];
        }
    
        const selectedChoices = updatedQuestions[currentQuestion].selectedChoices;
    
        if (selectedChoices.includes(selectedKeyword)) {
            selectedChoices.splice(selectedChoices.indexOf(selectedKeyword), 1);
        } else {
            selectedChoices.push(selectedKeyword);
        }
    
        this.setState({ questions: updatedQuestions });
    };
    

    handleGenreSelection = (selectedGenre) => {
        const { questions, currentQuestion } = this.state;
        const updatedQuestions = [...questions];
        const index = updatedQuestions[currentQuestion].selectedChoices.indexOf(selectedGenre);

        if (index !== -1) {
            updatedQuestions[currentQuestion].selectedChoices.splice(index, 1);
        } else {
            updatedQuestions[currentQuestion].selectedChoices.push(selectedGenre);
        }

        this.setState({ questions: updatedQuestions });
    };

    handleChoiceSelection = (selectedChoice) => {
        const { questions, currentQuestion } = this.state;
        const updatedQuestions = [...questions];
        updatedQuestions[currentQuestion].selectedChoice = selectedChoice;

        this.setState({ questions: updatedQuestions });
    };

    handleNext = () => {
        const { currentQuestion, answers } = this.state;
    
        // Create a copy of the existing user preferences object
        const userPreferences = { ...answers };
    
        if (currentQuestion === 0) {
            userPreferences.genres = this.state.questions[currentQuestion].selectedChoices;
        } else if (currentQuestion === 1) {
            userPreferences.tagline = this.state.questions[currentQuestion].selectedChoice;
        }else {
            userPreferences.keywords = this.state.questions[currentQuestion].selectedChoices;
        }
    
        // Update the state with the modified user preferences object
        this.setState({ answers: userPreferences, currentQuestion: currentQuestion + 1 });
    
        if (currentQuestion === this.state.questions.length - 1) {
            // All questions have been answered, so fetch recommendations
            this.fetchMovieRecommendations(userPreferences);
        }
    };

    handleBack = () => {
        const { currentQuestion } = this.state;
        if (currentQuestion > 0) {
            this.setState({ currentQuestion: currentQuestion - 1 });
        }
    };

    handleMovieSelection = (event) => {
        const { selectedMovies } = this.state;
        const movieTitle = event.target.value;
        const isChecked = event.target.checked;

        if (isChecked) {
            this.setState({ selectedMovies: [...selectedMovies, movieTitle] });
        } else {
            const updatedSelectedMovies = selectedMovies.filter(title => title !== movieTitle);
            this.setState({ selectedMovies: updatedSelectedMovies });
        }
    };

    handleRecommendationsSubmit = () => {
        // Fetch recommendations for selected movies
        const selectedMoviesData = { selectedMovies: this.state.selectedMovies };

        fetch('http://localhost:5000/api/recommendations/selected', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(selectedMoviesData),
        })
        .then(response => response.json())
        .then(data => {
            // Process the recommendations for selected movies here
        })
        .catch(error => console.error('Error fetching recommendations for selected movies:', error));
    };


    render() {
        const { currentQuestion, questions, movieRecommendations, selectedMovies } = this.state;
        const currentQuestionData = questions[currentQuestion];

        return (
            <div className="container">
                <div className="card">
                    {currentQuestion < questions.length ? (
                        <div className='question-box'>
                            <h2>{currentQuestionData.text}</h2>
                            <ul className='options'>
                                {currentQuestionData.choices.map((choice, index) => (
                                    <li
                                        key={index}
                                        className={
                                            currentQuestion === 0 || currentQuestion === 2
                                                ? currentQuestionData.selectedChoices.includes(choice)
                                                    ? 'selected'
                                                    : ''
                                                : currentQuestionData.selectedChoice === choice
                                                ? 'selected'
                                                : ''
                                        }
                                        onClick={() =>
                                            currentQuestion === 0 || currentQuestion === 2
                                                ? this.handleGenreSelection(choice)
                                                : this.handleChoiceSelection(choice)
                                        }
                                    >
                                        {choice}
                                    </li>
                                ))}
                            </ul>
                            <div className='btns'>
                                {currentQuestion > 0 && <button className="picker-btn" onClick={this.handleBack}>Back</button>}
                                {currentQuestion === 0 ? (
                                    <div className="filler"></div>
                                ) : (
                                    <div className="filler" />
                                )}
                                <button className="picker-btn" onClick={this.handleNext}>Next</button>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <h2>Select the movies you have seen and liked</h2>
                            <ul className='options'>
                                {movieRecommendations.map((movie, index) => (
                                    <li key={index}>
                                        <input
                                            type="checkbox"
                                            value={movie.title}
                                            onChange={this.handleMovieSelection}
                                        />
                                        {movie.title}
                                    </li>
                                ))}
                            </ul>
                            <button className="picker-btn submit" onClick={this.handleRecommendationsSubmit}>
                                Get Recommendations for Selected Movies
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

export default MoviePicker;
