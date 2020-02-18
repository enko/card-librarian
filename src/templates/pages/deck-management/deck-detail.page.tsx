/*!
 * @copyright Card Librarian Team 2020
 */

import { TFunction } from 'i18next';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { CellProps, Column } from 'react-table';

import { CardToDeckEntity } from '../../../entities/card-to-deck.entity';
import { DeckEntity } from '../../../entities/deck.entity';
import { LegalityFormatEntity } from '../../../entities/legality-format.entity';
import { UserExtensionEntity } from '../../../entities/user-extension.entity';
import MainComponent from '../../components/main';
import SetComponent from '../../components/set';
import TableComponent from '../../components/table';

export interface DeckDetailPageProps {
    deck: DeckEntity;
    currentUser?: UserExtensionEntity;
    cards?: CardToDeckEntity[];
    legalities: LegalityFormatEntity[];
}

/**
 * Render a block of legalities
 */
function renderLegality(
    t: TFunction,
    legalities: LegalityFormatEntity[],
) {
    return <div className='card'>
        <header className='card-header'>
            <p className='card-header-title'>
                {t('deck.widgets.legalities.title')}
            </p>
        </header>
        <div className='card-content'>
            <div className='content'>
                <div className='tags'>
                    {legalities.map(item => {
                        return <span key={item.id} className='tag'>
                            {item.name}
                        </span>;
                    })}
                </div>
            </div>
        </div>
    </div>;
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
                Header: t('deck.attributes.type.label') as string,
                accessor: 'type',
            },
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
                    <a href={`/decks/${props.deck.id}/cards/add`} className='button is-small is-action' accessKey='a'>
                        K<u>a</u>rten hinzufügen
                    </a>,
                    <a href={`/decks/${props.deck.id}/edit`} className='button is-small is-action'>Deck bearbeiten</a>,
                    <form action={`/decks/${props.deck.id}/delete`} className='is-action' method='post'>
                        <button type='submit' className='button is-small is-danger'>
                            Löschen
                        </button>
                    </form>,
                ] :
                null}
        </h2>
        <div className='columns'>
            <div className='column'>
                {renderLegality(t, props.legalities)}
            </div>
        </div>
        {(Array.isArray(cardAssociations)) ?
            <TableComponent<CardToDeckEntity> columns={columns} data={cardAssociations} /> :
            <p>No Cards today.</p>}
    </MainComponent>;
};

export default renderDeckDetailPage;
