import { useState, useEffect } from "react";

const useCounter = (forward = true) => {
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (forward) {
        setCounter((prevCounter) => prevCounter + 1);
      } else {
        setCounter((prevCounter) => prevCounter - 1);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [forward]);
  // here we are passing the forward variable as a dependency to the useEffect hook
  // so that the useEffect hook will run again if the forward variable changes in case
  // we change the direction of the counter

  return counter;
};
export default useCounter;
