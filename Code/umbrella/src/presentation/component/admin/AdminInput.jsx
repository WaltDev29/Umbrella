import React from "react";
import styled from "styled-components";

const Input = styled.input`
    width: 100%;
    height: 80px;
    padding: 0 20px;
    border: 2px solid #ddd;
    border-radius: 8px;
    font-size: 28px;
    box-sizing: border-box;
    
    &.admin-login {
        &:focus {
            outline: none;
            border-color: #007bff;
        }

        @media screen and (min-width: 1024px) and (orientation: landscape) {
            height: 50px;
            font-size: 16px;
            border-width: 1px;
        }
    }

    &.update-admin-info {
        height: 60px;
        padding: 0 15px;
        font-size: 20px;
        
        &:focus {
            border-color: #0056b3;
            outline: none;
        }
    }
`;

export default function AdminInput(props) {
    return(
        <Input className={props.className} type={props.type} placeholder={props.placeholder} onChange={props.onChange}/>
    )
}