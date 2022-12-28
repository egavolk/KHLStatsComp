import MainPage from './components/MainPage';
import {Provider} from 'react-redux';
import store from './store';


function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <MainPage/>
      </div>
    </Provider>
    
  );
}

export default App;
