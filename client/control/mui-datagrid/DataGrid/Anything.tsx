import React    from 'react';
import isArray  from 'lodash/isArray';
import isObject from 'lodash/isObject';
import Box      from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';

export type AnythingParams = {
    data:       unknown;
    children?:  never;
}

const useStyles = makeStyles(theme => ({
    array: {
        border: '1px solid #060',

        "& > *": {
            padding: theme.spacing(0.25),
        },
        "& > *:not(:last-child)": {
            borderBottom: '1px dashed #090',
        },
    },
    object: {
        border: '1px solid #006',

        "& > * > *": {
            padding: theme.spacing(0.25),
        },
        "& > *:not(:last-child)": {
            borderBottom: '1px dotted #009',
        },
        "& > * > *:not(:last-child)": {
            borderRight: '1px dotted #009'
        }
    }
}))

export function Anything({data}: AnythingParams) {
    const css = useStyles();

    if(isArray(data)) {
        return (
            <Box className={css.array} display="flex" flexDirection="column">
                {data.map((datum, index) => <Anything key={index} data={datum} />)}
            </Box>
        );
    } else if(isObject(data)) {
        return (
            <Box className={css.object} display="flex" flexDirection="column">
                {Object.entries(data).map(([key, value], index) => (
                    <Box key={index} width="100%" display="flex" flexDirection="row"><Box width="50%">{key}</Box><Box width="50%"><Anything data={value} /></Box></Box>
                ))}
            </Box>
        );
    }
    return <Box>{(data as any).toString()}</Box>
}
