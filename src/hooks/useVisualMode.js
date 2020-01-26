import { useState } from "react";

export default function useVisualMode(initial) {
  const [ mode, setMode ] = useState(initial);
  const [ history, setHistory ] = useState([initial]);

  // when transition is called, we need to add the new mode
  // to our history

  function transition(newMode, replace = false) {
    const newHistory = [...history];
    if (replace) {
      newHistory.pop();
    }
    setHistory([...newHistory, newMode]);
    setMode(newMode);
  }

  // when back is called, we should set the mode to the
  // previous item in our history array

  function back() {
    if (history.length > 1) {
      const newHistory = [...history];
      newHistory.pop();
      setHistory(newHistory);
      setMode(newHistory[newHistory.length - 1]);
    }
  }

  return { mode, transition, back };
}