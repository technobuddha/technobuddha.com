import React                    from 'react';
import useTranslation           from '#context/i18n';
import isNil                    from 'lodash/isNil';
import Box                      from '@material-ui/core/Box';
import Typography               from '@material-ui/core/Typography';
import useAPI                   from '#context/api';

type PasswordFieldProps =
    {
        password:       string;
        barColors?:     [string, string, string, string, string];
        scoreWords?:    [string, string, string, string, string];
        minLength?:     number | null;
        maxLength?:     number | null; 
        strength?:      number | null,   
        userInputs?:    string[];
        onChange?:      (valid: boolean) => void;
    };

export const PasswordValidation: React.FC<PasswordFieldProps> = (props: PasswordFieldProps) => {
    const {t}                   = useTranslation();
    const {authentication}      = useAPI();
    const [state, setState]     = React.useState<{score: number, warning: string}>({score: 0, warning: ''});

    React.useEffect(
        () => {
            const {minLength: min, maxLength: max} = props;

            if(!isNil(min) && props.password.length < min) {
                setState({
                    score:          0,
                    warning:        isNil(max)
                                    ?   `${t('Passwords must be at least')} ${min} ${t('character', { count: min })} ${t('long.')}}`
                                    :   `${t('Passwords must be between')} ${min} ${t('and')} ${max} ${t('character', { count: max })} ${t('long.')}`,
                });

                if(props.onChange) props.onChange(false);
            } else if(!isNil(max) && props.password.length > max) {
                setState({
                    score:          0,
                    warning:        isNil(min)
                                    ?   `${t('Passwords must be shorter than')} ${max} ${t('character', { count: max })} ${t('long.')}`
                                    :   `${t('Passwords must be between')} ${min} ${t('and')} ${max} ${t('character', { count: max })} ${t('long.')}`,
                });

                if(props.onChange) props.onChange(false);
            } else {
                authentication.checkPasswordStrength(props.password, props.userInputs)
                .then(value => {
                    const score = value.payload.score;

                    setState({score, warning: t(value.payload.warning)});
                    props.onChange?.(isNil(props.strength) || score >= props.strength)
                });
            }
        },
        [props.password]
    );

    return (
        <Box marginTop={0.5} marginX={2}>
            <Box display="flex" flexDirection="row">
                <Box flexGrow={1}>
                    <Typography variant="caption">
                        {t('Password Strength:')}
                    </Typography>
                </Box>
                <Box>
                    <Typography variant="caption">
                        {t(props.scoreWords![state.score])}
                    </Typography>
                </Box>
            </Box>
            <Box display="flex" flexDirection="row" height={10}>
                <Box flexGrow={1} marginRight={1} border="1px solid black" bgcolor={(state.score >= 1) ? props.barColors![state.score] : props.barColors![0]} />
                <Box flexGrow={1} marginRight={1} border="1px solid black" bgcolor={(state.score >= 2) ? props.barColors![state.score] : props.barColors![0]} />
                <Box flexGrow={1} marginRight={1} border="1px solid black" bgcolor={(state.score >= 3) ? props.barColors![state.score] : props.barColors![0]} />
                <Box flexGrow={1} marginRight={0} border="1px solid black" bgcolor={(state.score >= 4) ? props.barColors![state.score] : props.barColors![0]} />
            </Box>
            <Box height={20}>
                {
                    state.warning &&
                    <Typography color="error" variant="caption" component="div">
                        {state.warning}
                    </Typography>
                }
            </Box>
        </Box>
    );
}

PasswordValidation.defaultProps = {
    barColors:      ['#dddddd', '#ef4836', '#f6b44d', '#2b90ef', '#25c281'],
    scoreWords:     ['very weak', 'weak', 'average', 'strong', 'very strong'],
}

export default PasswordValidation;
