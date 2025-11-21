import React, {useState} from 'react';
import { Buttons, ErrorDisplay } from './Commonness';


export default function DefectReport({setIsDone}) {
    const [formData, setFormData] = useState({
        phone: '',
        umbrella_id: ''
    });

    const [error, setError] = useState({
        state : false,
        message : ""
    })

    const [isLoading, setIsloading] = useState(false);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async () => {
        const { phone, umbrella_id } = formData;

        // 유효성 검사
        if (!phone) {
            setError({state: true, message: "휴대폰 번호를 입력해주세요."})
            return;
        }

        if (!umbrella_id) {
            setError({state: true, message: "우산 번호를 입력해주세요."})
            return;
        }

        setIsloading(true)

        try {
            // 하이픈 제거
            const normalizedPhone = phone.replace(/-/g, '');

            const response = await fetch('http://localhost:5000/api/umbrellas/defect-report', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    phone: normalizedPhone,
                    umbrella_id: parseInt(umbrella_id)
                })
            });

            const data = await response.json();

            if (!response.ok) {
                setError({state : true, message: data.message || '고장 신고 실패'});
                setIsloading(false);
                return;
            }

            setIsDone(true);

        } catch (error) {
            console.error('고장 신고 에러:', error);
            setError({state: true, message: "처리 중 오류 발생"})
        } finally {
            setIsloading(false)
        }
    };

    return (
        <div className="defect-report">
            <h2>고장 신고</h2>
            {error.state && <ErrorDisplay message={error.message} />}

            <div className="form-group">
                <label>휴대폰 번호</label>
                <input
                    type="tel"
                    name="phone"
                    placeholder="01012345678"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={isLoading}
                />
            </div>

            <div className="form-group">
                <label>우산 번호</label>
                <input
                    type="number"
                    name="umbrella_id"
                    placeholder="우산 번호를 입력하세요"
                    value={formData.umbrella_id}
                    onChange={handleChange}
                    disabled={isLoading}
                />
            </div>

            <Buttons onClick={handleSubmit} disabled={isLoading}>
                {isLoading ? '신고 중...' : '고장 신고'}
            </Buttons>
        </div>
    );
}
