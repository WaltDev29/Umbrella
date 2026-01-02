import React from "react";
import styled from "styled-components";

const Btn = styled.button`
    flex: 1;
    height: 60px;
    font-size: 22px;
    color: white;
    font-weight: bold;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    transition: background-color 0.2s;

    background-color: ${({sort}) => {
        if (sort === "confirm") return "#0056b3";
        else if (sort === "cancel") return "#6c757d";
    }};

    &:active {
        opacity: 0.8;
    }
    
    &.update-admin-info {
        height: 70px;
        font-size: 24px;
        transition: opacity 0.2s;
    }
`;


export default function ConfirmCancelBtn(props) {
    return(
        <Btn type={props.type} className={props.className} sort={props.sort} onClick={props.onClick}>
            {props.children}
        </Btn>
    )
}