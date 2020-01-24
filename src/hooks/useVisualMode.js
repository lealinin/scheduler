import { useState } from "react";

export default function useVisualMode(initial) {
  const [ mode, setMode ] = useState(initial);
  const [ history, setHistory ] = useState([initial]);

    // When transition is called, we need to add the new mode to our history.

  function transition(newMode, replace = false) {
    const newHistory = [...history];
    if (replace) {
      newHistory.pop();
    }
    setHistory([...newHistory, newMode]);
    setMode(newMode);
  }

  // Add a back() function to the Hook that allows us to go back to the previous mode. 
  // Be sure to add the back property to the object that useVisualMode returns.

  // When back is called, we should set the mode to the previous item in our history array.

  // Every time we add a mode to our history it goes to the top of the stack, this means to 
  // transition back to the previous mode, all we need to do is remove the last item from the stack, 
  // and then setMode with the last item in the array.

  // We need to put a constraint on our back function. It should not allow the user to go back past the initial mode. 
  // This means that our history array will always need to have a length that is great than 1. This test will confirm 
  // that navigating back from the initial mode will not change the mode value.

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