import * as React from 'react';
import './ExtDrive2Gallery.scss';

interface IProps {
    children: React.ReactChildren;
    'data-source': string;
}

interface IPic {
    thumbnail: {
        url: string;
        width: number;
        height: number;
        size: [number, number];
        primaryColor?: string;
        htmlPrimaryColor?: string;
    };
    image: {
        url: string;
        width: number;
        height: number;
        size: [number, number];
        primaryColor?: string;
        htmlPrimaryColor?: string;
    };
    isSuggestion: boolean;
}

interface IState {
    pics: IPic[];
}

export class ExtDrive2Gallery extends React.Component<IProps, IState> {
    public state = {
        pics: []
    }

    private static renderPic(pic: IPic): React.ReactNode {
        return (
            <a className="d2-gallery__item" href={pic.image.url} key={pic.image.url}>
                <img
                    alt="" className="d2-gallery__pic" src={pic.thumbnail.url}
                    style={{ backgroundColor: pic.thumbnail.htmlPrimaryColor || '#fff' }}
                />
            </a>
        );
    }

    public componentDidMount(): void {
        const source = this.props['data-source'];
        if (typeof window !== 'undefined') {
            fetch(source)
                .then(res => res.json())
                .then(pics => this.setState({ pics }))
                .catch(() => {}); // eslint-disable-line no-empty-function
        }
    }

    public render(): React.ReactNode {
        if (this.state.pics.length === 0) {
            return null;
        }

        return (
            <>
                {this.props.children}
                <div className="d2-gallery">
                    {this.state.pics.map(ExtDrive2Gallery.renderPic)}
                </div>
            </>
        );
    }
}
