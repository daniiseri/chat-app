import { useEffect, useState } from "react";

export function usePersistedState(key, initialValue) {
  const [state, setState] = useState()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const foundItem = localStorage.getItem(key)

      if (!foundItem) {
        setState(initialValue)
        localStorage.setItem(key, JSON.stringify(initialValue))
      } else {
        setState(JSON.parse(foundItem))
      }
    }
  }, [])

  function setPersistedState(newSate) {
    if (typeof window !== 'undefined') {
      setState(newSate)
      localStorage.setItem(key, JSON.stringify(newSate))
    }
  }

  return [state, setPersistedState]
}