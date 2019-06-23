import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid'; //화면을 여러가지 조각을 나눠어서 특정한 부분에 어떤 내용을 나오게 하기위해서 설정(하나의 줄을 여러가지 파트로 나누어서 처리 가능)
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add'; //+버튼
import Dialog from '@material-ui/core/Dialog'; //버튼을 눌렀을때 화면 위쪽에 나오는 Dialog창
import DialogAction from '@material-ui/core/DialogActions'; //Dialog내에서 특정부분을 담당할 수 있게끔 처리
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField'; //사용자가 내용을 채울수 있는 것
import { resetWarningCache } from 'prop-types';

const styles = theme => ({
    
    //+버튼 style
    fab: {
        position:'fixed',
        bottom: '20px',
        right: '20px'
    },
})

const databaseURL = "https://word-cloud-30af4.firebaseio.com";

class Words extends React.Component {

    constructor() {
        super();
        this.state = {
            words: {},
            dialog: false,
            word: '',//상자가 입력한 단어
            weight: ''
        };
    }

    //데이터 받아올때
    _get() {
        fetch(`${databaseURL}/words.json`).then(res => {
            if (res.status != 200) {
                throw new Error(res.statusText);
            }
            return res.json();
        }).then(words => this.setState({ words: words }));
    }

    //데이터 삽입(일반적으로 post방식 이용)=>Firebase는 일반적으로 RESTAPI방식
    _post(word){
        return fetch(`${databaseURL}/words.json`,{
            method:'POST',
            body: JSON.stringify(word) //json방식으로 기입
        }).then(res=>{
            if(res.status != 200){
                throw new Error(res.statusText);
            }
            return res.json(); //성공적인 결과 반환
        //성공적으로 데이터가 들어갔다면
        }).then(data=>{
            let nextState = this.state.words;
            nextState[data.name] = word;
            this.setState({words: nextState,word:'',weight:''});

        });
    }

    _delete(id){
        return fetch(`${databaseURL}/words/${id}.json`,{
            method:'DELETE'
        }).then(res => {
            if(res.status != 200){
                throw new Error(res.statusText);
            }
            return res.json(); 
        }).then(()=>{
            let nextState = this.state.words;
            delete nextState[id];
            this.setState({words: nextState});
        })
    }

    //단어가 변경 되었을때면 해당 컴포넌트를 업데이트 해주는 처리(추가 및 삭제시 해당 메소드에서 처리하기 때문에 필요없어짐)
    // shouldComponentUpdate(nextProps, nextState) {
    //     return nextState.words != this.state.words;
    // }

    //모든 UI(render부분)가 구성된 다음에 데이터베이스에서 단어정보를 불러와서 담도록
    componentDidMount() {
        this._get();
    }
    
    handleDialogToggle = () => this.setState({
        dialog: !this.state.dialog
    })

    //리엑트에서 사용자가 단어를 입력하는 동안에 단어의 상태를 보여주기위해 처리
    handleValueChange = (e) => {
        let nextState = {};
        nextState[e.target.name] = e.target.value;
        this.setState(nextState);
    }

    //사용자가 단어 추가 버튼을 눌렀을 때
    handleSubmit=()=>{
        const word = {
            word: this.state.word,
            weight: this.state.weight
        }
        this.handleDialogToggle();
        if(!word.word &&!word.weight){
            return;
        }
        this._post(word);
    }

    //사용자가 삭제 버튼을 눌렀을때
    handelDelete =(id)=>{
        this._delete(id);
    }
    render() {
        const {classes} = this.props;
        return (
            <div>
                {Object.keys(this.state.words).map(id => {
                    const word = this.state.words[id];
                    return (
                        <div key={id}>
                            <Card>
                                <CardContent>
                                    <Typography color="textSecondary" gutterBottom>
                                        가중치: {word.weight}
                                    </Typography>
                                    <Grid container>
                                        <Grid item xs={6}>
                                        <Typography variant="h5" component="h2">
                                        {word.word}
                                    </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Button variant="contained" color="primary" onClick={() => this.handelDelete(id) }>
                                                삭제
                                            </Button>
                                            </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </div>
                    )
                })}
                <Fab color="primary" className={classes.fab} onClick={this.handleDialogToggle}>
                    <AddIcon/>
                </Fab>
                <Dialog open={this.state.dialog} onClose={this.handleDialogToggle}>
                    <DialogTitle>단어 추가</DialogTitle>
                    
                    {/* DialogContent는 Dialog 내용이 들어감 */}
                    <DialogContent>
                        <TextField label="단어" type="text" name="word" value={this.state.word} onChange={this.handleValueChange}/><br/>
                        <TextField label="가중치" type="text" name="weight" value={this.state.weight} onChange={this.handleValueChange}/><br/>                   
                    </DialogContent>
                    
                    {/* DialogAction은 각종 버튼이 들어감 */}
                    <DialogAction>
                        {/* variant는 contained: 버튼안 파랑색, outlined: 버튼안 흰 색  */}
                        <Button variant="contained" color="primary" onClick={this.handleSubmit}>추가</Button>
                        <Button variant="outlined" color="primary" onClick={this.handleDialogToggle}>닫기</Button>
                    </DialogAction>
                </Dialog>
            </div>
        );
    }
}

export default withStyles(styles)(Words);