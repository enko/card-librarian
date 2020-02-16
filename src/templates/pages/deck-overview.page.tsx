/*!
 * @copyright Card Librarian Team 2020
 */

import { ValidationError } from 'class-validator';
import { TFunction } from 'i18next';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { CellProps, Column } from 'react-table';

import { DeckEntity } from '../../entities/deck.entity';
import { UserExtensionEntity } from '../../entities/user-extension.entity';
import MainComponent from '../components/main';
import TableComponent from '../components/table';

export interface DeckOverviewPageProps {
    decks: DeckEntity[];
    currentUser?: UserExtensionEntity;
    validationErrors?: ValidationError[];
}

/**
 * Render potential errors
 */
function renderErrors(validationErrors?: ValidationError[]) {
    if (!Array.isArray(validationErrors)) {
        return null;
    }

    if (validationErrors.length === 0) {
        return null;
    }

    return <div className='notification is-danger is-light'>
        <ul>
            {validationErrors
                .map(item => Object.values(item.constraints))
                .map(item => <li>{item}</li>)}
        </ul>
    </div>;

}

/**
 * Render the form to create new decks
 */
function renderCreateForm(
    t: TFunction,
    currentUser?: UserExtensionEntity,
    validationErrors?: ValidationError[],
) {
    if (!(currentUser instanceof UserExtensionEntity)) {
        return null;
    }

    return <form method='post' encType='multipart/form-data'>
        {renderErrors(validationErrors)}
        <div className='field'>
            <label htmlFor='input-deck-name' className='label'>{t('deck.attributes.name.label')}</label>
            <div className='control'>
                <input
                    id='input-deck-name'
                    className='input'
                    placeholder={t('deck.attributes.name.placeholder')}
                    name='name' />
            </div>
            <p className='help'>{t('deck.attributes.name.help')}</p>
        </div>

        <div className='field'>
            <label htmlFor='input-is-public' className='label'>
                {t('deck.attributes.isPublic.label')}
            </label>
            <div className='control'>
                <input
                    id='input-is-public'
                    type='checkbox'
                    name='isPublic' />
            </div>
            <p className='help'>{t('deck.attributes.isPublic.help')}</p>
        </div>

        <button className='button' type='submit'>{t('submit')}</button>
    </form>;
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

    return <MainComponent
        title={t('navbar.decks')}
        currentUser={props.currentUser}>
        <h2 className='title'>{t('deck.overview.title')}</h2>
        <TableComponent<DeckEntity>
            columns={columns}
            data={props.decks} />
        {renderCreateForm(t, props.currentUser)}

    </MainComponent>;
};

export default renderDeckOverviewPage;
