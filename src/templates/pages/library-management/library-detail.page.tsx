/*!
 * @copyright Card Librarian Team 2020
 */

import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { CellProps, Column } from 'react-table';

import { CardToLibraryEntity } from '../../../entities/card-to-library.entity';
import { LibraryEntity } from '../../../entities/library.entity';
import { UserExtensionEntity } from '../../../entities/user-extension.entity';
import { ActionModel } from '../../../models/action.model';
import MainComponent from '../../components/main';
import ManaCostComponent from '../../components/mana-cost';
import SetComponent from '../../components/set';
import TableComponent from '../../components/table';

export interface LibraryDetailPageProps {
    library: LibraryEntity;
    currentUser?: UserExtensionEntity;
}

/**
 * Compose all the actions
 */
function composeActions(props: LibraryDetailPageProps) {
    return [
        <a
            href={`/libraries/${props.library.id}/cards/add`}
            className='button is-fullwidth'
            accessKey='a'>
            K<u>a</u>rten hinzufügen
        </a>,
        <a
            href={`/libraries/${props.library.id}/edit`}
            className='button is-fullwidth'>
            Bibliothek bearbeiten
                    </a>,
        <form action={`/libraries/${props.library.id}/delete`} method='post'>
            <button type='submit' className='button is-danger is-fullwidth'>
                Löschen
            </button>
        </form>,
    ].map(item => {
        const action = new ActionModel();
        action.elment = item;
        action.isVisible = () => {
            return props.currentUser instanceof UserExtensionEntity;
        };

        return action;
    });
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
                width: '200px',
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
                width: '100px',
                accessor: (row) => row.card.setNumber,
            },
            {
                // tslint:disable-next-line:no-useless-cast
                Header: t('card.attributes.name.label') as string,
                width: undefined,
                accessor: (row) => row.card.name,
            },
            {
                // tslint:disable-next-line:no-useless-cast
                Header: t('card.attributes.colors.label') as string,
                width: '80px',
                accessor: (row) => row.card.colors,
            },
            {
                // tslint:disable-next-line:no-useless-cast
                Header: t('card.attributes.manaCost.label') as string,
                accessor: (row) => row.card.manaCost,
                width: '100px',
                Cell: (cellProps: CellProps<CardToLibraryEntity>) => {
                    return <ManaCostComponent
                        manaCost={cellProps.row.original.card.manaCost} />;
                },
            },
            {
                // tslint:disable-next-line:no-useless-cast
                Header: t('library.attributes.amount.label') as string,
                width: '60px',
                accessor: 'amount',
            },
            {
                // tslint:disable-next-line:no-useless-cast
                Header: t('library.attributes.isFoil.label') as string,
                width: '100px',
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
        actions={composeActions(props)}
        title={`${t('library.singular')} ${props.library.name}`}>
        {(Array.isArray(cardAssociations) && cardAssociations.length > 0) ?
            <TableComponent<CardToLibraryEntity> columns={columns} data={cardAssociations} /> :
            <p>No Cards today.</p>}
    </MainComponent>;
};

export default renderLibraryDetailPage;
