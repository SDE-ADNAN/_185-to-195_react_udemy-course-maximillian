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
