import React, { useEffect, useState } from 'react';
import './ExtRuamoOauth.scss';


export function ExtRuamoOauth(): React.ReactNode {
    const [
        label,
        setLabel
    ] = useState('');
    const [
        href,
        setHref
    ] = useState('https://ruamo.ru/signup');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const userAgent = navigator.userAgent.toLowerCase();
            if (userAgent.includes('iphone') && userAgent.includes('safari')) {
                setHref('https://ruamo.ru/oauth/apple');
            } else if (userAgent.includes('android') && userAgent.includes('chrome')) {
                setHref('https://ruamo.ru/oauth/google');
            }
        }

        if (typeof window !== 'undefined') {
            const userAgent = navigator.userAgent.toLowerCase();
            if (userAgent.includes('huawei') || userAgent.includes('honor')) {
                setLabel('Зарегистрироваться');
            }
        }
    }, []);

    return (
        <a className="ruamo-oauth-button" href={href}>{label}</a>
    );
}
