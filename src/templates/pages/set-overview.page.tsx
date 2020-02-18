/*!
 * @copyright Card Librarian Team 2020
 */

import { TFunction } from 'i18next';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { CellProps, Column } from 'react-table';

import { SetEntity } from '../../entities/set.entity';
import { UserExtensionEntity } from '../../entities/user-extension.entity';
import MainComponent from '../components/main';
import SetComponent from '../components/set';
import TableComponent from '../components/table';

export interface SetOverviewPageProps {
    sets: SetEntity[];
    currentUser?: UserExtensionEntity;
}

/**
 * Generate columns for the deck overview
 */
function generateColumns(
    t: TFunction,
) {
    return () => {
        const columns: Array<Column<SetEntity>> = [];

        columns.push({
            // tslint:disable-next-line:no-useless-cast
            Header: '',
            accessor: 'id',
            Cell: (cellProps: CellProps<SetEntity>) => {
                return <SetComponent
                    set={cellProps.row.original}
                    showIcon={true}
                    showText={false}
                    additionalIconClasses='is-large'
                />;
            },
        });

        columns.push({
            // tslint:disable-next-line:no-useless-cast
            Header: t('set.attributes.code.label') as string,
            accessor: 'code',
        });

        columns.push({
            // tslint:disable-next-line:no-useless-cast
            Header: t('set.attributes.name.label') as string,
            accessor: 'name',
        });

        return columns;
    };
}

/**
 * Render a libray overview
 */
const renderSetOverviewPage: React.FC<SetOverviewPageProps> = (props) => {
    const { t } = useTranslation();

    const columns = React.useMemo(
        generateColumns(t),
        [],
    );

    return <MainComponent
        title={t('navbar.decks')}
        currentUser={props.currentUser}>
        <h2 className='title'>
            {t('set.plural')}
        </h2>
        <TableComponent<SetEntity>
            columns={columns}
            data={props.sets} />
    </MainComponent>;
};

export default renderSetOverviewPage;
