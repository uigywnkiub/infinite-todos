import { motion, AnimatePresence } from "framer-motion";
import { RiEdit2Fill } from "react-icons/ri";

// components
import Todo from "./Todo";
import Button from "../UI/Button";

// styles
import styles from "./TodosActions.module.css";

function TodoList({
    localTodosLength,
    todosLength,
    localStorTodos,
    lengthCompletedTodos,
    isAllTodosCompleted,
    todos,
    deleteTodo,
    toggleTodo,
    secureTodo,
    openCodeModalHandler,
    isTempLoggedIn,
    editSession,
    isEditSession,
    startSession,
}) {
    return (
        <>
            {isEditSession && !!!todosLength && (
                <>
                    <div className={styles.todosActionsContainer}>
                        <AnimatePresence>
                            <motion.div
                                whileTap={{ scale: 0.9 }}
                                initial={{ opacity: 0, y: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, y: 20 }}
                                transition={{
                                    type: "tween",
                                    stiffness: 130,
                                    duration: 0.3,
                                    delay: 0.5,
                                }}
                            >
                                {isEditSession && isAllTodosCompleted ? (
                                    <Button title="Edit current session" onClick={editSession}>
                                        <AnimatePresence>
                                            <motion.div
                                                whileTap={{ scale: 0.9 }}
                                                initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
                                                animate={{ opacity: 1, scale: 1, rotate: -360 }}
                                                transition={{
                                                    type: "spring",
                                                    stiffness: 130,
                                                }}
                                                className={styles.todosActionsContainer}
                                            >
                                                <RiEdit2Fill />
                                            </motion.div>
                                        </AnimatePresence>
                                    </Button>
                                ) : (
                                    <AnimatePresence>
                                        <motion.h2
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ type: "spring", duration: 0.3, delay: 0 }}
                                            exit={{ opacity: 0, y: 20 }}
                                        >
                                                     You can start a{" "}
                                            <span onClick={startSession} className={styles.startSessionLink}>
                                                new session
                                            </span>
                                        </motion.h2>
                                    </AnimatePresence>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    <AnimatePresence>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ type: "tween", duration: 0.3, delay: 1 }}
                            exit={{ opacity: 0, y: 20 }}
                        >
                            {localStorTodos.map((localTodo) => (
                                <Todo
                                    key={localTodo.id}
                                    todo={localTodo}
                                    deleteTodo={deleteTodo}
                                    toggleTodo={toggleTodo}
                                    isEditSession={isEditSession}
                                />
                            ))}
                        </motion.div>
                    </AnimatePresence>

                    {Object.keys(localStorTodos).length > 0 && (
                        <AnimatePresence>
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ type: "tween", duration: 0.3, delay: 1.5 }}
                                exit={{ opacity: 0, y: 20 }}
                            >
                                {`You still have ${localTodosLength} ${localTodosLength > 1 ? "todos" : "todo"} left`}
                            </motion.h2>
                        </AnimatePresence>
                    )}
                </>
            )}

            {!isEditSession && (
                <AnimatePresence>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ type: "tween", duration: 0.3 }}
                        exit={{ opacity: 0 }}
                    >
                        {todos.map((todo) => (
                            <Todo
                                key={todo.id}
                                todo={todo}
                                deleteTodo={deleteTodo}
                                toggleTodo={toggleTodo}
                                secureTodo={secureTodo}
                                openCodeModalHandler={openCodeModalHandler}
                                isTempLoggedIn={isTempLoggedIn}
                            />
                        ))}

                        <AnimatePresence>
                            {lengthCompletedTodos > 0 && (
                                <motion.h2
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ type: "tween", duration: 0.3, delay: 0.1 }}
                                    exit={{ opacity: 0, y: -20 }}
                                >
                                    {`You have completed ${lengthCompletedTodos} ${
                                        lengthCompletedTodos > 1 ? "todos" : "todo"
                                    }`}
                                </motion.h2>
                            )}
                        </AnimatePresence>

                        <AnimatePresence>
                            {!isAllTodosCompleted && lengthCompletedTodos > 0 && (
                                <motion.h2
                                    initial={{ opacity: 0, y: -40 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ type: "tween", duration: 0.3, delay: 0.2 }}
                                    exit={{ opacity: 0, y: -40 }}
                                >
                                    All tasks are completed
                                </motion.h2>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </AnimatePresence>
            )}
        </>
    );
}

export default TodoList;
