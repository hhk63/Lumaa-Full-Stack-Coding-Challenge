import LoginBox from './components/LoginBox';
import { Routes, Route } from 'react-router-dom';
import Tasks from './components/Tasks';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<LoginBox/>} />
        <Route path='/tasks' element={<Tasks/>} />
      </Routes>
    </div>
  );
}

export default App;
