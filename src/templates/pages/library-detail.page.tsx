/*!
 * @copyright Card Librarian Team 2020
 */

import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { CellProps, Column } from 'react-table';

import { CardToLibraryEntity } from '../../entities/card-to-library.entity';
import { LibraryEntity } from '../../entities/library.entity';
import { UserExtensionEntity } from '../../entities/user-extension.entity';
import MainComponent from '../components/main';
import SetComponent from '../components/set';
import TableComponent from '../components/table';

export interface LibraryDetailPageProps {
    library: LibraryEntity;
    currentUser?: UserExtensionEntity;
}

/**
 * Render a libray Detail
 */
const renderLibraryDetailPage: React.FC<LibraryDetailPageProps> = (props) => {
    const { t } = useTranslation();

    const columns = React.useMemo(
        (): Array<Column<CardToLibraryEntity>> => [
            {
                // tslint:disable-next-line:no-useless-cast
                Header: t('card.attributes.set.label') as string,
                Cell: (cellProps: CellProps<CardToLibraryEntity>) => {
                    return <SetComponent
                        set={cellProps.row.original.card.set}
                        showIcon={true}
                        showText={true} />;
                },
            },
            {
                // tslint:disable-next-line:no-useless-cast
                Header: t('card.attributes.setNumber.label') as string,
                accessor: 'card.setNumber',
            },
            {
                // tslint:disable-next-line:no-useless-cast
                Header: t('card.attributes.name.label') as string,
                accessor: 'card.name',
            },
            {
                // tslint:disable-next-line:no-useless-cast
                Header: t('card.attributes.colors.label') as string,
                accessor: 'card.colors',
            },
            {
                // tslint:disable-next-line:no-useless-cast
                Header: t('card.attributes.manaCost.label') as string,
                accessor: 'card.manaCost',
            },
            {
                // tslint:disable-next-line:no-useless-cast
                Header: t('library.attributes.amount.label') as string,
                accessor: 'amount',
            },
            {
                // tslint:disable-next-line:no-useless-cast
                Header: t('library.attributes.isFoil.label') as string,
                Cell: (cellProps: CellProps<CardToLibraryEntity>) => {
                    return <input
                        type='checkbox'
                        checked={cellProps.row.original.isFoil}
                        disabled={true} />;
                },
            },
        ],
        [],
    );

    const cardAssociations = props.library.cardAssociations;

    return <MainComponent
        currentUser={props.currentUser}
        title={`${t('library.singular')} ${props.library.name}`}>
        <h2 className='title'>{props.library.name}</h2>
        {(Array.isArray(cardAssociations)) ?
            <TableComponent<CardToLibraryEntity> columns={columns} data={cardAssociations} /> :
            <p>No Cards today.</p>}
        {(props.currentUser instanceof UserExtensionEntity ?
            <form method='post' action={`/libraries/${props.library.id}/cards/preview`} encType='multipart/form-data'>
                <div className='field'>
                    <label className='label'>{t('library.cardOverview.import')}</label>
                    <div className='control'>
                        <textarea className='textarea' name='import' />
                    </div>
                    <div className='content'>
                        <p>
                            {t('library.cardOverview.importHelp')}
                        </p>
                    </div>
                </div>

                <button className='button' type='submit'>{t('submit')}</button>
            </form>
            : null)}
    </MainComponent>;
};

export default renderLibraryDetailPage;
