import * as React from 'react';
import './ExtRuamoOauth.scss';


export function ExtRuamoOauth(): React.ReactNode {
    function label(): string {
        if (typeof window !== 'undefined') {
            const userAgent = navigator.userAgent.toLowerCase();
            if (userAgent.includes('huawei') || userAgent.includes('honor')) {
                return 'Создать анкету';
            }
        }
        return 'Войти';
    }

    function href(): string {
        if (typeof window !== 'undefined') {
            const userAgent = navigator.userAgent.toLowerCase();
            if (userAgent.includes('iphone') && userAgent.includes('safari')) {
                return 'https://ruamo.ru/oauth/apple';
            } else if (userAgent.includes('android') && userAgent.includes('chrome') && !userAgent.includes('huawei') && !userAgent.includes('honor')) {
                return 'https://ruamo.ru/oauth/google';
            }
        }
        return 'https://ruamo.ru/signup';
    }

    return (
        <>
            <a className="ruamo-oauth-button" href={href()}>{label()}</a>
        </>

    );
}
