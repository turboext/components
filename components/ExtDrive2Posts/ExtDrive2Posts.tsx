import * as React from 'react';
import './ExtDrive2Posts.scss';

interface IProps {
    children: React.ReactChildren;
    'data-source': string;
}

interface IPost {
    link: string;
    title: string;
    photo: {
        url: string;
        width: number;
        height: number;
        size: [number, number];
        primaryColor?: string;
        htmlPrimaryColor?: string;
    };
    generationName: string;
}

interface IState {
    posts: IPost[];
    isClosed: boolean;
}

export class ExtDrive2Posts extends React.Component<IProps, IState> {
    public static CLOSED_POSTS_SIZE = 6;

    public state = {
        posts: [],
        isClosed: true
    }

    private static renderPic(post: IPost): React.ReactNode {
        return (
            <a className="d2-post" href={post.link} key={post.link}>
                <div className="d2-post__photo">
                    <img
                        alt="" className="d2-post__pic" src={post.photo.url}
                        style={{ backgroundColor: post.photo.htmlPrimaryColor || '#fff' }}
                    />
                </div>
                <h3 className="d2-post__title">{post.title}</h3>
                <div className="d2-post__generation">{post.generationName}</div>
            </a>
        );
    }

    public componentDidMount(): void {
        const source = this.props['data-source'];
        if (typeof window !== 'undefined') {
            fetch(source)
                .then(res => res.json())
                .then(data => this.setState({
                    posts: data.posts,
                    isClosed: data.posts.length > ExtDrive2Posts.CLOSED_POSTS_SIZE
                }))
                .catch(() => {}); // eslint-disable-line no-empty-function
        }
    }

    public render(): React.ReactNode {
        const { posts, isClosed } = this.state;
        const size = isClosed ? ExtDrive2Posts.CLOSED_POSTS_SIZE : posts.length;

        if (posts.length === 0) {
            return null;
        }

        return (
            <>
                {this.props.children}
                <div className={`d2-posts ${isClosed ? ' d2-posts--closed' : ''}`}>
                    {posts.slice(0, size).map(ExtDrive2Posts.renderPic)}
                </div>
                {isClosed ?
                    <button
                        className="turbo-button turbo-button_theme_gray turbo-button_width_max turbo-button_size_m"
                        onClick={this.handleClick} type="button"
                    >
                        Показать ещё
                    </button> :
                    null
                }
            </>
        );
    }

    public handleClick = () => {
        this.setState({
            isClosed: false
        });
    }
}
