import React from 'react';
import clsx from 'clsx';
import { IoTrash } from 'react-icons/io5';

import { IconButton, Tooltip } from '#control';
import { type MessageCallback, type MessageOptions } from '#maze/random';
import { type Runner } from '#maze/runner';

import css from './messages.module.css';

type History = {
  message: string;
  time: number;
} & MessageOptions;

type MessagesProps = {
  readonly runner: Runner | undefined;
  readonly children?: never;
};

export const Messages: React.FC<MessagesProps> = ({ runner }) => {
  const [history, setHistory] = React.useState<History[]>([]);

  const handleMessage = React.useCallback<MessageCallback>((message, props) => {
    const historic = { message, ...props, time: Date.now() };
    setHistory((prevMessages) => [historic, ...prevMessages]);
  }, []);

  const handleClear = React.useCallback(() => {
    setHistory([]);
  }, []);

  React.useEffect(() => {
    runner?.maze.listenMessages(handleMessage);
    return () => {
      runner?.maze.ignoreMessages(handleMessage);
    };
  }, [runner, handleMessage]);

  return (
    <div className={css.messages}>
      <div className={css.header}>
        <div className={css.title}>Messages</div>
        <Tooltip title="Clear messages" placement="top">
          <IconButton onClick={handleClear}>
            <IoTrash />
          </IconButton>
        </Tooltip>
      </div>
      <div className={css.scroll}>
        {history.map((message) => {
          switch (message.level) {
            case 'error': {
              return (
                <div key={message.time} className={clsx(css.message, css.error)}>
                  <div>🚨</div>
                  <div className={css.text}>{message.message}</div>
                </div>
              );
            }
            case 'warning': {
              return (
                <div key={message.time} className={clsx(css.message, css.warning)}>
                  <div>⚠️</div>
                  <div className={css.text}>{message.message}</div>
                </div>
              );
            }
            case 'info': {
              return (
                <div key={message.time} className={clsx(css.message, css.info)}>
                  <div className={css.text}>{message.message}</div>
                </div>
              );
            }

            default: {
              return (
                <div key={message.time} className={css.message}>
                  <div
                    className={css.color}
                    style={{
                      backgroundColor: message.color,
                    }}
                  />
                  <div className={css.text}>{message.message}</div>
                </div>
              );
            }
          }
        })}
      </div>
    </div>
  );
};
