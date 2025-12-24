import React from "react";
import styled from "styled-components";

const btnStyles = {
    INSERT: {
        backgroundColor: "#0056b3",
        color: "#ffffff"
    },
    UPDATE: {
        backgroundColor: "#ffc107",
        color: "#333"
    },
    DELETE: {
        backgroundColor: "#dc3545",
        color: "#ffffff"
    }
}

const Button = styled.button`
    flex: 1;
    height: 70px;
    font-size: 24px;
    font-weight: bold;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.1s, box-shadow 0.1s;

    background-color: ${({type}) => btnStyles[type]?.backgroundColor};
    color: ${({type}) => btnStyles[type]?.color};

    &:active {
        transform: scale(0.98);
    }
`;

export default function DashboardBtn(props) {
    return (
        <Button type={props.direction} onClick={() => props.method(props.direction)}>{props.label}</Button>
    )
}