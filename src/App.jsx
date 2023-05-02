import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'

// components
import TodoTitle from './components/Todos/TodoTitle'
import TodoForm from './components/Todos/TodoForm'
import TodosActions from './components/Todos/TodosActions'
import TodoList from './components/Todos/TodoList'
import CodeModal from './components/Modal/CodeModal'

// hooks
import { useLocalStorage } from './hooks/useLocalStorage'

// styles
import './App.css'

function App() {
  const [todos, setTodos] = useState([])
  const [localStorTodos, setLocalStorTodos] = useLocalStorage('todos', [])
  const [localStorTodosText, setLocalStorTodosText] = useLocalStorage(
    'todosSecureHelper',
    []
  )
  const [codeLocal, setCodeLocal] = useLocalStorage('secureCode', [
    '',
    '',
    '',
    '',
  ])
  const [isBlocked, setIsBlocked] = useLocalStorage('isBlocked', false)
  const [isEditSession, setIsEditSession] = useState(true)
  const [isAllTodosCompleted, setIsAllTodosCompleted] = useState(false)
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false)
  const [isTempLoggedIn, setIsTempLoggedIn] = useState(false)

  const openCodeModalHandler = useCallback(() => {
    setIsCodeModalOpen(true)
  }, [])

  const closeCodeModalHandler = useCallback(() => {
    setIsCodeModalOpen(false)
  }, [])

  const lengthCompletedTodos = todos.filter((todo) => todo.isCompleted).length

  const lengthLocalStorTodos = localStorTodos.filter(
    (el) => !el.isCompleted
  ).length

  const lengthTodos = todos.filter((el) => !el.isCompleted).length

  const addTodoHandler = (text) => {
    setIsEditSession(false)

    const newTodo = {
      text,
      isCompleted: false,
      isSecure: false,
      id: uuidv4(),
    }
    const { id: idMatch } = newTodo

    setTodos([...todos, newTodo])
    setLocalStorTodos([...todos, newTodo])
    setLocalStorTodosText([...localStorTodosText, { text, idMatch }])
  }

  const secureTodoHandler = (id, text) => {
    const replaceWithStars = (todo) => (todo = '•'.repeat(todo.length))
    const matchedTodo = localStorTodosText.find((el) => el.idMatch === id)

    isTempLoggedIn &&
      setTodos(
        todos.map((todo) =>
          todo.id === id
            ? {
                ...todo,
                text: !todo.isSecure
                  ? replaceWithStars(text)
                  : matchedTodo.text,
                isSecure: !todo.isSecure,
              }
            : { ...todo }
        )
      )

    isTempLoggedIn &&
      setLocalStorTodos(
        localStorTodos.map((todo) =>
          todo.id === id
            ? {
                ...todo,
                text: !todo.isSecure
                  ? replaceWithStars(text)
                  : matchedTodo.text,
                isSecure: !todo.isSecure,
              }
            : { ...todo }
        )
      )
  }
  const deleteTodoHandler = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id))
    setLocalStorTodos(localStorTodos.filter((localTodo) => localTodo.id !== id))
  }

  const toggleTodoHandler = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id
          ? { ...todo, isCompleted: !todo.isCompleted }
          : { ...todo }
      )
    )

    setLocalStorTodos(
      localStorTodos.map((localTodo) =>
        localTodo.id === id
          ? { ...localTodo, isCompleted: !localTodo.isCompleted }
          : { ...localTodo }
      )
    )
  }

  const deleteCompletedTodosHandler = () => {
    setTodos(todos.filter((todo) => !todo.isCompleted))
    setLocalStorTodos(todos.filter((todo) => !todo.isCompleted))
  }

  const resetTodosHandler = () => {
    setTodos([])
    setLocalStorTodos([])
    setLocalStorTodosText([])
    setCodeLocal(['', '', '', ''])
  }

  const editSessionHandler = () => {
    setIsEditSession((prev) => !prev)
    setTodos(localStorTodos.filter((todo) => todo.id !== todo))
  }

  const startSessionHandler = () => {
    setIsEditSession((prev) => !prev)
    resetTodosHandler()
    setIsBlocked(false)
  }

  useEffect(() => {
    const isFullyCompletedTodos = todos.every((todos) => todos.isCompleted)
    const isFullyCompletedLocalStorTodos = localStorTodos.every(
      (todos) => todos.isCompleted
    )

    if (isFullyCompletedTodos && isFullyCompletedLocalStorTodos) {
      setIsAllTodosCompleted(false)
    } else {
      setIsAllTodosCompleted(true)
    }
  }, [todos, localStorTodos])
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ type: 'tween', duration: 0.3 }}
        className="App"
      >
        <TodoTitle />

        <TodoForm
          localStorTodos={localStorTodos}
          todos={todos}
          addTodo={addTodoHandler}
          isEditSession={isEditSession}
        />

        <CodeModal
          isOpenModal={isCodeModalOpen}
          onCloseModal={closeCodeModalHandler}
          codeLocal={codeLocal}
          setCodeLocal={setCodeLocal}
          isTempLoggedIn={isTempLoggedIn}
          setIsTempLoggedIn={setIsTempLoggedIn}
          setIsBlocked={setIsBlocked}
          isBlocked={isBlocked}
        />

        {!!todos.length && (
          <TodosActions
            resetTodos={resetTodosHandler}
            deleteCompletedTodos={deleteCompletedTodosHandler}
            lengthCompletedTodos={lengthCompletedTodos}
          />
        )}

        <TodoList
          localTodosLength={lengthLocalStorTodos}
          todosLength={lengthTodos}
          localStorTodos={localStorTodos}
          lengthCompletedTodos={lengthCompletedTodos}
          isAllTodosCompleted={isAllTodosCompleted}
          todos={todos}
          isEditSession={isEditSession}
          deleteTodo={deleteTodoHandler}
          toggleTodo={toggleTodoHandler}
          secureTodo={secureTodoHandler}
          openCodeModalHandler={openCodeModalHandler}
          isTempLoggedIn={isTempLoggedIn}
          editSession={editSessionHandler}
          startSession={startSessionHandler}
        />
      </motion.div>
    </AnimatePresence>
  )
}

export default App
