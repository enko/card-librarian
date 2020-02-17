/*!
 * @copyright Card Librarian Team 2020
 */

import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { CellProps, Column } from 'react-table';

import { CardToDeckEntity } from '../../../entities/card-to-deck.entity';
import { DeckEntity } from '../../../entities/deck.entity';
import { UserExtensionEntity } from '../../../entities/user-extension.entity';
import MainComponent from '../../components/main';
import SetComponent from '../../components/set';
import TableComponent from '../../components/table';

export interface DeckDetailPageProps {
    deck: DeckEntity;
    currentUser?: UserExtensionEntity;
    cards?: CardToDeckEntity[];
}

/**
 * Render a libray Detail
 */
const renderDeckDetailPage: React.FC<DeckDetailPageProps> = (props) => {
    const { t } = useTranslation();

    const columns = React.useMemo(
        (): Array<Column<CardToDeckEntity>> => [
            {
                // tslint:disable-next-line:no-useless-cast
                Header: t('card.attributes.set.label') as string,
                Cell: (cellProps: CellProps<CardToDeckEntity>) => {
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
                Header: t('deck.attributes.amount.label') as string,
                accessor: 'amount',
            },
        ],
        [],
    );

    const cardAssociations = props.cards;

    return <MainComponent
        currentUser={props.currentUser}
        title={`${t('deck.singular')} ${props.deck.name}`}>
        <h2 className='title'>
            {props.deck.name}

            {props.currentUser instanceof UserExtensionEntity ?
                [
                    <a href={`/decks/${props.deck.id}/cards/add`} className='button is-small'>Karten hinzufügen</a>,
                    <a href={`/decks/${props.deck.id}/edit`} className='button is-small'>Deck bearbeiten</a>,
                ] :
                null}
        </h2>
        {(Array.isArray(cardAssociations)) ?
            <TableComponent<CardToDeckEntity> columns={columns} data={cardAssociations} /> :
            <p>No Cards today.</p>}
    </MainComponent>;
};

export default renderDeckDetailPage;
