import React    from 'react';
import clsx     from 'clsx';
import isArray  from 'lodash/isArray';
import isObject from 'lodash/isObject';
import isEmpty  from 'lodash/isEmpty';
import isNil    from 'lodash/isNil';
import toString from 'lodash/toString';

import { makeStyles } from '@material-ui/core/styles';

export type AnythingParams = {
    data:       unknown;
    top?:       boolean;
    children?:  never;
}

const useStyles = makeStyles(theme => ({
    array: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',

        "&$top": {
            margin: theme.spacing(-0.5),
            width: `calc(100% + ${theme.spacing(1)}px)`,
        },
        "&:not($top)": {
            backgroundColor: theme.palette.divider,
        },

        "& > div": {
            padding: theme.spacing(0.25),
            width: '100%',
            "&:not(:last-child)": {
                borderBottom: `1px dashed ${theme.palette.divider}`,
            },
        },
    },
    object: {
        borderCollapse: 'collapse',

        "&$top": {
            margin: theme.spacing(-0.5),
            width: `calc(100% + ${theme.spacing(1)}px)`,
        },
        "&:not($top)": {
            backgroundColor: theme.palette.divider,
            width: '100%',
        },
        
        "& > tbody ": {
            "& > tr": {
                "& > td": {
                    padding: theme.spacing(0.25),
                    "&:nth-child(1)": {
                        width: '25%',
                        borderRight: `1px dotted ${theme.palette.divider}`,
                    },
                    "&:nth-child(2)": {
                        width: '75%',
                    }
                },
                "&:not(:last-child)": {
                    borderBottom: `1px dotted ${theme.palette.divider}`,
                }
            }
        }
    },
    top: {

    },
}));

export function Anything({data, top = true}: AnythingParams) {
    const css = useStyles();

    if(isNil(data) || (isObject(data) && isEmpty(data))) {
        return <div>&nbsp;</div>;
    }

    if(isArray(data)) {
        return (
            <div className={clsx(css.array, top && css.top)}>
                {data.map((datum, index) => <Anything key={index} data={datum} top={false}/>)}
            </div>
        );
    } else if(isObject(data)) {
        return (
            <div>
                <table className={clsx(css.object, top && css.top)}>
                    <tbody>
                        {Object.entries(data).map(([key, value], index) => (
                            <tr key={index}><td>{key}</td><td><Anything data={value} top={false}/></td></tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }
    return <div>{toString(data)}</div>
}
