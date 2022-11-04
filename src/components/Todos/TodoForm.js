import { motion, AnimatePresence } from 'framer-motion'
import { BiErrorCircle } from 'react-icons/bi'
import { useState } from 'react'
import Button from '../UI/Button'
import styles from './TodoForm.module.css'

function TodoForm({ localStorTodos, todos, addTodo }) {
  const [text, setText] = useState('')
  const onSubmitHandler = (event) => {
    event.preventDefault()
    if (text.length >= 25) return
    if (text && text.replace(/\s+/g, '')) addTodo(text)
    setText('')
  }
  return (
    <div className={styles.todoFormContainer}>
      <form onSubmit={onSubmitHandler}>
        <AnimatePresence>
          <motion.input
            whileFocus={{
              scale: 1.05,
              caretColor: '#95d330',
            }}
            initial={{ opacity: 0.5, x: -50, width: '30%' }}
            animate={{ opacity: 1, x: 0, width: '40%' }}
            exit={{ opacity: 0 }}
            transition={{
              type: 'spring',
              stiffness: 120,
            }}
            required
            maxLength="25"
            title={
              localStorTodos.length >= 0 && todos.length === 0
                ? 'Enter new todo'
                : 'Add new todo'
            }
            autoComplete="off"
            type="text"
            className={
              text.length >= 25 ? styles.checkInputText : styles.inputText
            }
            placeholder={
              localStorTodos.length >= 0 && todos.length === 0
                ? 'Enter new todo'
                : 'Add new todo'
            }
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </AnimatePresence>

        <AnimatePresence>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{
              type: 'spring',
              stiffness: 120,
            }}
          >
            <Button
              className={styles.button}
              title="Push to list"
              type="submit"
            >
              Push
            </Button>
          </motion.div>
        </AnimatePresence>
      </form>

      {text.length >= 25 && (
        <motion.div
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'tween', duration: 0.3 }}
          className={styles.checkCharactersText}
        >
          <BiErrorCircle />
          <p>Please enter less than 25 characters long</p>
        </motion.div>
      )}
    </div>
  )
}

export default TodoForm
