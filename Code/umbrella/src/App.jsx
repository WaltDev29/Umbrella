import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Layout from './Layout.jsx';
import KioskStartPage from "./presentation/page/KioskStartPage.jsx";
import UserHomePage from './presentation/page/user/UserHomePage';
import RentalPage from "./presentation/page/user/RentalPage";
import ReturnPage from "./presentation/page/user/ReturnPage";
import LostReportPage from "./presentation/page/user/LostReportPage";
import DefectReportPage from "./presentation/page/user/DefectReportPage";
import Thanks from "./presentation/component/user/Thanks";

import Warning from "./presentation/page/user/Warning";

import AdminLogInPage from "./presentation/page/admin/AdminLogInPage";
import AdminHomePage from "./presentation/page/admin/AdminHomePage";
import DashBoardPage from "./presentation/page/admin/DashBoardPage";
import UpdateAdminInfoPage from "./presentation/page/admin/UpdateAdminInfoPage";
import UpdateUmbrellaInfo from "./presentation/page/admin/UpdateUmbrellaInfo";
import ThankYouPage from "./presentation/page/admin/ThankYouPage";


function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout/>}>
                    <Route index element={<KioskStartPage/>}/>
                    <Route path="userhomepage" element={<UserHomePage/>}/>
                    <Route path="login" element={<AdminLogInPage/>}/>
                    <Route path="admin-home" element={<AdminHomePage/>}/>
                    <Route path="dashboard" element={<DashBoardPage/>}/>
                    <Route path="update-admin-info" element={<UpdateAdminInfoPage/>}/>
                    <Route path="update-umbrella-info" element={<UpdateUmbrellaInfo/>}/>

                    <Route path="rental" element={<RentalPage/>}/>
                    <Route path="return" element={<ReturnPage/>}/>
                    <Route path="lost_report" element={<LostReportPage/>}/>
                    <Route path="defect_report" element={<DefectReportPage/>}/>

                    <Route path="warning" element={<Warning/>}/>

                    <Route path="complete" element={<ThankYouPage/>}/>
                    <Route path="thanks" element={<Thanks/>}/>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;