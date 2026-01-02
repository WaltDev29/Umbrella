import React from "react";
import styled, {keyframes} from "styled-components";

const popIn = keyframes`
    from { transform: scale(0.8); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
`;

const Container = styled.div`
    width: 100%;
    max-width: 700px;
    padding: 60px;
    background-color: #ffffff;
    border-radius: 16px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    text-align: center;

    &.admin-login {
        @media screen and (min-width: 1024px) and (orientation: landscape) {
            max-width: 450px;
            padding: 40px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.1); /* 그림자 더 깊게 */
        }
    }
    
    &.update-admin-info, &.update-umbrella-info {
        max-width: 600px;
        padding: 50px;
        border-radius: 20px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        border: 1px solid #eee;
        text-align: left;
    }

    &.update-umbrella-info {
        text-align: center;
    }
    
    &.check-update-info {
        padding: 40px;
        border-radius: 20px;
        width: 90%;
        max-width: 500px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        border: 1px solid #ddd;
        animation: ${popIn} 0.3s ease-out;
    }
`;

export default function Card({className, children}) {
    return(
        <Container className={className}>
            {children}
        </Container>
    )
}