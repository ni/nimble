import React from 'react';
import './story-layout.css';
import Check from './assets/Check';
import Exclamation from './assets/Exclamation';

export const Frame = ({ children }) => {
    return <div className="frame">{children}</div>;
};

export const Container = ({ children, config = '200px 1fr' }) => {
    return <div className="container" style={{gridTemplateColumns: config}}>{children}</div>;
};

export const Column = ({ children, stylingClass = '' }) => {
    const cn = `column ${stylingClass}`;
    return <div className={cn}>{children}</div>;
};

export const Do = ({ children }) => {
    return (
        <Container config='48px 1fr'>
            <Column>
                <Check size="24px" />
            </Column>
            <Column>{children}</Column>
        </Container>
    );
};

export const Dont = ({ children }) => {
    return (
        <Container config='48px 1fr'>
            <Column>
                <Exclamation size="24px" />
            </Column>
            <Column>{children}</Column>
        </Container>
    );
};
