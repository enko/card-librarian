import * as React from "react";

export interface MainComponentProps {
    title: string;
}

export class MainComponent extends React.Component<MainComponentProps, {}> {
    public constructor(props: Readonly<MainComponentProps>) {
        super(props);
    }

    public render() {
        return <html>
            <head>
                <title>{this.props.title}</title>
                <link
                    rel="stylesheet"
                    href="https://cdn.jsdelivr.net/npm/bulma@0.8.0/css/bulma.css"
                    integrity="sha256-XF2msWsEjJwE8ORQ0exG5nFk8jDTntTMbUZKtvPRkgU="
                    crossOrigin="anonymous" />
            </head>
            <body>
                <nav className="navbar" role="navigation" aria-label="main navigation">
                    <div className="navbar-brand">
                        <a role="button" className="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
                            <span aria-hidden="true"></span>
                            <span aria-hidden="true"></span>
                            <span aria-hidden="true"></span>
                        </a>
                    </div>
                    <div id="navbarBasicExample" className="navbar-menu">
                        <div className="navbar-start">
                            <a href='/' className="navbar-item">Start</a>
                            <a href='/libraries' className="navbar-item">Bibliotheken</a>
                        </div>
                    </div>
                </nav>
                {this.props.children}
            </body>
        </html>;
    }
}
