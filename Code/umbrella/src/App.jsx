import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './Layout.jsx';
import HomePage from './User/pages/HomePage.jsx';
import UserRegisterPage from './User/pages/UserRegisterPage.jsx';
import UmbrellaSelectPage from './User/pages/UmbrellaSelectPage.jsx';
import RentalConfirmPage from './User/pages/RentalConfirmPage.jsx';
import ReportPage from './User/pages/ReportPage.jsx';
import ThankYouPage from './User/pages/ThankYouPage.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="user-register" element={<UserRegisterPage />} />
          <Route path="select" element={<UmbrellaSelectPage />} />
          <Route path="rental-confirm" element={<RentalConfirmPage />} />
          <Route path="report" element={<ReportPage />} />
          <Route path="complete" element={<ThankYouPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
export default App;
