/*!
 * @license MIT
 */

import * as React from 'react';

import { LibraryEntity } from '../../entities/library.entity';
import { MainComponent } from '../components/main';

export interface LibraryOverviewPageProps {
    libraries: LibraryEntity[];
}

/**
 * Render a libray overview
 */
export class LibraryOverviewPage extends React.Component<LibraryOverviewPageProps, {}> {
    public constructor(props: Readonly<LibraryOverviewPageProps>) {
        super(props);
    }

    public render() {
        return <MainComponent title='Library'>
            <table className="table">
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
            <form method="post" target="/libraries" encType="multipart/form-data">
                <input name="name" />
                <button type="submit">Submit</button>
            </form>
        </MainComponent>;
    }
}
