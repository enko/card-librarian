/*!
 * @copyright Card Librarian Team 2020
 */

import * as React from 'react';

import { MainComponent } from '../components/main';


/**
 * Render a libray overview
 */
export class DashboardPage extends React.Component<unknown, {}> {
    public constructor(props: Readonly<unknown>) {
        super(props);
    }

    /**
     * Reacts render method
     */
    public render() {
        return <MainComponent title='Dashboard'>
            <p>Wellcome</p>
        </MainComponent>;
    }
}
