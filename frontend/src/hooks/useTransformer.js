import { useState, useCallback } from 'react'

export default function useTransformer(transform, options = {}) {
  const { treatWhitespaceAsEmpty = true } = options

  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')

  const run = useCallback(
    (value, overrideTransform) => {
      const text = String(value ?? '')
      const isEmpty = treatWhitespaceAsEmpty ? !text.trim() : text.length === 0

      setError('')
      if (isEmpty) {
        setOutput('')
        return
      }

      try {
        const fn = overrideTransform || transform
        setOutput(fn(text))
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err))
        setOutput('')
      }
    },
    [transform, treatWhitespaceAsEmpty]
  )

  const setInputAndRun = useCallback(
    (value, overrideTransform) => {
      setInput(value)
      run(value, overrideTransform)
    },
    [run]
  )

  const clear = useCallback(() => {
    setInput('')
    setOutput('')
    setError('')
  }, [])

  return {
    input,
    output,
    error,
    setInput,
    setOutput,
    setError,
    run,
    setInputAndRun,
    clear,
  }
}
