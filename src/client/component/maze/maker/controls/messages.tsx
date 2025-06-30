import React from 'react';

import { type Runner } from '../runner.ts';

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

  React.useEffect(() => {
    runner?.maze.addEventListener('message', handleMessage);
    return () => {
      runner?.maze.removeEventListener('message', handleMessage);
    };
  }, [runner, handleMessage]);

  return (
    <div className={css.messages}>
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
  );
};
