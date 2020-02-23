/*!
 * @copyright Card Librarian Team 2020
 */

import { ValidationError } from 'class-validator';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { LibraryEntity } from '../../../entities/library.entity';
import { UserExtensionEntity } from '../../../entities/user-extension.entity';
import MainComponent from '../../components/main';
import { renderErrors } from '../../components/render-errors';

interface LibraryEditPageProps {
    library?: LibraryEntity;
    validationErrors?: ValidationError[];
    currentUser: UserExtensionEntity;
}

const renderDeckEditPage: React.FC<LibraryEditPageProps> = (props) => {
    const { t } = useTranslation();

    let submissionUrl: string;
    let title: string;

    if (props.library instanceof LibraryEntity) {
        submissionUrl = `/libraries/${props.library.id}`;
        title = t('library.edit.title', { libraryName: props.library.name });
    } else {
        submissionUrl = `/libraries`;
        title = t('library.new.title');
    }

    return <MainComponent
        title={title}
        currentUser={props.currentUser}>
        <form method='POST' action={submissionUrl} encType='multipart/form-data'>
            {renderErrors(props.validationErrors)}
            <div className='field'>
                <label htmlFor='input-library-name' className='label'>{t('library.attributes.name.label')}</label>
                <div className='control'>
                    <input
                        id='input-library-name'
                        className='input'
                        placeholder={t('library.attributes.name.placeholder')}
                        value={props.library instanceof LibraryEntity ? props.library.name : undefined}
                        autoFocus={true}
                        name='name' />
                </div>
                <p className='help'>{t('library.attributes.name.help')}</p>
            </div>

            <div className='field'>
                <label htmlFor='input-is-public' className='label'>
                    {t('library.attributes.isPublic.label')}
                </label>
                <div className='control'>
                    <input
                        id='input-is-public'
                        type='checkbox'
                        name='isPublic'
                        checked={props.library instanceof LibraryEntity ? props.library.isPublic : undefined} />
                </div>
                <p className='help'>{t('library.attributes.isPublic.help')}</p>
            </div>

            <button
                className='button'
                type='submit'
                accessKey='s'>
                {t('submit')}
            </button>
        </form>
    </MainComponent>;
};

export default renderDeckEditPage;
