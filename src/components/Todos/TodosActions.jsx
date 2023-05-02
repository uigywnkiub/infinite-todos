import { motion, AnimatePresence } from 'framer-motion'
import {
  RiDeleteBin4Line,
  RiDeleteBin4Fill,
  RiDeleteBin3Fill,
} from 'react-icons/ri'
import { BiReset } from 'react-icons/bi'

// components
import Button from 'components/UI/Button'

// styles
import styles from 'components/Todos/TodosActions.module.css'

function TodosActions({
  resetTodos,
  deleteCompletedTodos,
  lengthCompletedTodos,
}) {
  return (
    <div className={styles.todosActionsContainer}>
      <Button title="Reset" onClick={resetTodos}>
        <AnimatePresence>
          <motion.div
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, scale: 0.5, rotate: 180 }}
            animate={{ opacity: 1, scale: 1, rotate: 360 }}
            exit={{ opacity: 0 }}
            transition={{
              type: 'spring',
              stiffness: 130,
            }}
            className={styles.todosActionsContainer}
          >
            <BiReset />
          </motion.div>
        </AnimatePresence>
      </Button>

      <Button
        title="Clear completed"
        onClick={deleteCompletedTodos}
        disabled={!lengthCompletedTodos}
      >
        <AnimatePresence>
          <motion.div
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
            animate={{ opacity: 1, scale: 1, rotate: -360 }}
            transition={{
              type: 'spring',
              stiffness: 130,
            }}
            className={styles.todosActionsContainer}
          >
            {!lengthCompletedTodos && <RiDeleteBin4Line />}

            {!!lengthCompletedTodos && lengthCompletedTodos < 3 && (
              <RiDeleteBin4Fill />
            )}

            {lengthCompletedTodos >= 3 && <RiDeleteBin3Fill />}
          </motion.div>
        </AnimatePresence>
      </Button>
    </div>
  )
}

export default TodosActions
