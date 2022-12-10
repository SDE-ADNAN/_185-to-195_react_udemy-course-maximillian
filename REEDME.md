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

# -- Video 189 : Configuring custom hooks

- what are the rules of custom hooks
  - only call hooks at the top level
  - only call hooks from react functions

before using useCounter hook in backwordCounter.js

```JSX
import { useState, useEffect } from "react";

import Card from "./Card";

const BackwardCounter = () => {
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCounter((prevCounter) => prevCounter - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return <Card>{counter}</Card>;
};

export default BackwardCounter;
```

after using useCounter hook in backwordCounter.js

```JSX
import useCounter from "../hooks/use-counter";

import Card from "./Card";

const BackwardCounter = () => {
  const counter = useCounter(0);

  return <Card>{counter}</Card>;
};
```

# We updated the logic of useCounter hook to make it reusable in both forward and backward counter

```JSX
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

```

---

## --Video 190: Onwards to a more realistic example

- here we downloaded and added the 04-onwards-to-a-more-realistic-example project
- downloaded the dependencies for the new project
- now from 190 to 195 all videos are done in the new project"
- created a new project on firebase
- created a realtime database for storing tasks data
- we will use this get and post requests more efficiently in the App.js and taskForm.js , by creating a custom hook. that increases the reusability of our get and post requests.

---

## --Video 191: Building a custom http hook

- created the 1st version of our custom hook

code:

```JSX
import { useState } from "react";

const useHttp = (requestConfig, applydata) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const sendRequest = async (taskText) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(requestConfig.url, {
        method: requestConfig.method,
        headers: requestConfig.headers,
        body: JSON.stringify(requestConfig.body),
      });

      if (!response.ok) {
        throw new Error("Request failed!");
      }

      const data = await response.json();
      applydata(data);
    } catch (err) {
      setError(err.message || "Something went wrong!");
    }
    setIsLoading(false);
  };
  return {
    isLoading,
    error,
    sendRequest,
  };
};
export default useHttp;
```

---

## --Video 192 : Using the custom http hook

- now we will use our custom http hook for fetching and posting data "

- updated the useHttp hook for default options

code :

```Js
import { useState } from "react";

const useHttp = (requestConfig, applydata) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const sendRequest = async (taskText) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(requestConfig.url, {
        method: requestConfig.method ? requestConfig.method : "GET",
        headers: requestConfig.headers ? requestConfig.headers : {},
        body: requestConfig.body ? JSON.stringify(requestConfig.body) : null,
      });

      if (!response.ok) {
        throw new Error("Request failed!");
      }

      const data = await response.json();
      applydata(data);
    } catch (err) {
      setError(err.message || "Something went wrong!");
    }
    setIsLoading(false);
  };
  return {
    isLoading,
    error,
    sendRequest,
  };
};
export default useHttp;

```

- Used the useHttp hook in appjs

code :

```JS
import React, { useEffect, useState } from "react";

import Tasks from "./components/Tasks/Tasks";
import NewTask from "./components/NewTask/NewTask";
import useHttp from "./hooks/use-http";

function App() {
  const [tasks, setTasks] = useState([]);

  const transformTasks = (tasksObj) => {
    const loadedTasks = [];

    for (const taskKey in tasksObj) {
      loadedTasks.push({ id: taskKey, text: tasksObj[taskKey].text });
    }

    setTasks(loadedTasks);
  };
  const {
    isLoading,
    error,
    sendRequest: fetchTasks,
  } = useHttp(
    {
      url: "https://custom-hook-todos-default-rtdb.firebaseio.com/tasks.json",
    },
    transformTasks
  );

  useEffect(() => {
    fetchTasks();
  }, []);

  const taskAddHandler = (task) => {
    setTasks((prevTasks) => prevTasks.concat(task));
  };

  return (
    <React.Fragment>
      <NewTask onAddTask={taskAddHandler} />
      <Tasks
        items={tasks}
        loading={isLoading}
        error={error}
        onFetch={fetchTasks}
      />
    </React.Fragment>
  );
}

export default App;

```

- before using our custom hook app.js was like this

```JS
import React, { useEffect, useState } from 'react';

import Tasks from './components/Tasks/Tasks';
import NewTask from './components/NewTask/NewTask';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async (taskText) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        'https://custom-hook-todos-default-rtdb.firebaseio.com/tasks.json'
      );

      if (!response.ok) {
        throw new Error('Request failed!');
      }

      const data = await response.json();

      const loadedTasks = [];

      for (const taskKey in data) {
        loadedTasks.push({ id: taskKey, text: data[taskKey].text });
      }

      setTasks(loadedTasks);
    } catch (err) {
      setError(err.message || 'Something went wrong!');
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const taskAddHandler = (task) => {
    setTasks((prevTasks) => prevTasks.concat(task));
  };

  return (
    <React.Fragment>
      <NewTask onAddTask={taskAddHandler} />
      <Tasks
        items={tasks}
        loading={isLoading}
        error={error}
        onFetch={fetchTasks}
      />
    </React.Fragment>
  );
}

export default App;

```

---

## --Video 193: Adjusting the custom hook logic

- here we just used the useCallback hook to avoid recreation of functions like transform tasks and fetch tasks .
- but avoided the use of usecallback hook with help of passing the parameters of url and applydata function in the fetchdata function so that we are not needed to add every thing in dependencies array.

code:

for App.js where we use the useHttp custom hook

```JS
import React, { useCallback, useEffect, useState } from "react";

import Tasks from "./components/Tasks/Tasks";
import NewTask from "./components/NewTask/NewTask";
import useHttp from "./hooks/use-http";

function App() {
  const [tasks, setTasks] = useState([]);

  const { isLoading, error, sendRequest: fetchTasks } = useHttp();

  useEffect(() => {
    const transformTasks = (tasksObj) => {
      const loadedTasks = [];

      for (const taskKey in tasksObj) {
        loadedTasks.push({ id: taskKey, text: tasksObj[taskKey].text });
      }

      setTasks(loadedTasks);
    };
    fetchTasks(
      {
        url: "https://custom-hook-todos-default-rtdb.firebaseio.com/tasks.json",
      },
      transformTasks
    );
  }, [fetchTasks]);

  const taskAddHandler = (task) => {
    setTasks((prevTasks) => prevTasks.concat(task));
  };

  return (
    <React.Fragment>
      <NewTask onAddTask={taskAddHandler} />
      <Tasks
        items={tasks}
        loading={isLoading}
        error={error}
        onFetch={fetchTasks}
      />
    </React.Fragment>
  );
}

export default App;

```

code for useHttp.js

```js
import { useCallback, useState } from "react";

const useHttp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const sendRequest = useCallback(async (requestConfig, applydata) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(requestConfig.url, {
        method: requestConfig.method ? requestConfig.method : "GET",
        headers: requestConfig.headers ? requestConfig.headers : {},
        body: requestConfig.body ? JSON.stringify(requestConfig.body) : null,
      });

      if (!response.ok) {
        throw new Error("Request failed!");
      }

      const data = await response.json();
      applydata(data);
    } catch (err) {
      setError(err.message || "Something went wrong!");
    }
    setIsLoading(false);
  }, []);
  return {
    isLoading,
    error,
    sendRequest,
  };
};
export default useHttp;
```

## --Video 194: using the custom hook in more hooks

- here we used the useHttp custom hook in the newtask.js component

- and learned about function.bind() method via link below
- https://academind.com/tutorials/function-bind-event-execution

code for newtask.js

```js
import useHttp from "../../hooks/use-http";

import Section from "../UI/Section";
import TaskForm from "./TaskForm";

const NewTask = (props) => {
  const [isLoading, error, sendRequest] = useHttp();

  const createTask = (taskText, taskData) => {
    const generatedId = taskData.name; // firebase-specific => "name" contains generated id
    const createdTask = { id: generatedId, text: taskText };
    props.onAddTask(createdTask);
  };

  const enterTaskHandler = async (taskText) => {
    sendRequest(
      {
        url: "https://react-http-6b4a6.firebaseio.com/tasks.json",
        method: "POST",
        body: { text: taskText },
        headers: {
          "Content-Type": "application/json",
        },
      },
      createTask.bind(null, taskText)
    );
  };

  return (
    <Section>
      <TaskForm onEnterTask={enterTaskHandler} loading={isLoading} />
      {error && <p>{error}</p>}
    </Section>
  );
};

export default NewTask;
```
