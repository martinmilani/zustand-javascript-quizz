import { create } from 'zustand'
import { type Question } from '../types'
import confetti from 'canvas-confetti'
import { persist, devtools } from 'zustand/middleware'

interface State {
  questions: Question[]
  currentQuestion: number
  fetchQuestions:(limit: number) => Promise<void>
  selectAnswer: (questionId: number, answerIndex: number) => void
  goNextQuestion: () => void
  goPreviousQuestion: () => void
  reset: () => void
}

export const useQuestionsStore = create<State>()(devtools(persist((set, get) => ({
  questions: [],
  currentQuestion: 0,
  fetchQuestions: async (limit: number) => {
    const res = await fetch('http://localhost:5173/data.json')
    const json = await res.json()

    const questions = json.sort(() => Math.random() - 0.5).slice(0, limit)
    set({ questions }, false, 'FETCH_QUESTIONS')
  },

  selectAnswer (questionId, answerIndex) {
    const { questions } = get()
    // usar el structuredClone para clonar el objeto
    const newQuestions = structuredClone(questions)
    // encontrar el indice de la pregunta
    const questionIndex = newQuestions.findIndex(q => q.id === questionId)
    // obtenemos la información de la pregunta
    const questionInfo = newQuestions[questionIndex]
    // averiguamos si el usuario ha seleccionado la respuesta correcta
    const isCorrectUserAnswer = questionInfo.correctAnswer === answerIndex
    // cambiar esta informacioón en la copia de la pregunta

    if (isCorrectUserAnswer) confetti()
    newQuestions[questionIndex] = {
      ...questionInfo,
      userSelectedAnswer: answerIndex,
      isCorrectUserAnswer
    }
    // actualizar el estado
    set({ questions: newQuestions }, false, 'SELECT_ANSWER')
  },

  goNextQuestion: () => {
    const { currentQuestion, questions } = get()
    const nextQuestion = currentQuestion + 1

    if (nextQuestion < questions.length) {
      set({ currentQuestion: nextQuestion }, false, 'GO_NEXT_QUESTION')
    }
  },

  goPreviousQuestion: () => {
    const { currentQuestion } = get()
    const previousQuestion = currentQuestion - 1
    if (previousQuestion >= 0) {
      set({ currentQuestion: previousQuestion }, false, 'GO_PREVIOUS_QUESTION')
    }
  },

  reset: () => {
    set({ questions: [], currentQuestion: 0 }, false, 'RESET')
  }

}), { name: 'questions' })))
