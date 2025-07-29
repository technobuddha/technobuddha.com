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
        {history.map((message) => (
          <div className={clsx(css.message, message.announce && css.announce)} key={message.time}>
            <div
              className={css.color}
              style={{
                backgroundColor: message.color,
              }}
            />
            <div className={css.text}>{message.message}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
