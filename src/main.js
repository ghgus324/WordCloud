import React from 'react';
import ReactDom from 'react-dom';
import App from './components/App';
import './index.css';
import {MuiThemeProvider, createMuiTheme} from '@material-ui/core/styles'; //index.css에 정의되어 있는 폰트를  material-ui에 적용 시키기위해

const theme = createMuiTheme({
    typography: {
        useNextVariant: true,
        fontFamily: "Noto Sans KR"
    }
});

//index.html의 <div id='app'>이라는 공간에 <App/>을 그리겠다는 뜻
ReactDom.render(<MuiThemeProvider theme={theme}><App/></MuiThemeProvider>, document.getElementById('app'));