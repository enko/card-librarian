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
import { CardToDeckType } from '../../../enums/card-to-deck-type.enum';
import { ActionModel } from '../../../models/action.model';
import MainComponent from '../../components/main';
import ManaCostComponent from '../../components/mana-cost';
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
                <p>

                </p>
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
 * Build the columns for the table
 */
function getColumns(t: TFunction) {
    return React.useMemo(
        (): Array<Column<CardToDeckEntity>> => [
            {
                // tslint:disable-next-line:no-useless-cast
                Header: t('deck.attributes.amount.label') as string,
                accessor: 'amount',
                width: '20px',
            },
            {
                // tslint:disable-next-line:no-useless-cast
                Header: t('card.attributes.name.label') as string,
                accessor: 'card.name',
                width: undefined,
            },
            {
                // tslint:disable-next-line:no-useless-cast
                Header: t('card.attributes.colors.label') as string,
                accessor: 'card.colors',
                width: '20px',
            },
            {
                // tslint:disable-next-line:no-useless-cast
                Header: t('card.attributes.manaCost.label') as string,
                accessor: 'card.manaCost',
                width: '100px',
                Cell: (cellProps: CellProps<CardToDeckEntity>) => {
                    return <ManaCostComponent
                        manaCost={cellProps.row.original.card.manaCost} />;
                },
            },
            {
                // tslint:disable-next-line:no-useless-cast
                Header: t('card.attributes.set.label') as string,
                width: '20px',
                Cell: (cellProps: CellProps<CardToDeckEntity>) => {
                    return <SetComponent
                        set={cellProps.row.original.card.set}
                        showIcon={true}
                        showText={false} />;
                },
            },
        ],
        [],
    );
}

/**
 * Render a Table for the cards of a deck
 */
function renderTables(t: TFunction, cardAssociations?: CardToDeckEntity[]) {
    if (!Array.isArray(cardAssociations)) {
        return <p>{t('deck.noCards')}</p>;
    }

    if (cardAssociations.length === 0) {
        return <p>{t('deck.noCards')}</p>;
    }

    const returnValue = [];

    const main = cardAssociations.filter(item => item.type === CardToDeckType.Main);

    if (main.length > 0) {
        returnValue.push(
            ...[
                <h3 className='title'>Main</h3>,
                <TableComponent<CardToDeckEntity> columns={getColumns(t)} data={main} />,
            ],
        );
    }

    const sideboard = cardAssociations.filter(item => item.type === CardToDeckType.SideBoard);

    if (sideboard.length > 0) {
        returnValue.push(
            ...[
                <h3 className='title'>Sideboard</h3>,
                <TableComponent<CardToDeckEntity> columns={getColumns(t)} data={sideboard} />,
            ],
        );
    }

    return returnValue;
}

/**
 * Generate the actions
 */
function composeActions(props: DeckDetailPageProps) {
    return [
        <a
            href={`/decks/${props.deck.id}/cards/add`}
            className='button is-fullwidth'
            accessKey='a'>
            K<u>a</u>rten hinzufügen
        </a>,
        <a href={`/decks/${props.deck.id}/edit`} className='button is-fullwidth'>Deck bearbeiten</a>,
        <form action={`/decks/${props.deck.id}/delete`} method='post'>
            <button type='submit' className='button is-fullwidth is-danger'>
                Löschen
            </button>
        </form>,
    ].map(element => {
        const action = new ActionModel();
        action.elment = element;
        action.isVisible = () => props.currentUser instanceof UserExtensionEntity;
        return action;
    });
}

/**
 * Render a libray Detail
 */
const renderDeckDetailPage: React.FC<DeckDetailPageProps> = (props) => {
    const { t } = useTranslation();

    const styles: React.CSSProperties = {
        width: '100%',
    };

    return <MainComponent
        currentUser={props.currentUser}
        title={`${t('deck.singular')} ${props.deck.name}`}
        actions={composeActions(props)}>
        <div className='columns is-gapless' style={styles}>
            <div className='column'>
                {renderLegality(t, props.legalities)}
            </div>
        </div>
        {renderTables(t, props.cards)}
    </MainComponent>;
};

export default renderDeckDetailPage;
