import * as React from 'react';
import './ExtFancyButton.scss';

interface IFancyButtonProps {
    color?: string;
    className?: string;
    onClick?: () => void;
}

export default ({ color, className, onClick }: IFancyButtonProps) => {
    return (
        <button className={`fancy-button ${className}`} style={{ backgroundColor: color }} onClick={onClick}>
            click me {name}
        </button>
    );
};
