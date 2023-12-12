import ReactDOM from 'react-dom';
import App from './App';
import { unregister } from './serviceWorker';
import './translations';

ReactDOM.render(<App />, document.getElementById('root'));

unregister();
