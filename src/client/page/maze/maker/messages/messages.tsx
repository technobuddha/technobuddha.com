import React from 'react';
import { Box, IconButton, Tooltip } from '@technobuddha/controls';
import { type MazeRunner, type MessageCallback, type MessageOptions } from '@technobuddha/maze';
import clsx from 'clsx';
import { IoTrash } from 'react-icons/io5';

import { Section } from '../section/index.ts';

import { MessagesHelp } from './messages.help.tsx';

import css from './messages.module.css' with { type: 'css' };

type History = {
  message: string;
  time: number;
} & MessageOptions;

type MessagesProps = {
  readonly runner: MazeRunner | undefined;
  readonly children?: never;
};

export const Messages: React.FC<MessagesProps> = ({ runner }) => {
  const boxRef = React.useRef<HTMLDivElement>(null);
  const [history, setHistory] = React.useState<History[]>([]);

  React.useEffect(() => {
    if (boxRef.current) {
      boxRef.current.scrollTop = boxRef.current.scrollHeight;
    }
  }, [history]);

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
    <Section title="Messages" className={css.messages} info={<MessagesHelp />}>
      <Box className={css.container}>
        <Box ref={boxRef} className={css.scroll}>
          {history.toReversed().map((message) => {
            switch (message.level) {
              case 'error': {
                return (
                  <Box key={message.time} className={clsx(css.message, css.error)}>
                    <Box>🚨</Box>
                    <Box className={css.text}>{message.message}</Box>
                  </Box>
                );
              }
              case 'warning': {
                return (
                  <Box key={message.time} className={clsx(css.message, css.warning)}>
                    <Box>⚠️</Box>
                    <Box className={css.text}>{message.message}</Box>
                  </Box>
                );
              }
              case 'info': {
                return (
                  <Box key={message.time} className={clsx(css.message, css.info)}>
                    <Box className={css.text}>{message.message}</Box>
                  </Box>
                );
              }

              case undefined:
              default: {
                return (
                  <Box key={message.time} className={clsx(css.message, css.colored)}>
                    <Box
                      className={css.color}
                      style={{
                        backgroundColor: message.color,
                      }}
                    />
                    <Box className={css.text}>{message.message}</Box>
                  </Box>
                );
              }
            }
          })}
        </Box>
        <Box className={css.tools}>
          <Tooltip title="Clear messages" placement="top">
            <IconButton onClick={handleClear}>
              <IoTrash />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Section>
  );
};
