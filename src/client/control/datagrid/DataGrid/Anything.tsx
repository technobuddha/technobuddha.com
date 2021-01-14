import React           from 'react';
import { makeStyles }  from '@material-ui/core/styles';
import toDateUTCString from '@technobuddha/library/toDateUTCString';
import clsx            from 'clsx';
import isArray         from 'lodash/isArray';
import isEmpty         from 'lodash/isEmpty';
import isNil           from 'lodash/isNil';
import isObject        from 'lodash/isObject';
import toString        from 'lodash/toString';

import type { DataType } from './column';    // TODO data types should be moved!

export type AnythingParams = {
    className?: string;
    type?:      DataType;
    top?:       boolean;
    children:   unknown;
}

const useStyles = makeStyles(theme => ({
    array: {
        display: 'flex',
        flexDirection: 'row',

        "&:not($top) > *": {
            backgroundColor: theme.palette.divider,
        }
    },
    object: {
        display: 'flex',
        flexDirection: 'row',

        "&:not($top) > *": {
            backgroundColor: theme.palette.divider,
        }
    },
    member: {
        padding: `0 ${theme.spacing(0.25)}`,

        "&:not(:last-child)": {
            borderRight: `1px dashed ${theme.palette.divider}`,
        },
    },
    keyValue: {
        display: 'flex',
        flexDirection: 'column',

        "&:not(:last-child)": {
            borderRight: `1px dotted ${theme.palette.divider}`,
        },
    },
    key: {
        fontSize: '75%',
        fontStyle: 'italic',
    },
    value: {
        "&:not(:last-child)": {
            borderRight: `1px dotted ${theme.palette.divider}`,
        }
    },
    top: {
        
    },
    null: {

    },
    primitive: {
        paddingRight: theme.spacing(0.25),
        paddingLeft: theme.spacing(0.25),

        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',

        "&:not($member, $value)": {
            paddingTop: theme.spacing(0.25),
            paddingBottom: theme.spacing(0.25),
        },
    },
    left: {
        justifyContent: 'flex-start',
    },
    right: {
        justifyContent: 'flex-end',
    }
}));

export function Anything({children, type, className, top = true}: AnythingParams) {
    const css = useStyles();

    if(isNil(children) || (isObject(children) && isEmpty(children))) {
        return <div className={clsx(className, css.null, className)}>&nbsp;</div>;
    }

    if(isArray(children)) {
        return (
            <div className={clsx(css.array, className, top && css.top)}>
                {children.map((datum, index) => <Anything key={index} className={css.member} top={false}>{datum}</Anything>)}
            </div>
        );
    } else if(isObject(children)) {
        return (
            <div className={clsx(css.object, className, top && css.top)}>
                {Object.entries(children).map(([key, value]) => (
                    <div key={key} className={css.keyValue}>
                        <div className={css.key}>{key}</div>
                        <Anything className={css.value} top={false}>{value}</Anything>
                    </div>
                ))}
            </div>
        );
    }

    switch(type) {
        case 'number':
            return <div className={clsx(className, css.primitive, css.right)}>{toString(children)}</div>;
    
        case 'date':
            return <div className={clsx(className, css.primitive, css.left)}>{toDateUTCString(children)}</div>;

        default:
            return <div className={clsx(className, css.primitive, css.left)}>{toString(children)}</div>;
    }
}
