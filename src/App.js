import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { useLocalStorage } from './components/useLocalStorage'
import TodoTitle from './components/Todos/TodoTitle'
import TodoForm from './components/Todos/TodoForm'
import TodosActions from './components/Todos/TodosActions'
import TodoList from './components/Todos/TodoList'
import './App.css'

function App() {
  const [todos, setTodos] = useState([])
  const [localStorTodos, setLocalStorTodos] = useLocalStorage('myTodos', [])

  const addTodoHandler = (text) => {
    const newTodo = {
      text: text,
      isCompleted: false,
      id: uuidv4(),
    }
    setTodos([...todos, newTodo])
    setLocalStorTodos([...todos, newTodo])
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

  const editCurTodoSession = () => {
    setTodos(localStorTodos.filter((todo) => todo.id !== todo))
  }

  const resetTodosHandler = () => {
    setTodos([])
    setLocalStorTodos([])
  }

  const deleteCompletedTodosHandler = () => {
    setTodos(todos.filter((todo) => !todo.isCompleted))
    setLocalStorTodos(todos.filter((localTodo) => !localTodo.isCompleted))
  }

  const completedTodosCount = todos.filter((todo) => todo.isCompleted).length

  const getLengthLocalStorageTodos = localStorTodos.filter(
    (el) => !el.isCompleted
  ).length

  const getLengthTodos = todos.filter((el) => !el.isCompleted).length

  return (
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
      />

      {!!todos.length && (
        <TodosActions
          resetTodos={resetTodosHandler}
          deleteCompletedTodos={deleteCompletedTodosHandler}
          completedTodosExist={!!completedTodosCount}
        />
      )}

      <TodoList
        localTodosLength={getLengthLocalStorageTodos}
        todosLength={getLengthTodos}
        localStorTodos={localStorTodos}
        todos={todos}
        deleteTodo={deleteTodoHandler}
        toggleTodo={toggleTodoHandler}
        editCurTodoSession={editCurTodoSession}
      />

      <AnimatePresence>
        {completedTodosCount > 0 && (
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'tween', duration: 0.3 }}
            exit={{ opacity: 0, y: -20 }}
          >{`You have completed ${completedTodosCount} ${
            completedTodosCount > 1 ? 'todos' : 'todo'
          }`}</motion.h2>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!getLengthLocalStorageTodos && (
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              type: 'tween',
              duration: 0.3,
            }}
            exit={{ opacity: 0, y: 20 }}
          >
            Todo list is empty
          </motion.h2>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default App
