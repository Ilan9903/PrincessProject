import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ValentineSuccess from './pages/Valentine-success';
import ValentineRequest from './pages/Valentine-request';
import DateIdeas from './pages/DateIdeas';
import OpenWhen from './pages/OpenWhen';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/valentine" element={<ValentineRequest />} />
        <Route path="/success" element={<ValentineSuccess />} />
        <Route path="/date-ideas" element={<DateIdeas />} />
        <Route path="/open-when" element={<OpenWhen />} />
      </Routes>
    </Router>
  );
}

export default App;