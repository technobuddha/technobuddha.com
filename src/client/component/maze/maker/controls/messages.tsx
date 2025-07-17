import React from 'react';
import { Tooltip } from '@mui/material';
import { IoTrash } from 'react-icons/io5';

import { type Runner } from '../../runner/runner.ts';

import css from './messages.module.css';

type MessagesProps = {
  readonly runner: Runner | undefined;
  readonly children?: never;
};

export const Messages: React.FC<MessagesProps> = ({ runner }) => {
  const [messages, setMessages] = React.useState<
    { message: string; color?: string; time: number }[]
  >([]);

  const handleMessage = React.useCallback((event: Event) => {
    if (event instanceof CustomEvent) {
      const message = {
        ...(event.detail as { message: string; color?: string }),
        time: Date.now(),
      };
      setMessages((prevMessages) => [message, ...prevMessages]);
    }
  }, []);

  const handleClear = React.useCallback(() => {
    setMessages([]);
  }, []);

  React.useEffect(() => {
    runner?.maze.addEventListener('message', handleMessage);
    return () => {
      runner?.maze.removeEventListener('message', handleMessage);
    };
  }, [runner, handleMessage]);

  return (
    <div className={css.messages}>
      <div className={css.header}>
        <div className={css.title}>Messages</div>
        <Tooltip title="Clear messages" placement="top">
          <button type="button" onClick={handleClear}>
            <IoTrash size="1em" />
          </button>
        </Tooltip>
      </div>
      <div className={css.scroll}>
        {messages.map((message) => (
          <div className={css.message} key={message.time}>
            <div
              className={css.color}
              style={{
                backgroundColor: message.color,
              }}
            />
            <div>{message.message}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
