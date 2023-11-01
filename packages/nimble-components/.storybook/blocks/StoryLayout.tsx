import React from 'react';
import './story-layout.css';
const checkSVG = './assets/check.svg';
const exclamationSVG = './assets/exclamation.svg';

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
                <img src={checkSVG} width="32px" />
            </Column>
            <Column size="large">{children}</Column>
        </Container>
    );
};

export const Dont = ({ children }) => {
    return (
        <Container>
            <Column size="fit">
                <img src={exclamationSVG} width="32px" />
            </Column>
            <Column size="large">{children}</Column>
        </Container>
    );
};
