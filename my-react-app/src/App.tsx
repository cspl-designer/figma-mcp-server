
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import reactLogo from './assets/react.svg';
// import viteLogo from '/vite.svg';
import '@fortawesome/fontawesome-free/css/all.min.css';



//import NewLoginPage from './pages/newloginpage';   




import { RecursiveTest } from './components/recursivetest/recursivetest';
import { PageDateRange } from './components/pagedaterange/pagedaterange';

function App() {
  return (
    <Router>
      <Routes>

        <Route path="/recursivetest" element={<RecursiveTest />} />
        <Route path="/test" element={<PageDateRange />} />
      </Routes>
    </Router>
  );
}

export default App