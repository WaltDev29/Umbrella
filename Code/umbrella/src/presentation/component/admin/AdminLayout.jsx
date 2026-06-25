import React from "react";
import styled from "styled-components";

const Container = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    min-height: 100%;
    margin: 0;
    background-color: #f6f8fb;
    box-sizing: border-box;
    
    &.login {
        justify-content: center;
        align-items: center;
        min-height: calc(100vh - 76px);
        padding: clamp(24px, 5vw, 48px);
        //background-color: #f0f2f5; /* 밝은 회색 배경 */
    }
    
    &.home {
        width: min(1280px, 100%);
        margin: 0 auto;
        padding: clamp(24px, 5vw, 56px);
        gap: clamp(24px, 4vw, 40px);
    }

    &.dashboard {
        width: min(1440px, 100%);
        margin: 0 auto;
        padding: clamp(20px, 4vw, 40px);
        background-color: #f8f9fa;
        min-height: calc(100vh - 76px);
        font-family: 'Noto Sans KR', sans-serif;
    }
    
    &.update-umbrella-info, &.update-admin-info {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: calc(100vh - 76px);
        padding: clamp(24px, 5vw, 48px);
    }
    
    @media screen and (max-width: 1024px) {
        max-width: 100%;
        box-shadow: none;
    }

    @media screen and (max-width: 640px) {
        &.login,
        &.home,
        &.dashboard,
        &.update-umbrella-info,
        &.update-admin-info {
            min-height: calc(100vh - 68px);
            padding: 20px 16px 32px;
        }
    }

`;

export default function AdminLayout(props) {
    return (
        <Container className={props.page}>
            {props.children}
        </Container>
    )
}
