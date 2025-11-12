import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Layout from './Layout.jsx';
import HomePage from './user/pages/HomePage.jsx';
import UserRegisterPage from './user/pages/UserRegisterPage.jsx';
import UmbrellaSelectPage from './user/pages/UmbrellaSelectPage.jsx';
import ReportPage from './user/pages/ReportPage.jsx';
import ThankYouPage from './user/pages/ThankYouPage.jsx';

import AdminLogInPage from "./admin/pages/AdminLogInPage";
import AdminHomePage from "./admin/pages/AdminHomePage";
import DashBoardPage from "./admin/pages/DashBoardPage";
import UpdateAdminInfoPage from "./admin/pages/UpdateAdminInfoPage";
import UpdateUmbrellaInfo from "./admin/pages/UpdateUmbrellaInfo";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout/>}>
                    <Route index element={<HomePage/>}/>
                    <Route path="user-register" element={<UserRegisterPage/>}/>
                    <Route path="select" element={<UmbrellaSelectPage/>}/>
                    <Route path="report" element={<ReportPage/>}/>
                    <Route path="complete" element={<ThankYouPage/>}/>
                    <Route path="login" element={<AdminLogInPage/>}/>
                    <Route path="admin-home" element={<AdminHomePage/>}/>
                    <Route path="dashboard" element={<DashBoardPage/>}/>
                    <Route path="update-admin-info" element={<UpdateAdminInfoPage/>}/>
                    <Route path="update-umbrella-info" element={<UpdateUmbrellaInfo/>}/>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;