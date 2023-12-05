import { motion, AnimatePresence } from "framer-motion";
import { RiShieldCheckFill, RiLoginBoxFill, RiSpam3Fill, RiErrorWarningFill } from "react-icons/ri";

// styles
import styles from "./NotifPopup.module.css";

function NotifPopup({ text, warning = false, blocked = false, success = false }) {
    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, duration: 0.3 }}
                exit={{ opacity: 0 }}
                transition={{
                    type: "spring",
                    duration: 0.3,
                    bounce: 0.3,
                    damping: 10,
                    stiffness: 130,
                }}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 1.3, y: -40 }}
                    animate={{
                        opacity: 1,
                        scale: 1,
                        y: 0,
                    }}
                    exit={{ opacity: 0 }}
                    transition={{
                        type: "spring",
                        duration: 0.3,
                        bounce: 0.3,
                        damping: 10,
                        stiffness: 130,
                    }}
                >
                    {!warning && !blocked && !success && (
                        <>
                            <RiLoginBoxFill className={styles.shieldCheckIcon} />
                            <h2 className={styles.loggedInText}>{text}</h2>
                        </>
                    )}
                    {warning && (
                        <>
                            <RiErrorWarningFill className={styles.warningIcon} />
                            <h2 className={styles.blockedText}>{text}</h2>
                        </>
                    )}
                    {blocked && (
                        <>
                            <RiSpam3Fill className={styles.blockedIcon} />
                            <h2 className={styles.blockedText}>{text}</h2>
                        </>
                    )}
                    {success && (
                        <>
                            <RiShieldCheckFill className={styles.shieldCheckIcon} />
                            <h2>
                                <span className={styles.successText}>{text}</span>
                                <br /> Use this code to locking
                            </h2>
                        </>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

export default NotifPopup;
