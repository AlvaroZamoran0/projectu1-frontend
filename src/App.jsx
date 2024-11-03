// App.js
import './App.css';
import { HashRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import NotFound from './components/NotFound';
import Login from './components/Login';
import Sign_in from './components/Sign_in';
import Principal from './components/Principal';
import Status from './components/Status';
import DetailCredit from './components/DetailCredit';
import ApplyCredit from './components/ApplyCredit';
import SubmitDocument from './components/SubmitDocument';
import SimulateCredit from './components/SimulateCredit';
import RevisionCredit from './components/RevisionCredit';
import { AuthProvider } from './components/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="container">
          <Navbar />
          <Routes>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/sign_in" element={<Sign_in />} />
            <Route path="/principal" element={<Principal />} />
            <Route path="/status" element={<Status />} />
            <Route path="/detail/credit/:idCredit" element={<DetailCredit />} />
            <Route path="/apply/credit" element={<ApplyCredit />} />
            <Route path="/submit/document/:idCredit" element={<SubmitDocument />} />
            <Route path="/simulate/credit" element={<SimulateCredit />} />
            <Route path="/revision/credit/:idCredit" element={<RevisionCredit />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
