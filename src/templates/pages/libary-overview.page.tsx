/*!
 * @copyright Card Librarian Team 2020
 */

import * as React from 'react';

import { LibraryEntity } from '../../entities/library.entity';
import { UserExtensionEntity } from '../../entities/user-extension.entity';
import { MainComponent } from '../components/main';

export interface LibraryOverviewPageProps {
    libraries: LibraryEntity[];
    currentUser?: UserExtensionEntity;
}

/**
 * Render a libray overview
 */
export class LibraryOverviewPage extends React.Component<LibraryOverviewPageProps, {}> {
    public constructor(props: Readonly<LibraryOverviewPageProps>) {
        super(props);
    }

    /**
     * Reacts render method
     */
    public render() {
        return <MainComponent
            title='Library'
            currentUser={this.props.currentUser}>
            <table className='table is-fullwidth'>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                    </tr>
                </thead>
                <tbody>
                    {this.props.libraries.map(item => [
                        <tr>
                            <td>
                                <a href={`/libraries/${item.id}`}>
                                    {item.id}
                                </a>
                            </td>
                            <td>
                                <a href={`/libraries/${item.id}`}>
                                    {item.name}
                                </a>
                            </td>
                        </tr>,
                    ])}
                </tbody>
            </table>
            {(this.props.currentUser instanceof UserExtensionEntity ?
                <form method='post' encType='multipart/form-data'>
                    <div className='field'>
                        <label className='label'>Name</label>
                        <div className='control'>
                            <input className='input' placeholder='Library name' name='name' />
                        </div>
                        <p className='help'>Enter the name of the library, for example Shoebox 1</p>
                    </div>

                    <button className='button' type='submit'>Submit</button>
                </form>
                : null)}

        </MainComponent>;
    }
}
