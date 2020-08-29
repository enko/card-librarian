/*!
 * @copyright Card Librarian Team 2020
 */

import { TFunction } from 'i18next';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { CellProps, Column } from 'react-table';

import { CardEntity } from '../../../entities/card.entity';
import { DeckEntity } from '../../../entities/deck.entity';
import { UserExtensionEntity } from '../../../entities/user-extension.entity';
import MainComponent from '../../components/main';
import SetComponent from '../../components/set';
import TableComponent from '../../components/table';


interface CardAssignment {
    amount?: number;
    card: CardEntity;
}

export interface DeckAddCardsPreviewPageProps {
    deck: DeckEntity;
    cardAssignments: CardAssignment[];
    currentUser: UserExtensionEntity;
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
            Header: t('deck.attributes.type.label') as string,
            Cell: () => {
                return <select name='type[]'>
                    <option selected={true} value='main'>Main</option>
                    <option value='sideboard'>Sideboard</option>
                </select>;
            },
        },
        {
            // tslint:disable-next-line:no-useless-cast
            Header: t('deck.attributes.amount.label') as string,
            Cell: (cellProps: CellProps<CardAssignment>) => {
                return [
                    <input type='hidden' name='card_id[]' value={cellProps.row.original.card.id} />,
                    <input
                        name='amount[]'
                        type='number'
                        value={cellProps.row.original.amount} />,
                ];
            },
        },
    ];
}


/**
 * Render a libray Detail
 */
const renderDeckAddCardsPreviewPage: React.FC<DeckAddCardsPreviewPageProps> = (props) => {
    const { t } = useTranslation();

    return <MainComponent
        title={t('deck.addCards.title', { deckName: props.deck.name })}
        currentUser={props.currentUser}>
        <form method='post' action={`/decks/${props.deck.id}/cards/submit
        `} encType='multipart/form-data'>
            <TableComponent<CardAssignment>
                columns={generateColumns(t)}
                data={props.cardAssignments} />
            <button className='button' type='submit' accessKey='s'>Submit</button>
        </form>
    </MainComponent>;
};

export default renderDeckAddCardsPreviewPage;
