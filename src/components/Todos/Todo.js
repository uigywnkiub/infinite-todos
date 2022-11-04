import { motion, AnimatePresence } from 'framer-motion'
import {
  RiTodoFill,
  RiTodoLine,
  RiDeleteBin2Fill,
  RiDeleteBin2Line,
  RiEdit2Fill,
  RiCheckboxLine,
  RiCheckboxFill,
} from 'react-icons/ri'
import styles from './Todo.module.css'

function Todo({
  localStorTodos,
  todo,
  deleteTodo,
  toggleTodo,
  editCurTodoSession,
}) {
  return (
    <div
      className={`${styles.todo} ${
        todo.isCompleted ? styles.completedTodo : ''
      }`}
    >
      {todo.isCompleted && (
        <RiTodoFill
          title="Click to copy"
          onClick={() => navigator.clipboard.writeText(todo.text)}
          className={styles.todoIcon}
        />
      )}

      {!todo.isCompleted && (
        <RiTodoLine
          title="Click to copy"
          onClick={() => navigator.clipboard.writeText(todo.text)}
          className={styles.todoIcon}
        />
      )}

      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ type: 'tween', duration: 0.3 }}
          exit={{ opacity: 0 }}
          className={styles.todoText}
        >
          {todo.text}
        </motion.div>
      </AnimatePresence>

      {localStorTodos && !todo.isCompleted && (
        <RiEdit2Fill
          title="Edit current session"
          className={styles.editIcon}
          onClick={editCurTodoSession}
        />
      )}

      {!todo.isCompleted ? (
        <RiDeleteBin2Line
          title="Remove"
          className={styles.deleteIcon}
          onClick={() => deleteTodo(todo.id)}
        />
      ) : (
        <RiDeleteBin2Fill
          title="Remove"
          className={styles.deleteIcon}
          onClick={() => deleteTodo(todo.id)}
        />
      )}

      {!todo.isCompleted ? (
        <RiCheckboxLine
          title="Check"
          className={styles.checkIcon}
          onClick={() => toggleTodo(todo.id)}
        />
      ) : (
        <RiCheckboxFill
          title="Check"
          className={styles.checkIcon}
          onClick={() => toggleTodo(todo.id)}
        />
      )}
    </div>
  )
}

export default Todo