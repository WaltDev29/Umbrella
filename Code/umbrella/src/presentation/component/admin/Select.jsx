import React from "react";
import styled from "styled-components";

const Selection = styled.select`
    width: 100%;
    height: 70px;
    font-size: 24px;
    padding: 0 20px;
    border: 2px solid #ddd;
    border-radius: 10px;
    background-color: white;
    cursor: pointer;
    color: #333;
    
    &.dashboard {
        font-size: 20px;
        padding: 5px 10px;
        border-radius: 8px;
        border: none;
        color: #0056b3;
        font-weight: bold;
    }
    
    &.update-umbrella-info {
        &:focus {
            border-color: #0056b3;
            outline: none;
        }
    }
`;

export default function Select(props) {
    return (
        <Selection className={props.className} value={props.value} onChange={props.onChange}>
            {props.children}
        </Selection>
    )
}