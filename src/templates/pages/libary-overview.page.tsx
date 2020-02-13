/*!
 * @copyright Card Librarian Team 2020
 */

import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { CellProps, Column } from 'react-table';

import { LibraryEntity } from '../../entities/library.entity';
import { UserExtensionEntity } from '../../entities/user-extension.entity';
import MainComponent from '../components/main';
import TableComponent from '../components/table';

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
                Cell: (cellProps: CellProps<LibraryEntity>) => {
                    return <a href={`/libraries/${cellProps.row.original.id}`}>
                        {cellProps.row.original.id}
                    </a>;
                },
            },
            {
                Header: 'Name',
                accessor: 'name',
                Cell: (cellProps: CellProps<LibraryEntity>) => {
                    return <a href={`/libraries/${cellProps.row.original.id}`}>
                        {cellProps.row.original.name}
                    </a>;
                },
            },
        ],
        [],
    );

    return <MainComponent
        title={t('navbar.libraries')}
        currentUser={props.currentUser}>
        <h2 className='title'>{t('library.overview.title')}</h2>
        <TableComponent<LibraryEntity>
            columns={columns}
            data={props.libraries} />
        {(props.currentUser instanceof UserExtensionEntity ?
            <form method='post' encType='multipart/form-data'>
                <div className='field'>
                    <label className='label'>{t('library.overview.name')}</label>
                    <div className='control'>
                        <input
                            className='input'
                            placeholder={t('library.overview.placeholder')}
                            name='name' />
                    </div>
                    <p className='help'>{t('library.overview.help')}</p>
                </div>

                <button className='button' type='submit'>{t('submit')}</button>
            </form>
            : null)}

    </MainComponent>;
};

export default renderLibraryOverviewPage;
