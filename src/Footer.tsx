import { Button } from '@mui/material'
import { useQuestionsStore } from './store/questions'

const Footer = () => {
  const questions = useQuestionsStore(state => state.questions)
  const reset = useQuestionsStore(state => state.reset)
  let correct = 0
  let incorrect = 0
  let unanswered = 0

  questions.forEach(question => {
    const { userSelectedAnswer, correctAnswer } = question
    if (userSelectedAnswer == null) unanswered++
    else if (userSelectedAnswer === correctAnswer) correct++
    else incorrect++
  })
  return (
    <footer style={{ marginTop: '16px', display: 'flex', flexDirection: 'column' }}>
      <strong>{`✔ ${correct} Correctas - ❌ ${incorrect} Incorrectas - ❓ ${unanswered}  Sin responder`}</strong>
      <Button variant='outlined' onClick={() => reset()} sx={{ mt: 2 }}>
        Reiniciar
      </Button>
    </footer>
  )
}

export default Footer
