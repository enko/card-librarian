/*!
 * @copyright Card Librarian Team 2020
 */

import * as React from 'react';

import { LibraryEntity } from '../../entities/library.entity';
import { MainComponent } from '../components/main';

export interface LibraryDetailPageProps {
    library: LibraryEntity;
}

/**
 * Render a libray Detail
 */
export class LibraryDetailPage extends React.Component<LibraryDetailPageProps, {}> {
    public constructor(props: Readonly<LibraryDetailPageProps>) {
        super(props);
    }

    /**
     * Reacts render method
     */
    public render() {
        return <MainComponent title='Library'>
            <h2 className='title'>{this.props.library.name}</h2>
            <table className='table is-fullwidth'>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Farbe</th>
                        <th>Kosten</th>
                    </tr>
                </thead>
            </table>
            <form method='post' encType='multipart/form-data'>
                <div className='field'>
                    <label className='label'>Cards to import</label>
                    <div className='control'>
                        <textarea className='textarea' name='import' />
                    </div>
                    <div className='content'>
                        <p>
                            You can enter one card per line. The following schemes are supported:
                        </p>
                        <ul>
                            <li>Exact match: You can enter the exact name of the card.</li>
                            <li>Prefix ~: Fuzzy match, all matched cards are returned.</li>
                            <li>
                                Prefix #: Syntax is #&lt;set short name&gt;:&lt;set number&gt;.
                                For example #thb:259 for "Heliod, Sun-Crowned".
                            </li>
                        </ul>
                    </div>
                </div>

                <button className='button' type='submit'>Submit</button>
            </form>
        </MainComponent>;
    }
}
