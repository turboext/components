import * as React from 'react';
import './ExtFancyButton.scss';

interface IFancyButtonProps {
    color?: string;
    className?: string;
    onClick?: () => void;
    name: string;
    children?: React.ReactNode[];
}

export function ExtFancyButton({ color, className, onClick, children }: IFancyButtonProps): React.ReactNode {
    return (
        <button
            className={`fancy-button ${className}`} onClick={onClick} style={{ backgroundColor: color }}
            type="button"
        >
            {children}
        </button>
    );
}
