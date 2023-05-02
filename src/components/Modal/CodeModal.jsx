import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { RiShieldCheckFill, RiLoginBoxFill, RiSpam3Fill } from 'react-icons/ri'

// components
import Button from '../UI/Button'

// hooks
import { useLocalStorage } from '../../hooks/useLocalStorage'

// styles
import styles from './CodeModal.module.css'

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
  const [code, setCode] = useState(['', '', '', ''])
  const [verifyCode, setVerifyCode] = useState(['', '', '', ''])
  const [isRegister, setIsRegister] = useLocalStorage('isRegister', false)
  const [isCodeCreated, setIsCodeCreated] = useState(false)
  const [isMatchedCode, setIsMatchedCode] = useState(false)
  const [errorAttempts, setErrorAttempts] = useState({
    errorCount: 0,
    textCount: ['null', 'three', 'two'],
  })
  const [countdown, setCountdown] = useState(null)
  const onFocusModal = useRef(null)

  const isCodeLocalExists = useMemo(
    () => codeLocal.every((val) => val),
    [codeLocal]
  )
  const isCodesEqual = useMemo(
    () => codeLocal.every((val, idx) => val === verifyCode[idx]),
    [codeLocal, verifyCode]
  )

  const onChangeCodeHandler = (e, idx) => {
    const value = e.target.value
    const codeLength = [...code, value].join('').length

    setCode((prevCode) => {
      const newCode = [...prevCode]
      newCode[idx] = value
      return newCode
    })

    if (value === '' && idx > 0) {
      const input = e.target.previousSibling
      input.focus()
      input.select()
    }

    if (idx < 3 && value !== '') {
      const input = e.target.nextSibling
      input.focus()
      input.select()
    }

    if (idx > 3) {
      const input = e.target
      input.blur()
    }

    if (codeLength === 4) {
      const input = e.target
      input.blur()
    }
  }

  const onChangeVerifyCodeHandler = (e, idx) => {
    const value = e.target.value
    const verifyCodeLength = [...verifyCode, value].join('').length

    setVerifyCode((prevCode) => {
      const newCode = [...prevCode]
      newCode[idx] = value
      return newCode
    })

    if (value === '' && idx > 0) {
      const input = e.target.previousSibling
      input.focus()
      input.select()
    }

    if (idx < 3 && value !== '') {
      const input = e.target.nextSibling
      input.focus()
      input.select()
    }

    if (idx > 3) {
      const input = e.target
      input.blur()
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
      )

      let input = e.target
      while (input.previousSibling) input = input.previousSibling
      input && input.focus()

      setTimeout(() => {
        setVerifyCode(['', '', '', ''])
      }, 0)
    }
  }

  const onCreateCodeHandler = useCallback(() => {
    setCountdown(3)
    setCodeLocal(code)
  }, [code, setCodeLocal])

  useEffect(() => {
    let timerId

    if (countdown > 0) {
      timerId = setTimeout(() => {
        setCountdown(countdown - 1)
      }, 1000)
    }

    countdown === 0 && setIsRegister(true)

    return () => clearTimeout(timerId)
  }, [setIsRegister, countdown])

  useEffect(() => {
    onFocusModal.current && onFocusModal.current.focus()
  }, [isOpenModal])

  useEffect(() => {
    if (errorAttempts.errorCount === 4) {
      setIsBlocked(true)
      setTimeout(() => onCloseModal(), 1000)
    }

    if (isCodesEqual && isCodeCreated && isCodeLocalExists) {
      setErrorAttempts({
        errorCount: 0,
        textCount: ['null', 'three', 'two'],
      })
      setIsBlocked(false)
      setIsMatchedCode(true)
      setIsTempLoggedIn(true)

      setTimeout(() => onCloseModal(), 1000)

      setTimeout(() => {
        setIsTempLoggedIn(false)
        !isMatchedCode && setIsMatchedCode(false)
        setVerifyCode(['', '', '', ''])
        setCode(['', '', '', ''])
      }, 6000)
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
  ])

  const backgroundClickOverlayCloseHandler = (e) => {
    if (e.target === e.currentTarget) {
      onCloseModal()
      setIsCodeCreated(true)
      isCodeLocalExists && setIsRegister(true)
      setVerifyCode(['', '', '', ''])
      setCode(['', '', '', ''])
    }
  }

  useEffect(() => {
    isRegister && setIsCodeCreated(true)
    !isCodeLocalExists && setIsRegister(false)

    if (isCodeLocalExists) {
      setTimeout(() => {
        setIsRegister(true)
      }, countdown * 1000)
    }

    const escKeyDownOverlayCloseHandler = (e) => {
      if (e.key === 'Escape') {
        onCloseModal()
        setIsCodeCreated(true)
        isCodeLocalExists && setIsRegister(true)
        setVerifyCode(['', '', '', ''])
        setCode(['', '', '', ''])
      }
    }

    window.addEventListener('keydown', escKeyDownOverlayCloseHandler)

    return () => {
      window.removeEventListener('keydown', escKeyDownOverlayCloseHandler)
    }
  }, [
    countdown,
    isCodeLocalExists,
    isRegister,
    onCloseModal,
    setIsRegister,
    setIsTempLoggedIn,
  ])
  return (
    <>
      {isOpenModal && (
        <div
          className={styles.modalOverlay}
          onClick={backgroundClickOverlayCloseHandler}
        >
          <div tabIndex={0} ref={onFocusModal} className={styles.modalWindow}>
            {isRegister && !isTempLoggedIn && !isBlocked && (
              <>
                <h2>Login with code</h2>

                {!isCodesEqual &&
                  !!errorAttempts.errorCount &&
                  errorAttempts.errorCount <= 3 && (
                    <p className={styles.verifyAttemptsErrorText}>
                      Access to this feature will be restricted for you if you
                      make {errorAttempts.textCount[errorAttempts.errorCount]}{' '}
                      {errorAttempts.errorCount < 3 ? 'mistakes' : 'a mistake'}
                    </p>
                  )}

                <div className={styles.codeInput}>
                  {verifyCode.map((digit, idx) => (
                    <input
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

            {isBlocked && (
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, duration: 0.3 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    type: 'tween',
                    stiffness: 130,
                  }}
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 1.3, y: -40 }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      duration: 0.3,
                      y: 0,
                    }}
                    exit={{ opacity: 0 }}
                    transition={{
                      type: 'spring',
                      stiffness: 130,
                    }}
                  >
                    <RiSpam3Fill className={styles.blockedIcon} />
                  </motion.div>

                  <h2 className={styles.blockedText}>You've been blocked</h2>
                </motion.div>
              </AnimatePresence>
            )}

            {isRegister && isTempLoggedIn && (
              <>
                {isMatchedCode && (
                  <AnimatePresence>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1, duration: 0.3 }}
                      exit={{ opacity: 0 }}
                      transition={{
                        type: 'tween',
                        stiffness: 130,
                      }}
                    >
                      <motion.div
                        initial={{ opacity: 0, scale: 1.3, y: -40 }}
                        animate={{
                          opacity: 1,
                          scale: 1,
                          duration: 0.3,
                          y: 0,
                        }}
                        exit={{ opacity: 0 }}
                        transition={{
                          type: 'spring',
                          stiffness: 130,
                        }}
                      >
                        <RiLoginBoxFill className={styles.shieldCheckIcon} />
                      </motion.div>
                      <h2 className={styles.loggedInText}>Logged!</h2>
                    </motion.div>
                  </AnimatePresence>
                )}
              </>
            )}

            {!isCodeLocalExists && !isBlocked && (
              <h2>Create a code to use it</h2>
            )}

            {isCodeLocalExists && !isRegister && !isBlocked && (
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, duration: 0.3 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    type: 'tween',
                    stiffness: 130,
                  }}
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 1.3, y: -40 }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      duration: 0.3,
                      y: 0,
                    }}
                    exit={{ opacity: 0 }}
                    transition={{
                      type: 'spring',
                      stiffness: 130,
                    }}
                  >
                    <RiShieldCheckFill className={styles.shieldCheckIcon} />
                  </motion.div>

                  <h2>
                    <span className={styles.successText}>Success!</span>
                    <br /> Use this code to locking
                  </h2>
                </motion.div>
              </AnimatePresence>
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
                        isCodeLocalExists ? styles.codeInputSuccess : ''
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
                    countdown === 1 ? 'second' : 'seconds'
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
                        whileTap={{ scale: 0.9 }}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{
                          type: 'tween',
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
  )
}

export default Modal
