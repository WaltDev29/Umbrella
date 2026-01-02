import React from "react";
import styled from "styled-components";

const Button = styled.button`
    width: 100%;
    height: 80px;
    color: white;
    border: none;
    border-radius: 8px;
    background-color: #007bff;
    font-size: 32px;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.2s;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

    &.update-umbrella-info {
        background-color: #0056b3;
        border-radius: 12px;
        margin-top: 20px;

        &:active {
            transform: scale(0.98);
        }
    }

    &.admin-login {
        &:hover {
            background-color: #0056b3;
        }

        @media screen and (min-width: 1024px) and (orientation: landscape) {
            height: 50px;
            font-size: 18px;
        }
    }
`;

export default function SubmitBtn(props) {
    return(
        <Button type="submit" className={props.className}>
            {props.children}
        </Button>
    )
}