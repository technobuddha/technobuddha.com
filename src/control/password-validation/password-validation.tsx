import React from 'react';
import { Box } from '@mui/material';
import { empty, nbsp, zipperMerge } from '@technobuddha/library';
import { FaThumbsDown, FaThumbsUp } from 'react-icons/fa';

import { useAPI } from '#context/api';
import { useTranslation } from '#context/i18n';
import { useTheme } from '#context/mui';
import { PasswordField, Typography } from '#control';

import css from './password-validation.module.css';

type ValidationRule = {
  text: string;
  test(args: ValidationArgs): boolean;
};

type ValidationArgs = {
  score: number;
  password: string;
  lCount: number;
  uCount: number;
  dCount: number;
  sCount: number;
  cCount: number;
};

export type PasswordValidationProps = {
  readonly minLength?: number;
  readonly maxLength?: number;
  readonly strength?: 1 | 2 | 3 | 4;
  readonly uppercase?: number;
  readonly lowercase?: number;
  readonly digit?: number;
  readonly special?: number;
  readonly categories?: 2 | 3 | 4;
  readonly showInvalidOnly?: boolean;
  readonly userInputs?: string[];
  onChange?(this: void, password: string, valid: boolean): void;
};

export const PasswordValidation: React.FC<PasswordValidationProps> = ({
  minLength,
  maxLength,
  strength,
  uppercase,
  lowercase,
  digit,
  special,
  categories,
  showInvalidOnly,
  userInputs,
  onChange,
}) => {
  const { t } = useTranslation();
  const { authentication } = useAPI();
  const theme = useTheme();
  const [myPassword, setMyPassword] = React.useState(empty);
  const [passwordConfirmation, setPasswordConfirmation] = React.useState(empty);
  const [validPasswordConfirmation, setValidPasswordConfirmation] = React.useState(false);
  const [passwordScore, setPasswordScore] = React.useState(0);
  const [passwordWarning, setPasswordWarning] = React.useState(empty);
  const [pass, setPass] = React.useState<boolean[]>([]);

  const barColors = React.useMemo(
    () => [
      theme.palette.grey[200],
      theme.palette.error.main,
      theme.palette.warning.main,
      theme.palette.info.main,
      theme.palette.success.main,
    ],
    [theme],
  );
  const scoreWords = React.useMemo(
    () => [t('very weak'), t('weak'), t('average'), t('strong'), t('very strong')],
    [t],
  );
  const validationRules = React.useMemo(() => {
    const rules: ValidationRule[] = [];

    if (strength !== undefined) {
      rules.push({
        text:
          strength < 4 ?
            `${t('Password strength must be')} ${scoreWords[strength]} ${t('or better')}`
          : `${t('Password strength must be')} ${scoreWords[strength]}')}`,
        test: ({ score }) => score >= strength,
      });
    }

    if (minLength !== undefined) {
      if (maxLength === undefined) {
        rules.push({
          text: `${t('Password must be at least')} ${minLength} ${t('character', { count: minLength })} ${t('long')}.`,
          test: ({ password }) => password.length >= minLength,
        });
      } else {
        rules.push({
          text: `${t('Password must be between')} ${minLength} ${t('and')} ${maxLength} ${t('character', { count: maxLength })} ${t('long')}.`,
          test: ({ password }) => password.length >= minLength && password.length <= maxLength,
        });
      }
    } else if (maxLength !== undefined) {
      rules.push({
        text: `${t('Password must be shorter than')} ${maxLength} ${t('character', { count: maxLength })} ${t('long')}.`,
        test: ({ password }) => password.length <= maxLength,
      });
    }

    if (uppercase !== undefined) {
      rules.push({
        text: `${t('Password must contain at least')} ${uppercase} ${t('upper-case')} ${t('character', { count: uppercase })}`,
        test: ({ uCount }) => uCount >= uppercase,
      });
    }

    if (lowercase !== undefined) {
      rules.push({
        text: `${t('Password must contain at least')} ${lowercase} ${t('lower-case')} ${t('character', { count: lowercase })}`,
        test: ({ lCount }) => lCount >= lowercase,
      });
    }

    if (digit !== undefined) {
      rules.push({
        text: `${t('Password must contain at least')} ${digit} ${t('digit (0-9)')} ${t('character', { count: digit })}`,
        test: ({ dCount }) => dCount >= digit,
      });
    }

    if (special !== undefined) {
      rules.push({
        text: `${t('Password must contain at least')} ${special} ${t('special (!@#$%^& etc.)')} ${t('character', { count: special })}`,
        test: ({ sCount }) => sCount >= special,
      });
    }

    if (categories !== undefined) {
      rules.push({
        text: `${t('Password must contain characters from at least')} ${categories} ${t('category', { count: categories })} ${t('(upper-case, lower-case, digit, special)')}`,
        test: ({ cCount }) => cCount >= categories,
      });
    }

    return rules;
  }, [
    strength,
    minLength,
    maxLength,
    uppercase,
    lowercase,
    digit,
    special,
    categories,
    scoreWords,
    t,
  ]);

  const handlePasswordChange = React.useCallback((text: string): void => {
    setMyPassword(text);
  }, []);

  const handlePasswordConfirmationChange = React.useCallback((text: string): void => {
    setPasswordConfirmation(text);
  }, []);

  React.useEffect(() => {
    authentication
      .checkPasswordStrength(myPassword, userInputs)
      .then(({ score, warning }) => {
        const uCount = myPassword.match(/\p{Lu}/gu)?.length ?? 0;
        const lCount = myPassword.match(/\p{Ll}/gu)?.length ?? 0;
        const dCount = myPassword.match(/\p{N}/gu)?.length ?? 0;
        const sCount = myPassword.match(/[\p{P}\p{S}]/gu)?.length ?? 0;
        const cCount =
          (uCount > 0 ? 1 : 0) + (lCount > 0 ? 1 : 0) + (dCount > 0 ? 1 : 0) + (sCount > 0 ? 1 : 0);

        const test = validationRules.map((rule) =>
          rule.test({ score, password: myPassword, uCount, lCount, dCount, sCount, cCount }),
        );

        setPass(test);
        setPasswordScore(score);
        setPasswordWarning(warning);

        onChange?.(myPassword, validPasswordConfirmation && test.every(Boolean));
      })
      .catch((err) => {
        setPass([]);
        setPasswordScore(0);
        setPasswordWarning(err.toString());
      });
  }, [
    myPassword,
    validPasswordConfirmation,
    userInputs,
    onChange,
    authentication,
    validationRules,
  ]);

  const handleValidation = React.useCallback((valid: boolean): void => {
    setValidPasswordConfirmation(valid);
  }, []);

  return (
    <Box className={css.passwordValidation}>
      <PasswordField
        onChange={handlePasswordChange}
        label={t('Password')}
        helperText={`${t('Password is case-sensitive')}.`}
        value={myPassword}
        required
      />
      <PasswordField
        label={t('Verify Password')}
        onChange={handlePasswordConfirmationChange}
        onValidation={handleValidation}
        value={passwordConfirmation}
        helperText={validPasswordConfirmation ? nbsp : t('Passwords must match')}
        required
        validation={new RegExp(`^${RegExp.escape(myPassword)}$`, 'u')}
      />
      <Box className={css.validation}>
        {Boolean(strength) && (
          <Box className={css.strength}>
            <Box className={css.header}>
              <Box className={css.title}>
                <Typography variant="caption">{`${t('Password Strength')}:`}</Typography>
              </Box>
              <Box>
                <Typography variant="caption">{scoreWords[passwordScore]}</Typography>
              </Box>
            </Box>
            <Box className={css.meter}>
              <Box
                className={css.bar}
                bgcolor={passwordScore >= 1 ? barColors[passwordScore] : barColors[0]}
              />
              <Box
                className={css.bar}
                bgcolor={passwordScore >= 2 ? barColors[passwordScore] : barColors[0]}
              />
              <Box
                className={css.bar}
                bgcolor={passwordScore >= 3 ? barColors[passwordScore] : barColors[0]}
              />
              <Box
                className={css.bar}
                bgcolor={passwordScore >= 4 ? barColors[passwordScore] : barColors[0]}
              />
            </Box>
            <Box height={40}>
              {Boolean(passwordWarning) && (
                <Typography color="error" variant="caption">
                  {passwordWarning}
                </Typography>
              )}
            </Box>
          </Box>
        )}
        <Box className={css.rules}>
          {zipperMerge(validationRules, pass)
            .filter(([, ok]) => !showInvalidOnly && !ok)
            .map(([rule, ok], i) => (
              // eslint-disable-next-line react/no-array-index-key
              <React.Fragment key={i}>
                {ok ?
                  <FaThumbsUp className={css.good} />
                : <FaThumbsDown className={css.bad} />}
                <Typography variant="caption">{rule.text}</Typography>
              </React.Fragment>
            ))}
        </Box>
      </Box>
    </Box>
  );
};
