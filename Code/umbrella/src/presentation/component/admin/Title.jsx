import React from "react";
import styled from "styled-components";

const H1 = styled.h1`
    font-size: clamp(30px, 5vw, 48px);
    color: #0056b3;
    font-weight: 900;
    margin: 0;
    padding-bottom: 15px;
    border-bottom: 4px solid #ffc107;
    display: inline-block;

    &.dashboard {
        padding-bottom: 10px;
        margin-bottom: 30px;
    }

    &.update-umbrella-info {
        font-size: clamp(28px, 4vw, 40px);
        margin-bottom: 40px;
    }

    &.update-admin-info {
        font-size: clamp(28px, 4vw, 40px);
        margin-bottom: 40px;
        text-align: center;
        display: block; /* 가운데 정렬을 위해 block 처리 */
    }

    &.check-update-info {
        font-size: clamp(24px, 4vw, 32px);
        margin-bottom: 10px;
        padding-bottom: 10px;
    }
`;

export default function Title({className, children}) {
    return(
        <H1 className={className}>{children}</H1>
    )
}
