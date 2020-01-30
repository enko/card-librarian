/*!
 * @license MIT
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

    public render() {
        return <MainComponent title='Library'>
            <h2>{this.props.library.name}</h2>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Farbe</th>
                        <th>Kosten</th>
                    </tr>
                </thead>
            </table>
        </MainComponent>;
    }
}
