import { Card, IconButton, List, ListItem, ListItemButton, ListItemText, Stack, Typography } from '@mui/material'
import { type Question as QuestionType } from './types'
import { useQuestionsStore } from './store/questions'
import SyntaxHighLighter from 'react-syntax-highlighter'
import { gradientDark } from 'react-syntax-highlighter/dist/cjs/styles/hljs'
import { ArrowBackIosNew, ArrowForwardIos } from '@mui/icons-material'
import Footer from './Footer'

const Question = ({ info } : {info: QuestionType}) => {
  const selectAnswer = useQuestionsStore(state => state.selectAnswer)
  const createHandleClick = (answerIndex: number) => () => selectAnswer(info.id, answerIndex)
  const getBackgroundColor = (index: number) => {
    const { userSelectedAnswer, correctAnswer } = info
    // usuario no ha seleccionado una respuesta
    if (userSelectedAnswer == null) return 'transparent'
    // si ya selecciono la respuesta es incorrecta
    if (index !== correctAnswer && index !== userSelectedAnswer) return 'transparent'
    // si ya selecciono la respuesta es correcta
    if (index === correctAnswer) return 'green'
    // si ya selecciono la respuesta es incorrecta
    if (index === userSelectedAnswer) return 'red'
    // ninguna de las anteriores
    return 'transparent'
  }

  return (
    <Card variant='outlined' sx={{ bgcolor: '#222', p: 2, textAlign: 'left' }}>
      <Typography variant ='h5'>
        {info.question}
      </Typography>
      <SyntaxHighLighter
        language='javascript'
        style={gradientDark}
        customStyle={{ borderRadius: '4px' }}
      >
        {info.code}
      </SyntaxHighLighter>
      <List sx={{ bgcolor: '#333', borderRadius: '4px' }} disablePadding >
        {info.answers.map((answer, index) => (
         <ListItem key={index} disablePadding divider disabled={info.userSelectedAnswer != null}>
          <ListItemButton
          onClick={createHandleClick(index)}
          sx={{ bgcolor: getBackgroundColor(index) }}
          >
            <ListItemText primary={answer} sx={{ textAlign: 'center' }}/>
          </ListItemButton>
         </ListItem>
        ))}
      </List>
    </Card>
  )
}
export const Game = () => {
  const questions = useQuestionsStore(state => state.questions)
  const currentQuestion = useQuestionsStore(state => state.currentQuestion)
  const questionInfo = questions[currentQuestion]
  const goNextQuestion = useQuestionsStore(state => state.goNextQuestion)
  const goPreviousQuestion = useQuestionsStore(state => state.goPreviousQuestion)
  return (
    <>
      <Stack direction={'row'} gap={2} alignItems='center' justifyContent='center' sx={{ margin: '4px 0 4px 0' }}>
        <IconButton onClick={goPreviousQuestion} disabled={currentQuestion === 0}>
          <ArrowBackIosNew />
        </IconButton>
        {currentQuestion + 1} / {questions.length}
        <IconButton onClick={goNextQuestion} disabled={currentQuestion >= questions.length - 1}>
          <ArrowForwardIos />
        </IconButton>
      </Stack>
      <Question info={questionInfo}/>
      <Footer />
    </>
  )
}

export default Game
