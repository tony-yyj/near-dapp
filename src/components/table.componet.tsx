import React, {HTMLAttributes, ReactNode} from "react";
interface TableInterface<TValue> extends HTMLAttributes<HTMLDivElement>{
    value?: TValue;
    children?: ReactNode;
}
function Table<TValue>(props: TableInterface<TValue>) {
    const {children} = props;
    return (
        <div>
            {children}
        </div>
    )
}

interface RowInterface {
    children?: ReactNode;
}
function Row (props: RowInterface) {
    const {children} = props;
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
        }}>
            {children}
        </div>
    )
}


interface CellInterface{
    children?: ReactNode;
}
function Cell(props: CellInterface) {
    return (
        <div>
            {props.children}

        </div>
    )
}

interface HeaderInterface{
    children?: ReactNode;
}

function Header (props: HeaderInterface) {
    return (
        <div>
            {props.children}

        </div>
    )
}

Table.Row = Row;
Table.Cell = Cell;
Table.Header = Header

export default Table;

