/*!
 * @copyright Card Librarian Team 2020
 */

import * as React from 'react';
import { Column, useTable } from 'react-table';

interface ITable<T extends object> {
    columns: Array<Column<T>>;
    data: T[];
}

/**
 * Render a generic table
 */
function renderTableComponent<T extends object>({
    columns,
    data,
}: ITable<T>) {
    // Use the state and functions returned from useTable to build your UI
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({
        columns,
        data,
    });

    // Render the UI for your table
    return (
        <table className='table is-fullwidth' {...getTableProps()}>
            <thead>
                {headerGroups.map(headerGroup => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map(column => {
                            const style: React.CSSProperties = {
                                width: column.width,
                            };

                            return (
                                <th {...column.getHeaderProps()} style={style}>{column.render('Header')}</th>
                            );
                        })}
                    </tr>
                ))}
            </thead>
            <tbody {...getTableBodyProps()}>
                {rows.map(
                    (row) => {
                        prepareRow(row);
                        return (
                            <tr {...row.getRowProps()}>
                                {row.cells.map(cell => {
                                    return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
                                })}
                            </tr>
                        );
                    },
                )}
            </tbody>
        </table>
    );
}

export default renderTableComponent;
