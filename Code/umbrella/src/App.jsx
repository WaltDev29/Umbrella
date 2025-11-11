import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Layout from './Layout.jsx';
import KioskStartPage from "./index/KioskStartPage.jsx";
import UserHomePage from './user/UserHomePage';

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
                    <Route index element={<KioskStartPage/>}/>
                    <Route path="userhomepage" element={<UserHomePage/>}/>
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