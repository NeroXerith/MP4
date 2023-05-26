import React from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { Userdefined, Predefined} from './pages/index';

function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path='/' element={<Userdefined />} />
        <Route path='/predefined' element={<Predefined />} />
        {/* <Route path="/machinefour" element={} /> */}
      </Routes>
    </Router>
    </>
  );
}
 
export default App;