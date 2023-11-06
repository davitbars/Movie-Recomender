import React, { Component } from 'react';
import "./MoviePicker.css";

class MoviePicker extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentQuestion: 0, // Index of the current question
            answers: [], // Store user's answers
            questions: [
                {
                    text: 'Which genres are you currently looking for?',
                    choices: ['No Preference', 'Action', 'Drama', 'Sci-Fi', 'Romance', 'Comedy', 'Fantasy', 'Thriller'],
                    selectedChoices: [],
                },
                {
                    text: 'Do you have a minimum IMDb rating in mind?',
                    choices: ['No preference', '5 or higher', '6 or higher', '7 or higher', '8 or higher', '9 or higher'],
                    selectedChoice: '',
                },
                {
                    text: 'Who will you be watching this move with',
                    choices: ['Alone', 'Friends', 'Family', 'Kids', 'Teens', 'Colleagues'],
                    selectedChoice: '',
                },
                {
                    text: 'Which runtime length do you prefer?',
                    choices: ['No preference', '30-60 minutes', '61-90 minutes', '91-120 minutes', '121-150 minutes', 'Over 120 minutes'],
                    selectedChoices: [],
                },
                {
                    text: 'Which keywords stand out to you?',
                    choices: ["Love", "Friendship", "Betrayal", "Family", "Adventure", "Mystery", "Power", "Survival", "Bank",
                        "Revenge", "Discovery", "Journey", "Secret", "Conflict", "Intrigue", "Redemption", "Escape", "Rivalry", "Passion",
                        "Hope", "Dream", "Heist", "Conspiracy", "Betrayal", "Hero", "Villain", "Marriage", "Robot", "Magic", "Quest"],
                    selectedChoices: [],
                },
            ],
        };
    }

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
        const { currentQuestion, answers, questions } = this.state;

        if (currentQuestion === 0) {
            answers.push({ genres: questions[currentQuestion].selectedChoices });
        } else {
            answers.push({ choice: questions[currentQuestion].selectedChoice });
        }

        this.setState({ currentQuestion: currentQuestion + 1 });
    };

    handleBack = () => {
        const { currentQuestion } = this.state;
        if (currentQuestion > 0) {
            this.setState({ currentQuestion: currentQuestion - 1 });
        }
    };

    render() {
        const { currentQuestion, questions } = this.state;
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
                                        className={currentQuestion === 0 || currentQuestion === 3 ?
                                            currentQuestionData.selectedChoices.includes(choice) ? 'selected' : '' :
                                            currentQuestionData.selectedChoice === choice ? 'selected' : ''}
                                        onClick={() => currentQuestion === 0 || currentQuestion === 3 ?
                                            this.handleGenreSelection(choice) : this.handleChoiceSelection(choice)}
                                    >
                                        {choice}
                                    </li>
                                ))}
                            </ul>
                            <div className='btns'>
                                {currentQuestion > 0 && (<button onClick={this.handleBack}>Back</button>)}
                                {currentQuestion === 0 ? (
                                    <div className="filler"></div>
                                ) : (
                                    <div className="filler" />
                                )}
                                <button onClick={this.handleNext}>Next</button>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <h2>Movie Recommendations:</h2>
                            <ul className='options'>
                                {questions.map((question, index) => (
                                    <li key={index}>
                                        {question.text}
                                        <br />
                                        {index === 0
                                            ? `User's Answer: ${question.selectedChoices.join(', ')}`
                                            : `User's Answer: ${question.selectedChoice}`}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

export default MoviePicker;
