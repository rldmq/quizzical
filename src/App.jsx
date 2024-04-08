import React from "react"

import Splash from "./components/Splash"
import Question from "./components/Question"
import HSGlobal from "./components/HSGlobal"
import HSLocal from "./components/HSLocal"

export default function App(){

    // VARIABLES
    const questionCount = 5 // Just in case this becomes modifiable

    // STATES
    const [splashPage, setSplashPage] = React.useState(true)
    const [categories, setCategories] = React.useState([])
    const [questions, setQuestions] = React.useState([])
    const [submitAnswers, setSubmitAnswers] = React.useState(false)
    const [missingAnswers, setMissingAnswers] = React.useState(false)
    const [score, setScore] = React.useState(0)
    const [tryAgain, setTryAgain] = React.useState(false)

    // FUNCTIONS
    async function fetchCategories(){
        const res = await fetch("https://opentdb.com/api_category.php")
        const data = await res.json()
        setCategories(data.trivia_categories)
    }

    async function fetchQuestions({category, difficulty, questionType}){

        // Sample URL:
        // https://opentdb.com/api.php?amount=10&category=19&difficulty=medium&type=multiple

        const categoryFragment = category ? `&category=${category}` : ""

        const difficultyFragment = difficulty ? `&difficulty=${difficulty}` : ""

        const questionTypeFragment = questionType ? `&type=${questionType}` : ""

        const res = await fetch(`https://opentdb.com/api.php?amount=${questionCount}${categoryFragment}${difficultyFragment}${questionTypeFragment}`)

        const data = await res.json()

        setQuestions(processApiData(data.results))
    }

    function processApiData(data){
        return data.map((e,i) => {
            
            // add a "selected" propertly, default to false for the "incorrect_answers" array
            const options = e.incorrect_answers.map(item => ({value: item, selected: false}))

            // add a "selected" property, default to false for the "correct_answer"
            const answer = {value: e.correct_answer, selected: false}

            // randomly insert "answer" to "options" array
            options.splice(Math.floor(Math.random() * options.length), 0, answer)

            // add "id" to each item in new "options" array and add a "questionIndex" property
            return {...e, options: options.map((item,index) => ({...item, id: `${i}-${index}`})), questionIndex: i}
        })
    }

    function handleStartButton(){
        setSplashPage(false)
        const quizSettings = {
            category: document.getElementById("question-category").value,
            difficulty: document.getElementById("difficulty").value,
            questionType: document.getElementById("question-type").value,
        }

        localStorage.setItem("quizSettings", JSON.stringify(quizSettings))

        fetchQuestions(JSON.parse(localStorage.getItem("quizSettings")))
    }

    function handleOptionSelection(questionIndex, id){
        setQuestions(questions.map(question => {
            // Only modify options with the same question index
            if(question.questionIndex === questionIndex){
                return ({
                    ...question, 
                    options: toggleSelected(question.options,id)
                })
            }else{
                return {...question}
            }
        }))
    }

    function toggleSelected(data,id){
        return data.map(option => {
            if(option.id === id){
                return {...option, selected: !option.selected}
            }else{
                return {...option, selected: false}
            }
        })
    }

    function handleCheckAnswers(){
        if(!submitAnswers){

            const anyMissing = questions.every(question => {
                //should return true if at least one is selected
                return question.options.some(option => option.selected) 
            })

            if(anyMissing){
                setQuestions(questions.map( question => {
                    return {...question, options: question.options.map(option => {
                        const correct = option.value === question.correct_answer
        
                        if(option.selected && correct){
                            setScore(score => score + 1)
                            return {...option, correct: true}
                        }else if(option.selected && !correct){
                            return {...option, incorrect: true}
                        }else if(!option.selected && correct){
                            return{...option, correct: true}
                        }else{
                            return {...option, unselected: true}
                        }
                    })}
                }))
                setSubmitAnswers(true)
                setMissingAnswers(false)
            }else{
                setMissingAnswers(true)
            }
        }else{
            // Basically, reset the game
            setScore(0)
            setSplashPage(true)
            setSubmitAnswers(false)
            setMissingAnswers(false)
            setTryAgain(prev => !prev)
        }
    }

    // EFFECTS
    React.useEffect(()=>{
        fetchCategories()
    },[tryAgain])

    return (
        <div className="app-container">
            {splashPage && <Splash categories={categories} handleStartButton={handleStartButton}/>}
            {!splashPage && 
                <div className="quiz-container">
                    <HSLocal /> {/* NEW */}
                    {questions.map((e,i) => 
                    <Question 
                        key={i}
                        question={e.question} 
                        options={e.options} 
                        questionIndex={e.questionIndex}
                        handleOptionSelection={handleOptionSelection}
                        submitted={submitAnswers}
                    />)
                    }
                    <div className="endgame-container">
                        {submitAnswers && <p className="score-message">{`You scored ${score}/${questions.length} answers`}</p>}
                        {missingAnswers && <p className="missing-answers-message">Some questions haven't been answered!</p>}
                        <button 
                            className="check-btn"
                            onClick={handleCheckAnswers}
                        >{submitAnswers ? "Try Another" : "Check Answers"}</button>
                    </div>
                    <HSGlobal /> {/* NEW */}
                </div>
            }
        </div>
    )
}

// TO DO:
// change name to "jeopardy practice"
// redundancy is splash for quizSettings object (already setting to "" when no local storage)
// restart button? (before game ends)
// local highscores (localStorage) - best category (% per game), best difficulty per category (% per game)
// firebase integration for global highscores
// change boolean so it's always true > false (no randomization)

// global high scores tab
// difficulty
// category
// type
// 