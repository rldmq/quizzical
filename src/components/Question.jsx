import React from "react"
import { decode } from "html-entities"

export default function Question({question, options, questionIndex, handleOptionSelection, submitted}){

    return (
        <div>
            <h2>{decode(question)}</h2>
            <div className="options-container">
                {options.map((e,i) => 
                <p 
                    key={i}
                    className={`option ${
                        e.correct 
                        ? "correct" : e.incorrect 
                        ? "incorrect" : e.unselected
                        ? "unselected" : e.selected
                        ? "selected" : ""
                    }`}

                    id={`${questionIndex}-${i}`}

                    disabled={submitted}
                    
                    onClick={() => {
                        if(!submitted){
                            handleOptionSelection(questionIndex,`${questionIndex}-${i}`)
                        }
                    }}
                >{decode(e.value)}</p>)}
            </div>
            <hr className="horiz-break" color="#DBDEF0" size="1"/>
        </div>
    )
}