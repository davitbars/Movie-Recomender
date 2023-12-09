import React, { Component } from 'react';
import "./MoviePicker.css";

class MoviePicker extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentQuestion: 0, // Index of the current question
            answers: [], // Store user's answers
            movierecommendations: [], // Store movie recommendations based on user preferences
            currentIndex: 0,
            currentMovie: null,
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
            this.fetchMovierecommendations();
        }
    }

    fetchMovierecommendations = (answers) => {
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
                this.setState({ movierecommendations: data.similar_movies });
                console.log(data.similar_movies)
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
        } else {
            userPreferences.keywords = this.state.questions[currentQuestion].selectedChoices;
        }

        // Update the state with the modified user preferences object
        this.setState({ answers: userPreferences, currentQuestion: currentQuestion + 1 });

        if (currentQuestion === this.state.questions.length - 1) {
            // All questions have been answered, so fetch recommendations
            this.fetchMovierecommendations(userPreferences);
        }
    };

    handleBack = () => {
        const { currentQuestion } = this.state;
        if (currentQuestion > 0) {
            this.setState({ currentQuestion: currentQuestion - 1 });
        }
    };
    handleMovieNext = () => {
        const { currentIndex, movierecommendations } = this.state;
        if (currentIndex < movierecommendations.length - 1) {
            this.setState({ currentIndex: currentIndex + 1 })
            this.setState({ currentMovie: movierecommendations[this.state.currentIndex] });
        }
    };

    handleMovieBack = () => {
        const { currentIndex, movierecommendations } = this.state;

        if (currentIndex > 0) {
            this.setState({ currentIndex: currentIndex - 1 })
            this.setState({ currentMovie: movierecommendations[this.state.currentIndex] });
        }
    };

    render() {
        const { currentQuestion, questions } = this.state;
        const currentQuestionData = questions[currentQuestion];

        const { currentIndex, movierecommendations } = this.state;
        const currentMovie = movierecommendations[currentIndex];

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
                            <h2 style={{ textAlign: 'center', width: '100%'}}>Recomendation</h2>
                            {currentMovie && (
                                <div>
                                    <div className='pic-title-info'>
                                        <img
                                            src={`https://image.tmdb.org/t/p/w185/${currentMovie.poster_path}`}
                                            alt={currentMovie.title}
                                            style={{ width: '250px', height: '250px' }}
                                        />
                                        <div className='title-link'>
                                            <h3 className='movie-title'>{currentMovie.title}</h3>
                                            <a
                                                href={`http://localhost:3000/movie/${encodeURIComponent(currentMovie.title)}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className='info-link'
                                            >
                                                More Info
                                            </a>
                                        </div>
                                    </div>
                                    <div className="btns">
                                        <button className="picker-btn" onClick={this.handleMovieBack} disabled={currentIndex === 0}>
                                            Back
                                        </button>
                                        <button
                                            className="picker-btn"
                                            onClick={this.handleMovieNext}
                                            disabled={currentIndex === movierecommendations.length - 1}
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

export default MoviePicker;

