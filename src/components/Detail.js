import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

class Detail extends React.Component {
    constructor(props){
        super(props);
    }
   
    render() {
        return (
            <Card>
                <CardContent>
                    {/*  App.js에서 <Route exact path="/detail/:textID" component={Detail} /> 의 textID가 잘 가져왔는지 확인하는 방법*/}
                    {this.props.match.params.textID}
                </CardContent>
            </Card>
    );
    }
}

export default Detail;