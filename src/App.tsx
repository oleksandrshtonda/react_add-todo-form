//  React import's
import React, { useState } from 'react';
import './App.scss';

//  API data
import usersFromServer from './api/users';
import todosFromServer from './api/todos';

//  types
// import { Todo } from './types/Todo';
import { User } from './types/User';

//  components
import { TodoList } from './components/TodoList';

//  handlers
import { handleChooseUser } from './utils/handlers/handleChooseUser';
import { handleChangeInput } from './utils/handlers/handleChangeInput';

//  other utils
import { combineTodoAndUser } from './utils/combineTodoAndUser';
import { TodoWithUser } from './types/TodoWithUser';
import { handleOnSubmit } from './utils/handlers/handleOnSubmit';
import { Header } from './components/Header';
import { changeTheme } from './utils/changeTheme';
// import { changeTheme } from './utils/changeTheme';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<TodoWithUser[]>(
    combineTodoAndUser(todosFromServer, usersFromServer),
  );
  const [selectedUserId, setSelectedUserId] = useState<User['id']>(0);
  const [titleOfNewTodo, setTitleOfNewTodo] = useState<string>('');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  return (
    <div className={`App App--${theme}`}>
      <Header
        changeTheme={() => changeTheme(theme, setTheme)}
        theme={theme}
      />

      <div className={`App__form App__form--${theme}`}>
        <h1>Add todo form</h1>
        <form
          action="/api/todos"
          method="POST"
          onSubmit={(event) => handleOnSubmit(
            event,
            setTodos,
            todos,
            titleOfNewTodo,
            selectedUserId,
            usersFromServer,
            setSelectedUserId,
            setTitleOfNewTodo,
          )}
        >
          <div className={`field field--${theme}`}>
            <input
              type="text"
              data-cy="titleInput"
              onChange={(event) => handleChangeInput(event, setTitleOfNewTodo)}
              value={titleOfNewTodo}
            />
            <br />
            {!titleOfNewTodo && (
              <span className="error">Please enter a title</span>
            )}
          </div>
          <div className={`field field--${theme}`}>
            <select
              data-cy="userSelect"
              value={selectedUserId}
              onChange={(event) => handleChooseUser(event, setSelectedUserId)}
            >
              <option
                value="0"
                disabled
              >
                Choose a user
              </option>
              {usersFromServer.map(user => {
                return <option value={user.id}>{user.name}</option>;
              })}
            </select>
            <br />
            {selectedUserId === 0 && (
              <span className="error">Please choose a user</span>
            )}
          </div>
          <button
            className={`submitBtn submitBtn--${theme}`}
            type="submit"
            data-cy="submitButton"
          >
            Add
          </button>
        </form>
        <hr />
        <TodoList todos={todos} />
      </div>
    </div>
  );
};
