import React from 'react';
import { HashRouter as Router, Route } from 'react-router-dom';
import Appshell from './Appshell';
import Home from './Home';
import Texts from './Texts';
import Words from './Words';


class App extends React.Component {
    render() {
        return (
            <Router>
                <Appshell>
                    <div>
                        <Route exact path="/" component={Home} />                   
                        <Route exact path="/texts" component={Texts} />     
                        <Route exact path="/words" component={Words} />
                    </div>
                </Appshell>
            </Router>
        );

    }
}
export default App;