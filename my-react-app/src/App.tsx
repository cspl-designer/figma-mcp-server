
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import reactLogo from './assets/react.svg';
// import viteLogo from '/vite.svg';
import '@fortawesome/fontawesome-free/css/all.min.css';



//import NewLoginPage from './pages/newloginpage';   

import LoginPageVerticalPage from './pages/loginpagevertical';
import Filepage from './pages/Filepage';
import PayrollFilePage from './pages/payrollfile';

import Newloginpage from './pages/newloginpage';


function App() {
  return (
    <Router>
      <Routes>

        <Route path="/login-vertical" element={<LoginPageVerticalPage />} />
        <Route path="/file-page" element={<Filepage />} />
        <Route path="/payroll" element={<PayrollFilePage />} />
        <Route path="/nw-login" element={<PayrollFilePage />} />

        <Route path="/newloginpage" element={<Newloginpage />} />
      </Routes>
    </Router>
  );
}

export default App