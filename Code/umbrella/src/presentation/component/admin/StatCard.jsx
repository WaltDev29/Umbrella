import React from "react";
import styled from "styled-components";

const cardStyles = {
    total: {
        border: "#0056b3",
        text: "#0056b3",
        bg: "#ffffff",
    },
    rented: {
        border: "#17a2b8",
        text: "#17a2b8",
        bg: "#ffffff",
    },
    broken: {
        border: "#dc3545",
        text: "#dc3545",
        bg: "#fffbfb",
    },
    lost: {
        border: "#fd7e14",
        text: "#fd7e14",
        bg: "#ffffff",
    },
};

const Card = styled.div`
    height: 240px !important;
    padding: 30px;
    border-radius: 16px;
    text-align: center;
    border: 1px solid #e0e0e0;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    transition: transform 0.2s, box-shadow 0.2s;

    background-color: ${({variant}) =>
            cardStyles[variant]?.bg || "#ffffff"};

    border-bottom: 8px solid ${({variant}) => cardStyles[variant]?.border || "#ccc"};

    @media screen and (max-width: 1023px), screen and (orientation: portrait) {
        height: 180px;
        padding: 20px;
    }

    @media screen and (min-width: 1024px) {
        &:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
        }
    }
`;

const Label = styled.span`
    color: #666;
    margin-bottom: 10px;
    font-size: 22px;
    font-weight: 600;

    @media screen and (max-width: 1023px), screen and (orientation: portrait) {
        font-size: 22px;
    }
`;

const Value = styled.span`
    font-size: 60px;
    font-weight: 800;
    color: ${({variant}) =>
    cardStyles[variant]?.text || "#333"};

    @media screen and (max-width: 1023px), screen and (orientation: portrait) {
        font-size: 56px;
    }
`;

export default function StatCard(props) {
    return (
        <Card variant={props.variant}>
            <Label>{props.label}</Label>
            <Value>{props.data}</Value>
        </Card>
    )
}