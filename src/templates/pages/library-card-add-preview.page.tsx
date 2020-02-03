/*!
 * @copyright Card Librarian Team 2020
 */

import * as React from 'react';

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
export class LibraryCardAddPreviewPage extends React.Component<LibraryCardAddPreviewProps, {}> {
    public constructor(props: Readonly<LibraryCardAddPreviewProps>) {
        super(props);
    }

    /**
     * Reacts render method
     */
    public render() {
        return <MainComponent title='Library'>
            <form method='post' action={`/libraries/${this.props.library.id}/cards/submit`} encType='multipart/form-data'>
                <table className='table is-fullwidth'>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Type</th>
                            <th>Name</th>
                            <th>Farbe</th>
                            <th>Kosten</th>
                            <th>Set</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.cards.map(item => <tr>
                            <td>{item.id}</td>
                            <td>{item.types}</td>
                            <td>{item.name}</td>
                            <td>{item.colors}</td>
                            <td>{item.manaCost}</td>
                            <td>{item.set.name}</td>
                            <td>
                                <input type='hidden' name='card_id[]' value={item.id} />
                                <input type='number' name='amount[]' />
                            </td>
                        </tr>)}
                    </tbody>
                </table>
                <button className='button' type='submit'>Submit</button>
            </form>
        </MainComponent>;
    }
}
