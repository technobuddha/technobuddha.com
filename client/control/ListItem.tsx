// import React                                                from 'react';
// import MuiListItem, { ListItemProps as MuiListItemProps }   from '@material-ui/core/ListItem';

// export type ListItemProps = Omit<MuiListItemProps, 'onClick'>;

// export const ListItem: React.FC<ListItemProps> = (props: ListItemProps) => {
//     const { onClick, ...muiProps } = props;

//     const handleClick = (_event: React.MouseEvent<HTMLDivElement, MouseEvent>) => onClick?.();

//     return (<MuiListItem onClick={handleClick} {...muiProps} />)
// }

// export default ListItem;