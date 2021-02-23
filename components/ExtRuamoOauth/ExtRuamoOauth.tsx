import * as React from 'react';
import './ExtRuamoOauth.scss';


export function ExtRuamoOauth(): React.ReactNode {
    const onClick = (): void => {
        if (typeof window !== 'undefined') {
            const userAgent = navigator.userAgent.toLowerCase();
            if (userAgent.includes('huawei') || userAgent.includes('honor')) {
                document.location.href = 'https://ruamo.ru/signup';
            } else if (userAgent.includes('iphone') && userAgent.includes('safari')) {
                document.location.href = 'https://ruamo.ru/oauth/apple';
            } else if (userAgent.includes('android') && userAgent.includes('chrome')) {
                document.location.href = 'https://ruamo.ru/oauth/google';
            } else {
                document.location.href = 'https://ruamo.ru/signup';
            }
        }
    };

    const label = (): string => {
        if (typeof window !== 'undefined') {
            const userAgent = navigator.userAgent.toLowerCase();
            if (userAgent.includes('huawei') || userAgent.includes('honor')) {
                return 'Зарегистрироваться';
            }
            return 'Войти';
        }
        return 'Зарегистрироваться';
    };

    if (typeof window !== 'undefined') {
        return (
            <button
                className="ruamo-oauth-button" onClick={onClick}
                type="button"
            >
                {label}
            </button>
        );
    }
    return null;
}
