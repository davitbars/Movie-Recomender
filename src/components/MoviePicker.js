import React, { useState } from 'react';
import './MoviePicker.css'; // Import your CSS file for styling

const MoviePicker = () => {
    const [questions, setQuestions] = useState([
        {
            question: "What's your favorite movie genre?",
            options: ['Action', 'Comedy', 'Drama', 'Sci-Fi', 'Romance', 'Horror'],
        },
        {
            question: 'How do you prefer your movies to end?',
            options: ['Happy ending', 'Sad ending', 'Open ending'],
        },
        {
            question: 'Which of these actors do you like the most?',
            options: ['Tom Hanks', 'Meryl Streep', 'Leonardo DiCaprio', 'Dwayne Johnson', 'Emma Watson'],
        },
        {
            question: 'Do you like movies with a lot of action scenes?',
            options: ['Yes', 'No'],
        },
        {
            question: 'How about a bit of mystery in your movies?',
            options: ['Yes', 'No'],
        },
    ]);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [suggestedMovie, setSuggestedMovie] = useState(null);

    const handleAnswer = (question, answer) => {
        setSelectedAnswers((prevSelectedAnswers) => ({
            ...prevSelectedAnswers,
            [question]: answer,
        }));
    };

    const suggestMovie = () => {
        fetch('your-server-endpoint', {
            method: 'POST',
            body: JSON.stringify(selectedAnswers),
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => response.json())
            .then((data) => {
                setSuggestedMovie(data.suggestedMovie);
            })
            .catch((error) => console.error('Error:', error));
    };

    return (
        <div className="movie-picker-container">
            {suggestedMovie ? (
                <div className="movie-box">
                    <h2>Movie Suggestion:</h2>
                    <p>{suggestedMovie}</p>
                </div>
            ) : (
                <div className="movie-box">
                    <h2>Movie Picker</h2>
                    <form>
                        {questions.map((q, index) => (
                            <div className="question-box" key={index}>
                                <h3>{q.question}</h3>
                                <div className='options'>
                                    {q.options.map((option) => (
                                        <label key={option}>
                                            <input
                                                type="radio"
                                                value={option}
                                                name={`question${index}`}
                                                onChange={() => handleAnswer(q.question, option)}
                                                checked={selectedAnswers[q.question] === option}
                                            />
                                            {option}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ))}
                        <button className='submit' type="button" onClick={suggestMovie}>
                            Next
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default MoviePicker;
