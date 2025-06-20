import React from 'react';
import { memoize } from 'lodash-es';

import { Checkbox } from '#control';

import { type Human } from '../../solver/index.ts';

import { type Runner } from '../runner.ts';

import css from './human-options.module.css';

type HumanOptionsProps = {
  readonly runner: Runner | undefined;
  readonly children?: never;
};

type HumanOptions = Human['options'];

export const HumanOptions: React.FC<HumanOptionsProps> = ({ runner }) => {
  const [options, setOptions] = React.useReducer(
    (state, action: keyof HumanOptions | HumanOptions) => {
      if (state) {
        const o = typeof action === 'string' ? { ...state, [action]: !state[action] } : action;

        if (runner) {
          (runner.solver as Human).options = o;
        }
        return o;
      }
      if (typeof action === 'object') {
        if (runner) {
          (runner.solver as Human).options = action;
        }
        return { ...action };
      }
      return state;
    },
    (runner?.solver as Human | undefined)?.options,
  );

  React.useEffect(() => {
    if (runner) {
      setOptions((runner.solver as Human).options);
    } else {
      setOptions({
        finalDestination: true,
        markVisited: true,
        markDeadEnds: true,
        hideReverse: true,
      });
    }
  }, [runner]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleChange = React.useCallback(
    memoize((key: keyof HumanOptions) => (_checked: boolean) => {
      setOptions(key);
    }),
    [runner],
  );

  return (
    <div className={css.humanOptions}>
      <Checkbox
        label="Final Destination"
        checked={options?.finalDestination}
        onChange={handleChange('finalDestination')}
      />
      <Checkbox
        label="Mark Visited"
        checked={options?.markVisited}
        onChange={handleChange('markVisited')}
      />
      <Checkbox
        label="Mark Dead Ends"
        checked={options?.markDeadEnds}
        onChange={handleChange('markDeadEnds')}
      />
      <Checkbox
        label="Hide Reverse"
        checked={options?.hideReverse}
        onChange={handleChange('hideReverse')}
      />
    </div>
  );
};
