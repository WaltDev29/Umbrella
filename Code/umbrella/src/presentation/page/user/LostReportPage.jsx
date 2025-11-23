import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {UserInfo} from "../../component/user/UserInfo";
import {Confirm} from "../../component/user/Confirm";

export default function LostReportPage() {
    const navigate = useNavigate();

    const [userData, setUserData] = useState({
        user_id: '',
        phone: '',
        password: ''
    });

    const [umbrellaData, setUmbrellaData] = useState({
        umbrella_id: "",
        type: ""
    });

    const [step, setStep] = useState(1);

    const page = [
        "HOME",
        "INSERT_DATA",
        "CONFIRM",
        "DONE"
    ][step]

    useEffect(() => {
        if (step == 0) navigate("/");
        else if (step == 3) navigate("/thanks", {state: {mode: "LOST_REPORT"}});
    }, [step]);

    // todo 여기에 UserInfo.jsx 컴포넌트 삽입
    return (
        <>
            {page === "INSERT_DATA" &&
                <UserInfo mode="LOST_REPORT" setUserData={setUserData} setUmbrellaData={setUmbrellaData} setStep={setStep}/>}
            {page === "CONFIRM" &&
                <Confirm mode={"loss-report"} userData={userData} umbrellaData={umbrellaData} setStep={setStep}/>}
        </>
    )

}