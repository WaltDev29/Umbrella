import React, {useEffect, useState} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import DefectReport from "../../component/user/DefectReport";

export default function DefectReportPage() {
    const navigate = useNavigate();
    const location = useLocation();

    const [done, setDone] = useState();

    // URL 입력해서 들어오는 거 방지
    useEffect(() => {
        if (location.state?.mode !== "DEFECT_REPORT") navigate("/warning");
    }, [])

    // 완료시 Thanks 페이지로 이동
    useEffect(() => {
            if (done) navigate("/thanks", {state : {mode : "DEFECT_REPORT"}});
    }, [done]);


    // todo 이거 전달해서 State 변경하도록
    const handleSetDone = () => setDone(true)


    return (
        <>
            {!done &&<DefectReport/>}
            <button></button>
        </>
    )

}