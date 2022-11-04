import { motion } from 'framer-motion'
import { FcTodoList } from 'react-icons/fc'
import styles from './TodoTitle.module.css'

function TodoTitle() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        type: 'spring',
        stiffness: 120,
      }}
      className={styles.TodoTitleContainer}
    >
      <motion.div
        initial={{ opacity: 0, rotateZ: -180 }}
        animate={{ opacity: 1, rotateZ: 0 }}
        transition={{
          type: 'spring',
          stiffness: 120,
        }}
      >
        <FcTodoList className={styles.titleIcon} />
      </motion.div>
      <h1 className={styles.title}>Infinite Todos</h1>
    </motion.div>
  )
}

export default TodoTitle