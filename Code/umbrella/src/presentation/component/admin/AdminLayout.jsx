import React from "react";
import styled from "styled-components";

const Container = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    min-height: 100vh;
    margin: 0;
    background-color: #ffffff;
    box-sizing: border-box;
    
    &.login {
        justify-content: center;
        align-items: center;
        height: 100vh;
        //background-color: #f0f2f5; /* 밝은 회색 배경 */
    }
    
    &.home {
        padding: 40px;
        gap: 40px;
    }


    @media screen and (max-width: 1024px) {
        max-width: 100%;
        box-shadow: none;
    }
`;

export default function AdminLayout(props) {
    return (
        <Container className={props.page}>
            {props.children}
        </Container>
    )
}