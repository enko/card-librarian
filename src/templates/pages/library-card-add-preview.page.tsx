/*!
 * @copyright Card Librarian Team 2020
 */

import * as React from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';

import { CardEntity } from '../../entities/card.entity';
import { LibraryEntity } from '../../entities/library.entity';
import MainComponent from '../components/main';

export interface LibraryCardAddPreviewProps {
    library: LibraryEntity;
    cards: CardEntity[];
}

/**
 * Render a libray Detail
 */
class LibraryCardAddPreviewPage extends React.Component<LibraryCardAddPreviewProps & WithTranslation, {}> {
    /**
     * Reacts render method
     */
    public render() {
        return <MainComponent title='Library'>
            <form method='post' action={`/libraries/${this.props.library.id}/cards/submit`} encType='multipart/form-data'>
                <table className='table is-fullwidth'>
                    <thead>
                        <tr>
                            <th>{this.props.t('library.cardPreview.id')}</th>
                            <th>{this.props.t('library.cardPreview.type')}</th>
                            <th>{this.props.t('library.cardPreview.name')}</th>
                            <th>{this.props.t('library.cardPreview.color')}</th>
                            <th>{this.props.t('library.cardPreview.manaCost')}</th>
                            <th>{this.props.t('library.cardPreview.set')}</th>
                            <th>{this.props.t('library.cardPreview.amount')}</th>
                            <th>{this.props.t('library.cardPreview.isFoil')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.cards.map(item => <tr>
                            <td>{item.id}</td>
                            <td>{item.types}</td>
                            <td>{item.name}</td>
                            <td>{item.colors}</td>
                            <td>{item.manaCost}</td>
                            <td>
                                <div className='tags has-addons'>
                                    <span className='tag is-dark'>
                                        <i title={item.set.name} className={`ss ss-${item.set.code}`}></i>
                                    </span>
                                    <span className='tag'>{item.set.name}</span>
                                </div>
                            </td>
                            <td>
                                <input type='hidden' name='card_id[]' value={item.id} />
                                <input type='number' name='amount[]' />
                            </td>
                            <td>
                                <input type='checkbox' name='isFoil[]' />
                            </td>
                        </tr>)}
                    </tbody>
                </table>
                <button className='button' type='submit'>Submit</button>
            </form>
        </MainComponent>;
    }
}

export default withTranslation()(LibraryCardAddPreviewPage);
