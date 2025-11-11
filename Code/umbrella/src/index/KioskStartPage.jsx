import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function KioskStartPage() {
    const [adminTapCount, setAdminTapCount] = useState(0);
    const navigate = useNavigate();

    const handleStart = () => {
        navigate('/userhomepage');
    };


    const handleAdminTap = () => {
        const newCount = adminTapCount + 1;
        setAdminTapCount(newCount);

        if (newCount >= 6) {
            navigate('/login');
            setAdminTapCount(0);
        }
    };

    return (
        <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',margin: 0, padding: 0 }}>
           {/*<div>*/}
            <div
                onClick={handleAdminTap}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '20%',
                    backgroundColor: 'red', //'transparent',
                    zIndex: 10,
                }}
            />

            <h1>키오스크 시작 화면</h1>
            <button onClick={handleStart}>시작하기</button>
        </div>
    );
}

export default KioskStartPage;