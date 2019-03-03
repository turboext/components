import * as React from 'react';
import './ExtFancyButton.scss';

interface IFancyButtonProps {
    color?: string;
    className?: string;
    onClick?: () => void;
    name: string;
}

const title = typeof window !== 'undefined' && true && window.document.title && window;

export default ({ color, className, onClick }: IFancyButtonProps) => (
    <button
        className={`fancy-button ${className}`} onClick={onClick} style={{ backgroundColor: color }}
        type="button"
    >
        click me {title}
    </button>
);
