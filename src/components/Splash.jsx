import React from "react"

export default function Splash({categories, handleStartButton}){

    const {category, difficulty, questionType} = JSON.parse(localStorage.getItem("quizSettings")) || {category: "", difficulty: "", questionType: ""}

    return (
        <div className="splash-container">
            <h1>Quizzical</h1>
            <p>Test your trivia skills!</p>
            <form>
                <label htmlFor="question-category">
                    <p className="form-label">Select Category:</p>
                    <select name="question-category" id="question-category" defaultValue={`${category ? category : ""}`}>
                        <option value ="">Any Category</option>
                        {categories.map((e,i) => <option key={i} value={e.id}>{e.name}</option>)}
                    </select>
                </label>

                <label htmlFor="difficulty">
                    <p className="form-label">Select Difficulty:</p>
                    <select name="difficulty" id="difficulty" defaultValue={`${difficulty ? difficulty : ""}`}>
                        <option value="">Any Difficulty</option>
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                    </select>
                </label>

                <label htmlFor="question-type">
                    <p className="form-label">Select Question Type:</p>
                    <select name="question-type" id="question-type" defaultValue={`${questionType ? questionType : ""}`}>
                        <option value="">Any Type</option>
                        <option value="multiple">Multiple Choice</option>
                        <option value="boolean">True/False</option>
                    </select>
                </label>
            </form>
            <button className="start-btn" onClick={handleStartButton}>Start Quiz</button>
        </div>
    )
}