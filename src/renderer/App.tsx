import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import icon from '../../assets/icon.svg';
import './App.css';
import FilePicker from './components/FilePicker';

const Hello = () => {
  const onPickFiles = (files: File[]) => {
    const filesPaths = files.map((f) => f.path);
    window.electron.ipcRenderer.uploadFiles(filesPaths);
  };

  return (
    <div>
      <h1>Hello world</h1>
      <FilePicker onPickFiles={onPickFiles} />
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}
