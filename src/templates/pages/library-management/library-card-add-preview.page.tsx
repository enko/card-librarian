/*!
 * @copyright Card Librarian Team 2020
 */

import { TFunction } from 'i18next';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { CellProps, Column } from 'react-table';

import { LibraryEntity } from '../../../entities/library.entity';
import { CardAssignment } from '../../../models/card-assignment.model';
import MainComponent from '../../components/main';
import SetComponent from '../../components/set';
import TableComponent from '../../components/table';

export interface LibraryCardAddPreviewProps {
    library: LibraryEntity;
    cards: CardAssignment[];
}


/**
 * Generate the columns for the Table
 */
function generateColumns(t: TFunction): Array<Column<CardAssignment>> {
    return [
        {
            // tslint:disable-next-line:no-useless-cast
            Header: t('card.attributes.set.label') as string,
            Cell: (cellProps: CellProps<CardAssignment>) => {
                return <SetComponent
                    set={cellProps.row.original.card.set}
                    showIcon={true}
                    showText={true} />;
            },
        },
        {
            // tslint:disable-next-line:no-useless-cast
            Header: t('card.attributes.setNumber.label') as string,
            accessor: (row) => row.card.setNumber,
        },
        {
            // tslint:disable-next-line:no-useless-cast
            Header: t('card.attributes.name.label') as string,
            accessor: (row) => row.card.name,
        },
        {
            // tslint:disable-next-line:no-useless-cast
            Header: t('card.attributes.colors.label') as string,
            accessor: (row) => row.card.colors,
        },
        {
            // tslint:disable-next-line:no-useless-cast
            Header: t('card.attributes.manaCost.label') as string,
            accessor: (row) => row.card.manaCost,
        },
        {
            // tslint:disable-next-line:no-useless-cast
            Header: t('deck.attributes.amount.label') as string,
            Cell: (cellProps: CellProps<CardAssignment>) => {
                return [
                    <input
                        name='amount[]'
                        type='number'
                        value={cellProps.row.original.amount} />,
                ];
            },
        },
        {
            // tslint:disable-next-line:no-useless-cast
            Header: t('library.attributes.isFoil.label') as string,
            Cell: (cellProps: CellProps<CardAssignment>) => {
                return [
                    <input type='hidden' name='card_id[]' value={cellProps.row.original.card.id} />,
                    <input
                        name='isFoil[]'
                        type='checkbox'
                        checked={cellProps.row.original.isFoil} />,
                ];
            },
        },
    ];
}

/**
 * Render a libray Detail
 */
const renderLibraryCardAddPreviewPage: React.FC<LibraryCardAddPreviewProps> = (props) => {
    const { t } = useTranslation();

    return <MainComponent
        title={t('library.addCards.title', { libraryName: props.library.name })}>
        <form method='post' action={`/libraries/${props.library.id}/cards/submit`} encType='multipart/form-data'>
            <TableComponent<CardAssignment>
                columns={generateColumns(t)}
                data={props.cards} />
            <button className='button' type='submit' accessKey='s'>{t('submit')}</button>
        </form>
    </MainComponent>;
};

export default renderLibraryCardAddPreviewPage;
