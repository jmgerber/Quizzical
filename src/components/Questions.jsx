import he from "he"

export default function Questions(props) {
  const sortedAnswersArray = props.answers.sort((a, b) => {
    if (a.answer < b.answer) {
      return -1
    } else if (a.answer > b.answer) {
      return 1
    }
    return 0
  })


  return (
    <div className="question">
      <h2>{he.decode(props.question)}</h2>
      <div className="answers-container">
        {sortedAnswersArray.map(answer => {
          const styles = {
            backgroundColor: answer.isHeld ? "#D6DBF5" : "white"
          }
          return (<p
            id={answer.id}
            style={styles}
            className="answer-choice"
            onClick={() => props.toggleOnHeld(answer.id, props.id)}>
            {he.decode(answer.answer)}
          </p>)
        })}
      </div>
    </div>
  )
}
