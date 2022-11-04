import { motion, AnimatePresence } from 'framer-motion'
import Todo from './Todo'
import styles from './TodoList.module.css'

function TodoList({
  localTodosLength,
  todosLength,
  localStorTodos,
  todos,
  deleteTodo,
  toggleTodo,
  editCurTodoSession,
}) {
  return (
    <div className={styles.todoListContainer}>
      {!!localTodosLength && !todosLength && (
        <>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'tween', duration: 0.3, delay: 0.5 }}
            exit={{ opacity: 0, y: 20 }}
          >
            {`You still have ${localTodosLength} ${
              localTodosLength > 1 ? 'todos' : 'todo'
            } left`}
          </motion.h2>

          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'tween', duration: 0.3, delay: 1 }}
              exit={{ opacity: 0, y: 20 }}
            >
              {localStorTodos.map((localTodo) => (
                <Todo
                  key={localTodo.id}
                  localStorTodos={localStorTodos}
                  todo={localTodo}
                  deleteTodo={deleteTodo}
                  toggleTodo={toggleTodo}
                  editCurTodoSession={editCurTodoSession}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        </>
      )}

      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ type: 'tween', duration: 0.3 }}
          exit={{ opacity: 0 }}
        >
          {todos.map((todo) => (
            <Todo
              key={todo.id}
              todo={todo}
              deleteTodo={deleteTodo}
              toggleTodo={toggleTodo}
            />
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default TodoList