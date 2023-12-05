import { motion, AnimatePresence } from "framer-motion";
import { BiErrorCircle } from "react-icons/bi";
import { useCallback, useState } from "react";

// components
import Button from "../UI/Button";

// styles
import styles from "./TodoForm.module.css";

function TodoForm({ localStorTodos, todos, addTodo, isEditSession }) {
    const [text, setText] = useState("");

    const onChangeHandler = (e) => setText(e.target.value);

    const onSubmitHandler = useCallback(
        (e) => {
            e.preventDefault();

            if (text.length >= 25) return;
            if (text && text.replace(/\s+/g, "")) addTodo(text);

            setText("");
        },
        [addTodo, text]
    );

    return (
        <div className={styles.todoFormContainer}>
            {!isEditSession && (
                <form onSubmit={onSubmitHandler}>
                    <AnimatePresence>
                        <motion.input
                            tabIndex={1}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            whileFocus={{
                                scale: 1.05,
                                caretColor: "#90CAF9",
                            }}
                            initial={{ opacity: 0.5, x: -50, width: "30%" }}
                            animate={{ opacity: 1, x: 0, width: "40%" }}
                            exit={{ opacity: 0 }}
                            transition={{
                                type: "spring",
                                stiffness: 130,
                            }}
                            title={localStorTodos.length >= 0 && todos.length === 0 ? "Enter new todo" : "Keep adding"}
                            className={text.length >= 25 ? styles.checkInputText : styles.inputText}
                            placeholder={
                                localStorTodos.length >= 0 && todos.length === 0 ? "Enter new todo" : "Keep adding"
                            }
                            value={text}
                            onChange={(e) => onChangeHandler(e)}
                            maxLength="25"
                            autoComplete="off"
                            spellCheck="false"
                            type="text"
                        />
                    </AnimatePresence>

                    <AnimatePresence>
                        <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{
                                type: "spring",
                                stiffness: 130,
                            }}
                        >
                            <Button tabIndex={2} className={styles.button} title="Push to list" type="submit">
                                Push
                            </Button>
                        </motion.div>
                    </AnimatePresence>
                </form>
            )}

            {text.length >= 25 && (
                <motion.div
                    initial={{ opacity: 0, y: 0 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "tween", duration: 0.3 }}
                    className={styles.checkCharactersText}
                >
                    <BiErrorCircle />
                    <p>Too wordy</p>
                </motion.div>
            )}

            {/* {text.length !== 25 && !!text.length && (
                <motion.div
                    initial={{ opacity: 0, y: 0 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "tween", duration: 0.3 }}
                    className={styles.characterLimiter}
                >
                    <span>Character limiter</span>
                    <span></span>
                    <div>
                        <span>{text.length}</span>
                        <span> / </span>
                        <span className={styles.characterLimiterCount}>25</span>
                    </div>
                </motion.div>
            )} */}
        </div>
    );
}

export default TodoForm;
