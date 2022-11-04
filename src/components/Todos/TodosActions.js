import { motion, AnimatePresence } from 'framer-motion'
import { RiDeleteBin6Line, RiDeleteBin6Fill } from 'react-icons/ri'
import { BiReset } from 'react-icons/bi'
import Button from '../UI/Button'
import styles from './TodosActions.module.css'

function TodosActions({
  resetTodos,
  deleteCompletedTodos,
  completedTodosExist,
}) {
  return (
    <div className={styles.todosActionsContainer}>
      <Button title="Reset" onClick={resetTodos}>
        <motion.div
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0, scale: 0.5, rotate: 180 }}
          animate={{ opacity: 1, scale: 1, rotate: 360 }}
          transition={{
            type: 'spring',
            stiffness: 120,
          }}
        >
          <BiReset />
        </motion.div>
      </Button>

      <Button
        title="Clear Completed"
        onClick={deleteCompletedTodos}
        disabled={!completedTodosExist}
      >
        <AnimatePresence>
          <motion.div
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
            animate={{ opacity: 1, scale: 1, rotate: -360 }}
            exit={{ opacity: 0 }}
            transition={{
              type: 'spring',
              stiffness: 120,
            }}
          >
            {completedTodosExist && <RiDeleteBin6Fill />}
            {!completedTodosExist && <RiDeleteBin6Line />}
          </motion.div>
        </AnimatePresence>
      </Button>
    </div>
  )
}

export default TodosActions