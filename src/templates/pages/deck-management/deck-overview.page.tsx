/*!
 * @copyright Card Librarian Team 2020
 */

import { ValidationError } from 'class-validator';
import { TFunction } from 'i18next';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { CellProps, Column } from 'react-table';

import { DeckEntity } from '../../../entities/deck.entity';
import { UserExtensionEntity } from '../../../entities/user-extension.entity';
import { ActionModel } from '../../../models/action.model';
import MainComponent from '../../components/main';
import TableComponent from '../../components/table';

export interface DeckOverviewPageProps {
    decks: DeckEntity[];
    currentUser?: UserExtensionEntity;
    validationErrors?: ValidationError[];
}

/**
 * Generate columns for the deck overview
 */
function generateColumns(
    t: TFunction,
    currentUser?: UserExtensionEntity,
) {
    return () => {
        const columns: Array<Column<DeckEntity>> = [];

        columns.push({
            // tslint:disable-next-line:no-useless-cast
            Header: t('deck.attributes.id.label') as string,
            accessor: 'id',
            width: '80px',
            Cell: (cellProps: CellProps<DeckEntity>) => {
                return <a href={`/decks/${cellProps.row.original.id}`}>
                    {cellProps.row.original.id}
                </a>;
            },
        });

        columns.push({
            // tslint:disable-next-line:no-useless-cast
            Header: t('deck.attributes.name.label') as string,
            accessor: 'name',
            width: undefined,
            Cell: (cellProps: CellProps<DeckEntity>) => {
                return <a href={`/decks/${cellProps.row.original.id}`}>
                    {cellProps.row.original.name}
                </a>;
            },
        });

        if (currentUser instanceof UserExtensionEntity) {
            columns.push({
                // tslint:disable-next-line:no-useless-cast
                Header: t('deck.attributes.isPublic.label') as string,
                accessor: 'isPublic',
                width: '80px',
                Cell: (cellProps: CellProps<DeckEntity>) => {
                    return <input
                        type='checkbox'
                        checked={cellProps.row.original.isPublic}
                        disabled={true} />;
                },
            });
        }

        return columns;
    };
}

/**
 * Render a libray overview
 */
const renderDeckOverviewPage: React.FC<DeckOverviewPageProps> = (props) => {
    const { t } = useTranslation();

    const columns = React.useMemo(
        generateColumns(t, props.currentUser),
        [],
    );

    const action = new ActionModel();
    action.elment = <a
        href='/decks/add'
        className='button is-fullwidth'
        accessKey='a'
    >
        Deck hinzufügen
    </a>;
    action.isVisible = () => props.currentUser instanceof UserExtensionEntity;

    return <MainComponent
        title={t('navbar.decks')}
        currentUser={props.currentUser}
        actions={[action]}>
        <TableComponent<DeckEntity>
            columns={columns}
            data={props.decks} />
    </MainComponent>;
};

export default renderDeckOverviewPage;
