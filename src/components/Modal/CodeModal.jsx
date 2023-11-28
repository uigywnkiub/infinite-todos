import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback, useRef } from "react";

// components
import Button from "../UI/Button";

// hooks
import { useLocalStorage } from "../../hooks/useLocalStorage";

// styles
import styles from "./CodeModal.module.css";
import NotifPopup from "../NotifPopup/NotifPopup";

const Modal = ({
  isOpenModal,
  onCloseModal,
  codeLocal,
  setCodeLocal,
  isTempLoggedIn,
  setIsTempLoggedIn,
  setIsBlocked,
  isBlocked,
}) => {
  const [code, setCode] = useState(["", "", "", ""]);
  const [verifyCode, setVerifyCode] = useState(["", "", "", ""]);
  const [isRegister, setIsRegister] = useLocalStorage("isRegister", false);
  const [isCodeCreated, setIsCodeCreated] = useState(false);
  const [isMatchedCode, setIsMatchedCode] = useState(false);
  const [errorAttempts, setErrorAttempts] = useState({
    errorCount: 0,
    textCount: ["null", "three", "two"],
  });
  const [countdown, setCountdown] = useState(null);

  const modalRef = useRef(null);
  const btnRef = useRef(null);

  const isCodeLocalExists = codeLocal.every((val) => val);
  const isCodesEqual = codeLocal.every((val, idx) => val === verifyCode[idx]);

  const onChangeCodeHandler = useCallback(
    (e, idx) => {
      const value = e.target.value;
      const codeLength = [...code, value].join("").length;

      setCode((prevCode) => {
        const newCode = [...prevCode];
        newCode[idx] = value;
        return newCode;
      });

      if (value === "" && idx > 0) {
        const input = e.target.previousSibling;
        input.focus();
        input.select();
      }

      if (idx < 3 && value !== "") {
        const input = e.target.nextSibling;
        input.focus();
        input.select();
      }

      if (idx > 3) {
        const input = e.target;
        input.blur();
      }

      if (codeLength === 4) {
        const input = e.target;
        input.blur();

        // focus after node have been created
        setTimeout(() => {
          btnRef.current.focus();
        }, 0);
      }
    },
    [code]
  );

  const onChangeVerifyCodeHandler = useCallback(
    (e, idx) => {
      const value = e.target.value;
      const verifyCodeLength = [...verifyCode, value].join("").length;

      setVerifyCode((prevCode) => {
        const newCode = [...prevCode];
        newCode[idx] = value;
        return newCode;
      });

      if (value === "" && idx > 0) {
        const input = e.target.previousSibling;
        input.focus();
        input.select();
      }

      if (idx < 3 && value !== "") {
        const input = e.target.nextSibling;
        input.focus();
        input.select();
      }

      if (idx > 3) {
        const input = e.target;
        input.blur();
      }

      if (verifyCodeLength === 4) {
        setErrorAttempts((prev) =>
          prev.errorCount < 4
            ? {
                ...prev,
                errorCount: prev.errorCount + 1,
                textCount: [
                  ...prev.textCount,
                  prev.textCount[prev.errorCount - 1],
                ],
              }
            : prev
        );

        let input = e.target;
        while (input.previousSibling) input = input.previousSibling;
        input && input.focus();

        setTimeout(() => {
          setVerifyCode(["", "", "", ""]);
        }, 0);
      }
    },
    [verifyCode]
  );

  const onCreateCodeHandler = useCallback(() => {
    setCountdown(3);
    setCodeLocal(code);
  }, [code, setCodeLocal]);

  useEffect(() => {
    let timerId;

    if (countdown > 0) {
      timerId = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    }

    countdown === 0 && setIsRegister(true);

    return () => clearTimeout(timerId);
  }, [setIsRegister, countdown]);

  useEffect(() => {
    modalRef.current && modalRef.current.focus();
  }, [isOpenModal]);

  useEffect(() => {
    if (errorAttempts.errorCount === 4) {
      setIsBlocked(true);
      setTimeout(() => onCloseModal(), 1000);
    }

    if (isCodesEqual && isCodeCreated && isCodeLocalExists) {
      setErrorAttempts({
        errorCount: 0,
        textCount: ["null", "three", "two"],
      });
      setIsBlocked(false);
      setIsMatchedCode(true);
      setIsTempLoggedIn(true);

      setTimeout(() => onCloseModal(), 1000);

      setTimeout(() => {
        setIsTempLoggedIn(false);
        !isMatchedCode && setIsMatchedCode(false);
        setVerifyCode(["", "", "", ""]);
        setCode(["", "", "", ""]);
      }, 5000);
    }
  }, [
    codeLocal,
    verifyCode,
    isMatchedCode,
    onCloseModal,
    isCodesEqual,
    isCodeCreated,
    setIsTempLoggedIn,
    isCodeLocalExists,
    errorAttempts.errorCount,
    setIsBlocked,
  ]);

  const backgroundClickOverlayCloseHandler = useCallback(
    (e) => {
      if (e.target === e.currentTarget) {
        onCloseModal();
        setIsCodeCreated(true);
        isCodeLocalExists && setIsRegister(true);
        setVerifyCode(["", "", "", ""]);
        setCode(["", "", "", ""]);
      }
    },
    [isCodeLocalExists, onCloseModal, setIsRegister]
  );

  const escKeyDownOverlayCloseHandler = useCallback(
    (e) => {
      if (e.key === "Escape") {
        onCloseModal();
        setIsCodeCreated(true);
        isCodeLocalExists && setIsRegister(true);
        setVerifyCode(["", "", "", ""]);
        setCode(["", "", "", ""]);
      }
    },
    [isCodeLocalExists, onCloseModal, setIsRegister]
  );

  useEffect(() => {
    isRegister && setIsCodeCreated(true);
    !isCodeLocalExists && setIsRegister(false);

    if (isCodeLocalExists) {
      setTimeout(() => {
        setIsRegister(true);
      }, countdown * 1000);
    }

    window.addEventListener("keydown", escKeyDownOverlayCloseHandler);

    return () => {
      window.removeEventListener("keydown", escKeyDownOverlayCloseHandler);
    };
  }, [
    countdown,
    escKeyDownOverlayCloseHandler,
    isCodeLocalExists,
    isRegister,
    onCloseModal,
    setIsRegister,
    setIsTempLoggedIn,
  ]);
  return (
    <>
      {isOpenModal && (
        <div
          className={styles.modalOverlay}
          onClick={backgroundClickOverlayCloseHandler}
        >
          <div tabIndex={0} ref={modalRef} className={styles.modalWindow}>
            {isRegister && !isTempLoggedIn && !isBlocked && (
              <>
                <h2>Login with code</h2>

                {!isCodesEqual &&
                  !!errorAttempts.errorCount &&
                  errorAttempts.errorCount <= 3 && (
                    <p className={styles.verifyAttemptsErrorText}>
                      Access to this feature will be restricted for you if you
                      make{" "}
                      <span className={styles.attemptsText}>
                        {errorAttempts.textCount[errorAttempts.errorCount]}
                      </span>{" "}
                      {errorAttempts.errorCount < 3 ? "mistakes" : "a mistake"}
                    </p>
                  )}

                <div className={styles.codeInput}>
                  {verifyCode.map((digit, idx) => (
                    <input
                      tabIndex={0}
                      key={idx}
                      type="text"
                      pattern="^\d+$/"
                      inputMode="numeric"
                      maxLength="1"
                      value={digit}
                      onChange={(e) => onChangeVerifyCodeHandler(e, idx)}
                    />
                  ))}
                </div>

                {!errorAttempts.errorCount && (
                  <p>After success you have 5 seconds to locking</p>
                )}
              </>
            )}

            {isBlocked && <NotifPopup text="You've been blocked!" blocked />}

            {isRegister && isTempLoggedIn && isMatchedCode && (
              <NotifPopup text="Logged!" />
            )}

            {!isCodeLocalExists && !isBlocked && (
              <h2>Create a code to use it</h2>
            )}

            {isCodeLocalExists && !isRegister && !isBlocked && (
              <NotifPopup text="Success!" success />
            )}

            {!isRegister && !isBlocked && (
              <>
                <div className={styles.codeInput}>
                  {code.map((digit, idx) => (
                    <input
                      key={idx}
                      type="text"
                      pattern="^\d+$/"
                      inputMode="numeric"
                      maxLength="1"
                      disabled={isCodeLocalExists}
                      className={
                        isCodeLocalExists ? styles.codeInputSuccess : ""
                      }
                      value={digit}
                      onChange={(e) => onChangeCodeHandler(e, idx)}
                    />
                  ))}
                </div>

                {!!countdown && (
                  <p
                    className={styles.redirectText}
                  >{`Redirect to login in ${countdown} ${
                    countdown === 1 ? "second" : "seconds"
                  }`}</p>
                )}
              </>
            )}

            {!isCodeLocalExists && (
              <>
                {code.every((digit) => digit) && (
                  <Button title="Create code" onClick={onCreateCodeHandler}>
                    <AnimatePresence>
                      <motion.div
                        tabIndex={0}
                        ref={btnRef}
                        whileTap={{ scale: 0.9 }}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{
                          type: "tween",
                          stiffness: 130,
                        }}
                      >
                        Create
                      </motion.div>
                    </AnimatePresence>
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
