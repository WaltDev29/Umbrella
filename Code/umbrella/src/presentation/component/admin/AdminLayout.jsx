import React from "react";
import styled from "styled-components";

const Container = styled.div`
    padding: 40px;
    display: flex;
    flex-direction: column;
    gap: 40px;

    width: 100%;
    min-height: 100vh;
    margin: 0;

    background-color: #ffffff;
    box-sizing: border-box;
    
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
        <Container ClassName={props.page}>
            {props.children}
        </Container>
    )
}