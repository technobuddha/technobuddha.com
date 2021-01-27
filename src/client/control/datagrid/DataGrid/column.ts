import type React from 'react';
import type { HeaderClasses, HeaderStyles } from './columnStyles';

export type Column<T = unknown>  = {
    name:       string;
    width:      ColumnWidth;
    header:     (args: ColumnHeaderProps<T>) => React.ReactElement;
    render:     (args: ColumnRenderProps<T>) => React.ReactElement;
    sortBy:     null | (ColumnName[]);
    collate:    (ascending: boolean) => (x: T, y: T) => number;
};

export type ColumnName  = string | number;
export type ColumnWidth = number | '*' | '1*' | '2*' | '3*' | '4*' | '5*' | '6*' | '7*' | '8*' | '9*' | '10*' | '11*' | '12*';

export type ColumnRenderProps<T = unknown> = {
    datum:          T;
    classes?:       Record<string, string>;
    styles?:        Record<string, React.CSSProperties>;
};

export type ColumnHeaderProps<T = unknown> = {
    data:           T[];
    classes?:       HeaderClasses;
    styles?:        HeaderStyles;
};

export type SortProperties = { sortBy: string; sortAscending: boolean };

export type DataType = 'string' | 'number' | 'date' | 'object' | 'array' | 'unknown';
export type ColumnType = {
    dataType:   DataType;
    nullable:   boolean;
};

export type ColumnSpecifications<T = unknown> = ColumnSpecification<T>[];
export type ColumnSpecification<T = unknown>  = {
    name:       ColumnName;
    type?:      DataType | ColumnType;
    width?:     Column<T>['width'];
    header?:    string | Column<T>['header'];
    render?:    Column<T>['render'];
    sortBy?:    null | ColumnName[];
    collate?:   Column<T>['collate'];
};

export default Column;
