import { AnimatePresence, motion } from "framer-motion";

// styles
import styles from "./Button.module.css";

function Button(props) {
    const { children, disabled = false } = props;

    return (
        <>
            <AnimatePresence>
                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ type: "spring", stiffness: 130 }}
                    exit={{ opacity: 0 }}
                    {...props}
                    className={styles.button}
                    disabled={disabled}
                >
                    {children}
                </motion.button>
            </AnimatePresence>
        </>
    );
}

export default Button;
