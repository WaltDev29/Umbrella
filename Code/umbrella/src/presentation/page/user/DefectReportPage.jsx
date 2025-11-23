import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import DefectReport from "../../component/user/DefectReport";

export default function DefectReportPage() {
    const navigate = useNavigate();

    const [isDone, setIsDone] = useState();


    // 완료시 Thanks 페이지로 이동
    useEffect(() => {
            if (isDone) navigate("/thanks", {state : {mode : "DEFECT_REPORT"}});
    }, [isDone]);


    return (
        <>
            {!isDone &&<DefectReport setIsDone={setIsDone}/>}
        </>
    )

}