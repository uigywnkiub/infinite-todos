import { useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { v4 as uuidv4 } from "uuid";

// redux actions
import { addTodo, toggleTodo, deleteTodo, deleteCompletedTodos, clearAllTodos } from "./redux/slices/todoSlice";

// components
import TodoTitle from "./components/Todos/TodoTitle";
import TodoForm from "./components/Todos/TodoForm";
import TodosActions from "./components/Todos/TodosActions";
import TodoList from "./components/Todos/TodoList";
import CodeModal from "./components/Modal/CodeModal";

// hooks
import { useLocalStorage } from "./hooks/useLocalStorage";

// styles
import "./App.css";
import NotifPopup from "./components/NotifPopup/NotifPopup";
import styles from "./components/Modal/CodeModal.module.css";

function App() {
    const dispatch = useDispatch();

    const [todos, setTodos] = useState([]);
    const [localStorTodos, setLocalStorTodos] = useLocalStorage("todos", []);
    const [localStorTodosText, setLocalStorTodosText] = useLocalStorage("todosSecureHelper", []);
    const [codeLocal, setCodeLocal] = useLocalStorage("secureCode", ["", "", "", ""]);
    const [isBlocked, setIsBlocked] = useLocalStorage("isBlocked", false);
    const [isEditSession, setIsEditSession] = useState(true);
    const [isAllTodosCompleted, setIsAllTodosCompleted] = useState(false);
    const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
    const [isTempLoggedIn, setIsTempLoggedIn] = useState(false);
    const [isWarning, setIsWarning] = useState(false);

    const openCodeModalHandler = useCallback(() => {
        setIsCodeModalOpen(true);
    }, []);

    const closeCodeModalHandler = useCallback(() => {
        setIsCodeModalOpen(false);
    }, []);

    // todos lengths
    const lengthCompletedTodos = todos.filter((todo) => todo.isCompleted).length;
    const lengthLocalStorTodos = localStorTodos.filter((el) => !el.isCompleted).length;
    const lengthTodos = todos.filter((el) => !el.isCompleted).length;

    const addTodoHandler = (text) => {
        setIsEditSession(false);

        const newTodo = {
            text,
            isCompleted: false,
            isSecure: false,
            id: uuidv4(),
        };
        const { id: idMatch } = newTodo;

        dispatch(addTodo(newTodo));
        setTodos([...todos, newTodo]);
        setLocalStorTodos([...todos, newTodo]);
        setLocalStorTodosText([...localStorTodosText, { text, idMatch }]);
    };

    // helpers
    const filterTodosHandlerById = (todosArray, id) => {
        return todosArray.filter((todo) => todo.id !== id);
    };
    const findTodosHandlerByFieldAndId = (todosArray, wantedField, id) => {
        return todosArray.find((todo) => todo[wantedField] === id);
    };

    const secureTodoHandler = (id, text) => {
        const replaceTextWithStars = (todo) => (todo = "•".repeat(todo.length));
        const matchedTodo = findTodosHandlerByFieldAndId(localStorTodosText, "idMatch", id);
        const updateTodosWithSecurityToggle = (todosArray) => {
            return todosArray.map((todo) =>
                todo.id === id
                    ? {
                          ...todo,
                          text: !todo.isSecure ? replaceTextWithStars(text) : matchedTodo.text,
                          isSecure: !todo.isSecure,
                      }
                    : { ...todo }
            );
        };

        if (isTempLoggedIn) {
            setTodos(updateTodosWithSecurityToggle(todos));
            setLocalStorTodos(updateTodosWithSecurityToggle(localStorTodos));
        }
    };

    const deleteTodoHandler = (id) => {
        const isSecure = findTodosHandlerByFieldAndId(localStorTodos, "id", id).isSecure;

        if (isSecure) {
            setIsWarning(true);
            setTimeout(() => setIsWarning(false), 1000);
            return;
        }

        dispatch(deleteTodo(id));
        setTodos(filterTodosHandlerById(todos, id));
        setLocalStorTodos(filterTodosHandlerById(localStorTodos, id));
    };

    const toggleTodoHandler = (id) => {
        const toggleTodos = (todosArray) => {
            return todosArray.map((todo) =>
                todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : { ...todo }
            );
        };

        dispatch(toggleTodo(id));
        setTodos(toggleTodos(todos));
        setLocalStorTodos(toggleTodos(localStorTodos));
    };

    const deleteCompletedTodosHandler = () => {
        const filterUnsecureCompletedTodos = (todosArray) => {
            return todosArray.filter((todo) => !todo.isCompleted || todo.isSecure);
        };

        dispatch(deleteCompletedTodos());
        setTodos(filterUnsecureCompletedTodos(todos));
        setLocalStorTodos(filterUnsecureCompletedTodos(todos));
    };

    const resetTodosHandler = () => {
        dispatch(clearAllTodos());
        setTodos([]);
        setLocalStorTodos([]);
        setLocalStorTodosText([]);
        setCodeLocal(["", "", "", ""]);
    };

    const editSessionHandler = () => {
        setIsEditSession((prev) => !prev);
        setTodos(localStorTodos.filter((todo) => todo.id !== todo));
    };

    const startSessionHandler = () => {
        setIsEditSession((prev) => !prev);
        resetTodosHandler();
        setIsBlocked(false);
    };

    useEffect(() => {
        const isFullyCompletedTodos = (todosArray) => {
            return todosArray.every((todo) => todo.isCompleted);
        };

        if (isFullyCompletedTodos(todos) && isFullyCompletedTodos(localStorTodos)) {
            setIsAllTodosCompleted(false);
        } else {
            setIsAllTodosCompleted(true);
        }
    }, [todos, localStorTodos]);
    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ type: "tween", duration: 0.3 }}
                className="App"
            >
                {isWarning && (
                    <div className={styles.modalOverlay}>
                        <div className={styles.modalWindow}>
                            <NotifPopup text="Unlock first!" warning />
                        </div>
                    </div>
                )}

                <TodoTitle />

                <TodoForm
                    localStorTodos={localStorTodos}
                    todos={todos}
                    addTodo={addTodoHandler}
                    isEditSession={isEditSession}
                />

                <CodeModal
                    isOpenModal={isCodeModalOpen}
                    onCloseModal={closeCodeModalHandler}
                    codeLocal={codeLocal}
                    setCodeLocal={setCodeLocal}
                    isTempLoggedIn={isTempLoggedIn}
                    setIsTempLoggedIn={setIsTempLoggedIn}
                    setIsBlocked={setIsBlocked}
                    isBlocked={isBlocked}
                />

                {!!todos.length && (
                    <TodosActions
                        resetTodos={resetTodosHandler}
                        deleteCompletedTodos={deleteCompletedTodosHandler}
                        lengthCompletedTodos={lengthCompletedTodos}
                    />
                )}

                <TodoList
                    localTodosLength={lengthLocalStorTodos}
                    todosLength={lengthTodos}
                    localStorTodos={localStorTodos}
                    lengthCompletedTodos={lengthCompletedTodos}
                    isAllTodosCompleted={isAllTodosCompleted}
                    todos={todos}
                    isEditSession={isEditSession}
                    deleteTodo={deleteTodoHandler}
                    toggleTodo={toggleTodoHandler}
                    secureTodo={secureTodoHandler}
                    openCodeModalHandler={openCodeModalHandler}
                    isTempLoggedIn={isTempLoggedIn}
                    editSession={editSessionHandler}
                    startSession={startSessionHandler}
                />
            </motion.div>
        </AnimatePresence>
    );
}

export default App;
