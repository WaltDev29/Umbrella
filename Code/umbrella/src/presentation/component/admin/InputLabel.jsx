import React from "react";
import styled from "styled-components";

const Label = styled.label`
    display: block;
    font-size: 22px;
    color: #0056b3;
    font-weight: bold;
    margin-bottom: 10px;

    &.update-admin-info {
        color: #333;
        margin-top: 20px;   
    }
`;

export default function InputLabel(props) {
    return (
        <Label className={props.className}>{props.children}</Label>
    )
}