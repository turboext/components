import * as React from 'react';
import './ExtFancyButton.scss';

interface IFancyButtonProps {
    color?: string;
    className?: string;
    onClick?: () => void;
    name: string;
}

const title = typeof window !== 'undefined' && true && window.document.title && window;

export function ExtFancyButton({ color, className, onClick }: IFancyButtonProps): React.ReactNode {
    return (
        <button
            className={`fancy-button ${className}`} onClick={onClick} style={{ backgroundColor: color }}
            type="button"
        >
            click me {title}
        </button>
    );
}
