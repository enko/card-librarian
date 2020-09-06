/*!
 * @copyright Card Librarian Team 2020
 */

import { TFunction } from 'i18next';
import { compare } from 'natural-orderby';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { CellProps, Column } from 'react-table';

import { CardEntity } from '../../entities/card.entity';
import { SetEntity } from '../../entities/set.entity';
import { UserExtensionEntity } from '../../entities/user-extension.entity';
import MainComponent from '../components/main';
import ManaCostComponent from '../components/mana-cost';
import TableComponent from '../components/table';


export interface SetDetailPageProps {
    set: SetEntity;
    cards: CardEntity[];
    currentUser?: UserExtensionEntity;
}

/**
 * Generate the columns for the set detail page
 */
function generateColumns(
    t: TFunction,
    _currentUser?: UserExtensionEntity,
) {
    return () => {
        const columns: Array<Column<CardEntity>> = [];

        columns.push({
            // tslint:disable-next-line:no-useless-cast
            Header: t('card.attributes.setNumber.label') as string,
            accessor: 'setNumber',
            width: '80px',
        });

        columns.push({
            // tslint:disable-next-line:no-useless-cast
            Header: t('card.attributes.name.label') as string,
            accessor: (row) => row.name,
            width: undefined,
        });

        columns.push({
            // tslint:disable-next-line:no-useless-cast
            Header: t('card.attributes.type.label') as string,
            accessor: (row) => row.types,
            width: '20px',
        });

        columns.push({
            // tslint:disable-next-line:no-useless-cast
            Header: t('card.attributes.colors.label') as string,
            accessor: (row) => row.colors,
            width: '20px',
        });

        columns.push({
            // tslint:disable-next-line:no-useless-cast
            Header: t('card.attributes.manaCost.label') as string,
            accessor: (row) => row.manaCost,
            width: '100px',
            Cell: (cellProps: CellProps<CardEntity>) => {
                return <ManaCostComponent
                manaCost={cellProps.row.original.manaCost} />;
            },
        });

        return columns;
    };
}


const renderSetDetailPage: React.FC<SetDetailPageProps> = (props) => {
    const { t } = useTranslation();

    const columns = React.useMemo(
        generateColumns(t, props.currentUser),
        [],
    );

    props.cards.sort((a, b) => compare()(a.setNumber, b.setNumber));

    return <MainComponent
    title={props.set.name}
    currentUser={props.currentUser}
    actions={[]}>
        <TableComponent<CardEntity>
        columns={columns}
    data={props.cards} />
        </MainComponent>;
};

export default renderSetDetailPage;
