import { useState, useEffect } from 'react'
import { nanoid } from 'nanoid'
import Questions from './components/Questions'
import './App.css'

function App() {
  // States
  const [isPlaying, setIsPlaying] = useState(false)
  const [difficulties, setDifficulties] = useState("easy")
  const [questions, setQuestions] = useState([])
  const [goodAnswers, setGoodAnswers] = useState()

  // Difficulty buttons 
  const difficultyArray = ["easy", "medium", "hard"]
  const difficultyButtonElements = difficultyArray.map(difficulty => {
    return (
      <div className={`difficulty-button ${difficulties === difficulty ? 'selected-diff' : ''}`} key={nanoid()} onClick={() => setDifficulties(difficulty)}>
        {difficulty}
      </div>
    )
  })

  // Api call
  useEffect(() => {
    setQuestions([])
    fetch(`https://opentdb.com/api.php?amount=5&difficulty=${difficulties}&type=multiple`)
      .then(res => res.json())
      .then(data => {
        // On récupère les questions et les infos que l'on désire
        setGoodAnswers(undefined)
        let results = data.results
        const questionList = setQuestions(results.map(item => {
          let answersArray = item.incorrect_answers
          answersArray.push(item.correct_answer)
          let finalAnswersArray = answersArray.map(item => ({ answer: item, isHeld: false, id: nanoid() }))
          return ({
            id: nanoid(),
            question: item.question,
            answers: finalAnswersArray,
            correct_answer: item.correct_answer,
          })
        }))
        return questionList
      })
  }, [isPlaying])

  // Questions
  const questionList = questions.map((item) => (
    <Questions
      id={item.id}
      key={item.id}
      question={item.question}
      answers={item.answers}
      correctAnswer={item.correct_answer}
      toggleOnHeld={toggleOnHeld}
    />
  ))
  function toggleOnHeld(answerId, questionId) {
    if (goodAnswers === undefined) {
      setQuestions(oldQuestions => oldQuestions.map(item => {
        if (item.id === questionId) {
          const newAnswersArray = item.answers.map(answer => {
            // Change le statut isHeld sur l'élément cliqué
            return answer.id === answerId ? { ...answer, isHeld: !answer.isHeld } : { ...answer, isHeld: false }
          })
          return { ...item, answers: newAnswersArray }
        } else {
          return item
        }
      }))
    }
  }

  function verifyAnswers() {
    setGoodAnswers(0)
    questions.map(item => {
      item.answers.map(answer => {
        // Si la réponse donnée est correcte
        if (answer.answer == item.correct_answer) {
          const goodAnswer = document.getElementById(answer.id)
          goodAnswer.style.backgroundColor = "#94D7A2"
          goodAnswer.style.border = "none"
        }
        if (answer.isHeld === true && answer.answer == item.correct_answer) {
          setGoodAnswers(prevGoodAnswers => prevGoodAnswers + 1)
          // Si la réponse donnée est incorrecte
        } else if (answer.isHeld === true && answer.answer != item.correct_answer) {
          const incorrectAnswer = document.getElementById(answer.id)
          incorrectAnswer.style.backgroundColor = "#F8BCBC"
          incorrectAnswer.style.border = "none"
          incorrectAnswer.style.opacity = "0.5"
        } else if (answer.isHeld === false && answer.answer != item.correct_answer) {
          const otherAnswers = document.getElementById(answer.id)
          otherAnswers.style.opacity = "0.5"
        }

      })

    })
  }

  return (
    <div className="App">
      {
        isPlaying ?
          <div className="playing-page">
            {questionList}
            <div className="button-container">
              {goodAnswers != undefined ?
                <span className='score-sentence'>{`You scored ${goodAnswers}/5 correct answers`}</span> :
                <button className="verify-button" onClick={verifyAnswers}>Check answers</button>}
              <button className="menu-button" onClick={() => setIsPlaying(false)}>Menu</button>
            </div>
            <div className='blob-1'></div>
          </div>
          :
          <div className="landing-page">
            <h1>Quizzical</h1>
            <p>Choose your difficulty</p>
            <div className='difficulty-container'>
              {difficultyButtonElements}
            </div>
            <button className="start-button" onClick={() => setIsPlaying(true)}>Start Quiz</button>
          </div>
      }
    </div >
  )
}

export default App

