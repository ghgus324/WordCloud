import React from 'react';
import ReactDom from 'react-dom';
import App from './components/App';

//index.html의 <div id='app'>이라는 공간에 <App/>을 그리겠다는 뜻
ReactDom.render(<App/>, document.getElementById('app'));