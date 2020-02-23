/*!
 * @copyright Card Librarian Team 2020
 */

import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { CellProps, Column } from 'react-table';

import { LibraryEntity } from '../../../entities/library.entity';
import { UserExtensionEntity } from '../../../entities/user-extension.entity';
import { ActionModel } from '../../../models/action.model';
import MainComponent from '../../components/main';
import TableComponent from '../../components/table';

export interface LibraryOverviewPageProps {
    libraries: LibraryEntity[];
    currentUser?: UserExtensionEntity;
}

/**
 * Render a libray overview
 */
const renderLibraryOverviewPage: React.FC<LibraryOverviewPageProps> = (props) => {
    const { t } = useTranslation();

    const columns = React.useMemo(
        (): Array<Column<LibraryEntity>> => [
            {
                Header: 'ID',
                accessor: 'id',
                width: '80px',
                Cell: (cellProps: CellProps<LibraryEntity>) => {
                    return <a href={`/libraries/${cellProps.row.original.id}`}>
                        {cellProps.row.original.id}
                    </a>;
                },
            },
            {
                Header: 'Name',
                accessor: 'name',
                width: undefined,
                Cell: (cellProps: CellProps<LibraryEntity>) => {
                    return <a href={`/libraries/${cellProps.row.original.id}`}>
                        {cellProps.row.original.name}
                    </a>;
                },
            },
        ],
        [],
    );

    const action = new ActionModel();
    action.elment = <a
        href='/libraries/add'
        className='button is-fullwidth'
        accessKey='a'
    >
        Bibliothek hinzufügen
    </a>;
    action.isVisible = () => props.currentUser instanceof UserExtensionEntity;

    return <MainComponent
        title={t('navbar.libraries')}
        currentUser={props.currentUser}
        actions={[action]}>
        {(Array.isArray(props.libraries) && props.libraries.length > 0) ?
            <TableComponent<LibraryEntity>
                columns={columns}
                data={props.libraries} /> :
            <p>No libraries today</p>}
    </MainComponent>;
};

export default renderLibraryOverviewPage;
