/*!
 * @copyright Card Librarian Team 2020
 */

import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { isValue } from '../../helper/funcs';
import MainComponent from '../components/main';


interface UserloginPageProps {
    errors?: string;
    username?: string;
    password?: string;
}

/**
 * Render a libray overview
 */
const renderUserLoginPage: React.FC<UserloginPageProps> = (props) => {
    const { t } = useTranslation();

    return <MainComponent title='Login'>
        <div className='card-content'>
            <form
                action='/users/login'
                method='post'
                encType='multipart/form-data'
                className='form-signin'>
                <h2 className='title has-text-centered is-size-3'>
                    {t('Please log in')}
                </h2>
                {(isValue(props.errors) ?
                    <div className='notification is-danger'>
                        {props.errors}
                    </div> : null)}
                <div className='field'>
                    <label className='label' htmlFor='username'>
                        {t('user.login.username')}
                    </label>
                    <div className='control'>
                        <input
                            className='input'
                            type='text'
                            id='username'
                            name='username'
                            required={true}
                            placeholder={t('user.login.username')}
                            value={props.username} />
                    </div>
                </div>

                <div className='field'>
                    <label
                        className='label'
                        htmlFor='password'>
                        {t('user.login.password')}
                    </label>
                    <input
                        className='input'
                        type='password'
                        id='password'
                        name='password'
                        required={true}
                        placeholder={t('user.login.password')}
                        value={props.password}
                    />
                </div>

                <div className='field'>
                    <button
                        className='button is-medium is-primary is-fullwidth'
                        type='submit'>
                        {t('user.login.login')}
                    </button>
                </div>
            </form>
        </div>
    </MainComponent>;
};

export default renderUserLoginPage;
