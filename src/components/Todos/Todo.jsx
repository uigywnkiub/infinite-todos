import { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    RiTodoLine,
    RiTodoFill,
    RiLockFill,
    RiLockUnlockLine,
    RiDeleteBin2Line,
    RiDeleteBin2Fill,
    RiCheckboxBlankLine,
    RiCheckboxFill,
    RiFileCopyFill,
} from "react-icons/ri";

// styles
import styles from "./Todo.module.css";

function Todo({ todo, deleteTodo, toggleTodo, secureTodo, isEditSession, openCodeModalHandler, isTempLoggedIn }) {
    const [isCopyTodo, setIsCopyTodo] = useState(false);

    const copyTodoHandler = useCallback(() => {
        !isCopyTodo && navigator.clipboard.writeText(todo.text);
        setIsCopyTodo(true);
        setTimeout(() => setIsCopyTodo(false), 1000);
    }, [isCopyTodo, todo.text]);

    const toggleSecureTodoHandler = useCallback(() => {
        !isTempLoggedIn && openCodeModalHandler();
        secureTodo(todo.id, todo.text);
    }, [isTempLoggedIn, openCodeModalHandler, secureTodo, todo.id, todo.text]);

    return (
        <div
            className={`${styles.todo} ${todo.isCompleted && styles.completedTodo} ${
                todo.isSecure && styles.removeLineThrough
            }`}
        >
            {!isCopyTodo ? (
                todo.isCompleted ? (
                    <RiTodoFill title="Click to copy" className={styles.todoIcon} />
                ) : (
                    <RiTodoLine title="Click to copy" onClick={copyTodoHandler} className={styles.todoIcon} />
                )
            ) : (
                <>
                    <RiFileCopyFill
                        title="Copied to clipboard"
                        onClick={copyTodoHandler}
                        className={styles.copiedIcon}
                    />
                </>
            )}

            <AnimatePresence>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ type: "tween", duration: 0.3 }}
                    exit={{ opacity: 0 }}
                    className={styles.todoText}
                >
                    {!isCopyTodo ? (
                        <motion.div
                            drag
                            dragElastic={0.2}
                            dragPropagation
                            dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
                            dragMomentum={true}
                            dragTransition={{ bounceStiffness: 200, bounceDamping: 20 }}
                            className={styles.grabCursor}
                        >
                            {todo.text}
                        </motion.div>
                    ) : (
                        <AnimatePresence>
                            <motion.div
                                initial={{ opacity: 0, x: -40 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ type: "spring", duration: 0.3 }}
                                exit={{ opacity: 1 }}
                                className={styles.copiedTodo}
                            >
                                Copied to clipboard!
                            </motion.div>
                        </AnimatePresence>
                    )}
                </motion.div>
            </AnimatePresence>

            {!isEditSession &&
                (!todo.isSecure ? (
                    <RiLockUnlockLine title="Lock" className={styles.lockIcon} onClick={toggleSecureTodoHandler} />
                ) : (
                    <RiLockFill title="Unlock" className={styles.lockIcon} onClick={toggleSecureTodoHandler} />
                ))}

            {!isEditSession &&
                (!todo.isCompleted ? (
                    <RiDeleteBin2Line
                        title="Remove"
                        className={styles.deleteIcon}
                        onClick={() => deleteTodo(todo.id)}
                    />
                ) : (
                    <RiDeleteBin2Fill className={styles.deleteIcon} onClick={() => deleteTodo(todo.id)} />
                ))}

            {todo.isCompleted ? (
                <RiCheckboxFill
                    title="Uncheck"
                    className={styles.checkIcon}
                    onClick={() => toggleTodo(todo.id, todo.text)}
                />
            ) : (
                <RiCheckboxBlankLine title="Check" className={styles.checkIcon} onClick={() => toggleTodo(todo.id)} />
            )}
        </div>
    );
}

export default Todo;
