/*!
 * @copyright Card Librarian Team 2020
 */

import { AxisBottom, AxisLeft } from '@vx/axis';
import { Grid } from '@vx/grid';
import { Group } from '@vx/group';
import { scaleBand, scaleLinear } from '@vx/scale';
import { Bar } from '@vx/shape';
import { TFunction } from 'i18next';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
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
    convertedManaCosts: Record<number, number | undefined>;
}


/**
 * Render the graph for the mana costs
 */
function renderConvertedManaCosts(
    t: TFunction,
    convertedManaCosts: Record<number, number | undefined>,
) {
    let maxValue = 0;

    for (const value of Object.values(convertedManaCosts)) {
        if ((typeof value === 'number') && (value > maxValue)) {
            maxValue = value;
        }
    }

    const keys = Object
        .keys(convertedManaCosts)
        .map(item => Number.parseFloat(item));

    const height = 140 * 3;
    const width = 300 * 3;

    const margin = {
        top: 0,
        left: 30,
        right: 0,
        bottom: 30,
    };

    const colour = 'black';

    const xMax = width - margin.left - margin.right;

    const yMax = height - margin.top - margin.bottom;

    const yScale = scaleLinear<number>({
        domain: [0, maxValue],
        rangeRound: [yMax, 0],
        nice: true,
    });

    const xScale = scaleBand<number>({
        domain: keys,
        rangeRound: [0, xMax],
        padding: 0.5,
    });

    return <div className='card'>
        <header className='card-header'>
            <p className='card-header-title'>
                {t('deck.widgets.convertedManaCost.title')}
            </p>
        </header>
        <div className='card-content'>
            <div className='content'>
                <svg
                    viewBox={`0 0 ${width + margin.left} ${height + margin.bottom}`}
                    /*width={width + margin.left}
                    height={height + margin.bottom}*/>
                    <Grid
                        top={margin.top + margin.bottom}
                        left={margin.left + margin.right}
                        xScale={xScale}
                        yScale={yScale}
                        stroke='#00000022'
                        width={width - (margin.left * 2)}
                        height={yMax}
                    />
                    {keys
                        .map((value) => {
                            const count = convertedManaCosts[value];

                            const barHeight = yMax - yScale(typeof count === 'number' ? count : 0);

                            return (
                                <Group>
                                    <Bar
                                        x={xScale(value)}
                                        y={height - barHeight}
                                        height={barHeight}
                                        width={xScale.bandwidth()}
                                        fill='#fc2e1c'
                                    />
                                </Group>
                            );
                        })}
                    <AxisLeft
                        top={margin.bottom}
                        left={margin.left}
                        scale={yScale}
                        stroke={colour}
                        tickStroke={colour}
                        hideZero={true}
                        tickComponent={({ formattedValue, ...tickProps }) => {
                            tickProps.fontSize = '12pt';
                            return (
                                <text {...tickProps}>{formattedValue}</text>);
                        }}
                    />
                    <AxisBottom
                        top={height}
                        left={0}
                        scale={xScale}
                        stroke={colour}
                        tickStroke={colour}
                        tickComponent={({ formattedValue, ...tickProps }) => {
                            tickProps.y = tickProps.y + 5;
                            tickProps.fontSize = '12pt';
                            return (
                                <text {...tickProps}>{formattedValue}</text>);
                        }}
                        label='CMC' />
                </svg>
            </div>
        </div>
    </div>;
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
                accessor: (row) => row.card.name,
                width: undefined,
            },
            {
                // tslint:disable-next-line:no-useless-cast
                Header: t('card.attributes.colors.label') as string,
                accessor: (row) => row.card.colors,
                width: '20px',
            },
            {
                // tslint:disable-next-line:no-useless-cast
                Header: t('card.attributes.manaCost.label') as string,
                accessor: (row) => row.card.manaCost,
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
            {
                Header: '',
                width: '80px',
                id: 'actions',
                Cell: (cellProps: CellProps<CardToDeckEntity>) => {
                    const deckId = cellProps.row.original.deck.id;
                    const assignmentId = cellProps.row.original.id;

                    const deleteRoute = `/decks/${deckId}/cards/${assignmentId}/delete`;
                    const editRoute = `/decks/${deckId}/cards/${assignmentId}/edit`;

                    return <div className='tags'>
                        {[
                            <a
                                href={editRoute}
                                className='tag'
                                title={t('edit')}>
                                <FaEdit />
                            </a>,
                            <a
                                href={deleteRoute}
                                className='tag'
                                title={t('delete')}>
                                <FaTrashAlt />
                            </a>,
                        ]}
                    </div>;
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
function composeActions(t: TFunction, props: DeckDetailPageProps) {
    return [
        <a
            href={`/decks/${props.deck.id}/cards/add`}
            className='button is-fullwidth'
            accessKey='a'>
            K<u>a</u>rten hinzufügen
        </a>,
        <a href={`/decks/${props.deck.id}/edit`} className='button is-fullwidth'>Deck bearbeiten</a>,
        <form action={`/decks/${props.deck.id}/clone`} method='post'>
            <button type='submit' className='button is-fullwidth'>
                {t('deck.detail.clone')}
            </button>
        </form>,
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
        actions={composeActions(t, props)}>
        <div className='columns' style={styles}>
            <div className='column'>
                {renderLegality(t, props.legalities)}
            </div>
            <div className='column'>
                {renderConvertedManaCosts(t, props.convertedManaCosts)}
            </div>
        </div>
        {renderTables(t, props.cards)}
    </MainComponent>;
};

export default renderDeckDetailPage;
