import React from 'react';
import './story-layout.css';
import Check from './assets/Check';
import Exclamation from './assets/Exclamation';

export const Frame = ({ children }) => {
    return <div className="frame">{children}</div>;
};

export const Container = ({ children }) => {
    return <div className="container">{children}</div>;
};

export const Column = ({ children, size = 'medium' }) => {
    const cn = `column ${size}`;
    return <div className={cn}>{children}</div>;
};

export const Do = ({ children }) => {
    return (
        <Container>
            <Column size="fit">
                <Check size="24px" />
            </Column>
            <Column size="large">{children}</Column>
        </Container>
    );
};

export const Dont = ({ children }) => {
    return (
        <Container>
            <Column size="fit">
                <Exclamation size="24px" />
            </Column>
            <Column size="large">{children}</Column>
        </Container>
    );
};
