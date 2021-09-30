import logo from './logo.svg';
import './App.css';
import ProjectSettings from './components/ProjectSettings';

function App() {
  return (
    <div className='App'>
      <header className='App-header'>
        <ProjectSettings></ProjectSettings>
        <img src={logo} className='App-logo' alt='logo' />
        <p>
          Hi again 2<br></br>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className='App-link'
          href='https://reactjs.org'
          target='_blank'
          rel='noopener noreferrer'
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
