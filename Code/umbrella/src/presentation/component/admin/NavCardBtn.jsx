import React from "react";
import styled from "styled-components";

const gradients = {
    umbrella: "linear-gradient(135deg, #0056b3, #004494)",
    user: "linear-gradient(135deg, #17a2b8, #117a8b)",
    log: "linear-gradient(135deg, #6c757d, #545b62)",
    admin: "linear-gradient(135deg, #ffc107, #d39e00)",
};

const Btn = styled.button`
    height: 200px !important;
    font-size: 26px;
    border-radius: 20px;
    flex-direction: column;
    gap: 15px;
    border: none;
    font-weight: bold;
    cursor: pointer;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: center;
    align-items: center;
    transition: transform 0.2s, box-shadow 0.2s;

    background: ${({variant}) => gradients[variant] || "#ccc"};
    color: ${({variant}) => (variant === "admin" ? "#333" : "white")};

    @media screen and (max-width: 1023px), screen and (orientation: portrait) {
        height: 140px;
        font-size: 26px;
        &:active {
            opacity: 0.8;
            transform: scale(0.98);
        }
    }
    @media screen and (min-width: 1024px) {
        &:hover {
            transform: translateY(-7px);
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        }
    }
`;

export default function NavCardBtn(props) {
    return (
        <Btn variant={props.variant} onClick={() => props.moveToDashboard(props.direction)}>
            {props.text}
        </Btn>
    )
}