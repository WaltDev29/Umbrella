import React from "react";
import styled from "styled-components";

const Group = styled.div`
    display: flex;
    gap: 15px;
    
    &.dashboard {
        gap: 20px;
        margin-bottom: 30px;   
    }
    
    &.update-admin-info {
        gap: 15px;
        margin-top: 40px;   
    }
`;

export default function BtnGroup({children, className}) {
    return (
        <Group className={className}>{children}</Group>
    )
}