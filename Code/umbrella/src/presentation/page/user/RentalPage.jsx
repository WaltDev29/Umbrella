import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {UserInfo} from "../../component/user/UserInfo";
import {UmbrellaSelect} from "../../component/user/UmbrellaSelect";
import {Confirm} from "../../component/user/Confirm";

export default function RentalPage() {
    const navigate = useNavigate();

    const [userData, setUserData] = useState({
        user_id: '',
        phone: '',
        password: ''
    });

    const [umbrellaData, setUmbrellaData] = useState({
        umbrella_id: "",
        type: "",
        umbrellaData: ""
    });

    const [step, setStep] = useState(1);

    const page = [
        "HOME",
        "INSERT_DATA",
        "SELECT_UMBRELLA",
        "CONFIRM",
        "DONE"
    ][step]

    useEffect(() => {
        if (step == 0) navigate("/");
        else if (step == 4) navigate("/thanks", {state : {mode : "BORROW"}});
    }, [step]);


    // todo 여기에 UserInfo.jsx 컴포넌트 삽입
    return (
        <>
            {page === "INSERT_DATA" && <UserInfo mode="BORROW" setUserData={setUserData} setStep={setStep}/>}
            {page === "SELECT_UMBRELLA" && <UmbrellaSelect setUmbrellaData={setUmbrellaData} setStep={setStep}/>}
            {page === "CONFIRM" && <Confirm mode={"borrow"} userData={userData} umbrellaData={umbrellaData} setStep={setStep}/>}
        </>
    )

}