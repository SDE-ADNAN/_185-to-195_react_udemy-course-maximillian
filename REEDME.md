## -- Video 185 : Module introduction

What we will learn in this module

- How to build custom hooks
- how to reuse Login by creating custom hooks
- What are custom hooks and why we need them
- what are the rules of custom hooks
- what are the best practices of creating custom hooks

---

## -- Video 186 : What are "custom hooks"?

Qusetion: what are custom hooks and why we need them ?

Answer: Custom hooks are functions that allow us to reuse stateful logic between components. They are named with the prefix "use" and can call other hooks.

- advantages of using custom hooks
  - code reuse
  - logic reuse
  - easy to test
  - easy to maintain
  - can use hooks inside hooks which is not allowed in normal functions

---

## -- Video 187 : creating a custom react hook function

code form course:

```JSX
const { useState, useEffect } = require("react");
const { default: Card } = require("../components/Card");

const useCounter = () => {
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCounter((prevCounter) => prevCounter + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);
  return counter;
};
export default useCounter;

```

- create a new file in the src folder called useLocalStorage.js
- create a function called useLocalStorage
- create a state variable called storedValue
- create a function called setValue
- create a function called clearValue
- create a function called removeValue
- return the state variable and the functions
- export the function

code:

```JSX
import { useState } from 'react';

export const useLocalStorage = (key, initialValue) => {
    const [storedValue, setStoredValue] = useState(() => {
    try {
        const item = window.localStorage.getItem(key);
        return item ? JSON.parse(item) : initialValue;
    } catch (error) {
        console.log(error);
        return initialValue;
    }
    });

    const setValue = value => {
    try {
        const valueToStore =
        value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
        console.log(error);
        }
    };

    const clearValue = () => {
        try {
            setStoredValue(initialValue);
            window.localStorage.removeItem(key);
        } catch (error) {
            console.log(error);
        }
    };

    const removeValue = () => {
        try {
            window.localStorage.removeItem(key);
        } catch (error) {
            console.log(error);
        }
    };

    return [storedValue, setValue, clearValue, removeValue];
};

```

---

## -- Video 188 : using a custom react hook function

- what happens when we use a custom hook function

  - the function is called
  - the state variables are created
  - the useEffect hook is called
  - the function returns the state variables and the functions
  - the state variables and the functions are used in the component and attach to that component instance
  - if we use the same custom hook function in another component, the state variables and the functions are created again and attached to that component instance

### After using the useCounter custom hook function in the ForwardCounter.js file

```JSX
import useCounter from "../hooks/use-counter";

import Card from "./Card";

const ForwardCounter = () => {
  const counter = useCounter(0);

  return <Card>{counter}</Card>;
};

export default ForwardCounter;
```

before:

```JSX
import { useState, useEffect } from "react";

import Card from "./Card";

const ForwardCounter = () => {
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCounter((prevCounter) => prevCounter + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return <Card>{counter}</Card>;
};
```

### after using the useCounter our code got very clean and easy to read

- watch this video to get a better understanding of how custom hooks work

---
