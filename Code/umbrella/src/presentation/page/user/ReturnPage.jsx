import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {UserInfo} from "../../component/user/UserInfo";
import {Confirm} from "../../component/user/Confirm";

export default function ReturnPage() {
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
        else if (step == 3) navigate("/thanks", {state: {mode: "RETURN"}});
    }, [step]);


    return (
        <>
            {page === "INSERT_DATA" && <UserInfo mode="RETURN" setUserData={setUserData} setUmbrellaData={setUmbrellaData} setStep={setStep}/>}
            {page === "CONFIRM" &&
                <Confirm mode={"return"} userData={userData} umbrellaData={umbrellaData} setStep={setStep}/>}
        </>
    )

}