import React from 'react';
import TextTruncate from 'react-text-truncate'; // 문장이 길때 ... 으로 보여주게 하는 모듈
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
import {Link as RouterLink} from 'react-router-dom';
import Link from '@material-ui/core/Link';

const styles = theme => ({
    hidden: {
        display: 'none'
    },
    fab: {
        position: 'fixed',
        bottom: '20px',
        right: '20px'
    }
})

const databaseURL = "https://word-cloud-30af4.firebaseio.com";

class Texts extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fileName: '', //upload한 파일이름 
            fileContent: null, //해당 파일에 적혀있는 문장
            texts: {}, //firebase에서 받아오는 텍스트
            textName: '', //각각의 text에 해당하는 id값
            dialog: false
        }
    }

    //데이터 받아올때
    _get() {
        fetch(`${databaseURL}/texts.json`).then(res => {
            if (res.status != 200) {
                throw new Error(res.statusText);
            }
            return res.json();
        }).then(texts => this.setState({ texts: (texts !== null) ? texts : {} }));
    }

    //데이터 삽입(일반적으로 post방식 이용)=>Firebase는 일반적으로 RESTAPI방식
    _post(text) {
        return fetch(`${databaseURL}/texts.json`, {
            method: 'POST',
            body: JSON.stringify(text) //json방식으로 기입
        }).then(res => {
            if (res.status != 200) {
                throw new Error(res.statusText);
            }
            return res.json(); //성공적인 결과 반환
            //성공적으로 데이터가 들어갔다면
        }).then(data => {
            let nextState = this.state.texts;
            nextState[data.name] = text;
            this.setState({ texts: nextState });
        });
    }

    _delete(id) {
        return fetch(`${databaseURL}/texts/${id}.json`, {
            method: 'DELETE'
        }).then(res => {
            if (res.status != 200) {
                throw new Error(res.statusText);
            }
            return res.json();
        }).then(() => {
            let nextState = this.state.texts;
            delete nextState[id];
            this.setState({ texts: nextState });
        })
    }

    componentDidMount() {
        this._get();
    }

    handleDialogToggle = () => this.setState({
        dialog: !this.state.dialog,
        fileName: '',
        fileContent: '',
        textName: ''
    })

    //리엑트에서 사용자가 단어를 입력하는 동안에 단어의 상태를 보여주기위해 처리
    handleValueChange = (e) => {
        let nextState = {};
        nextState[e.target.name] = e.target.value;
        this.setState(nextState);
    }

    //사용자가 단어 추가 버튼을 눌렀을 때
    handleSubmit = () => {
        const text = {
            textName: this.state.textName,
            textContent: this.state.fileContent
        }
        this.handleDialogToggle();
        if (!text.textName && !text.textContent) {
            return;
        }
        this._post(text);
    }

    //사용자가 삭제 버튼을 눌렀을때
    handelDelete = (id) => {
        this._delete(id);
    }

    handleFileChange = (e) => {
        let reader = new FileReader();
        reader.onload = () => {
            let text = reader.result;
            this.setState({ fileContent: text });
        }
        reader.readAsText(e.target.files[0], "EUC-KR") //윈도우 사용자는 일반적으로 EUC-KR 해야 메모장이 읽혀짐
        this.setState({
            fileName: e.target.value
        })
    }

    render() {
        const { classes } = this.props;
        return (
            <div>
                {Object.keys(this.state.texts).map(id => {
                    const text = this.state.texts[id];
                    return (
                        <Card key={id}>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>
                                    내용: {text.textContent.substring(0, 24) + "..."}
                                </Typography>
                                <Grid container>
                                    <Grid item xs={6}>
                                        <Typography variant="h5" component="h2">
                                            {text.textName.substring(0, 14) + "..."}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Typography variant="h5" component="h2">
                                            <Link component={RouterLink} to={"detail/"+id}>
                                                <Button variant="contained" color="primary">보기</Button>
                                            </Link>
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Button variant="contained" color="primary" onClick={() => this._delete(id)}>삭제</Button>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    )
                })}
                <Fab color="primary" className={classes.fab} onClick={this.handleDialogToggle}>
                    <AddIcon />
                </Fab>
                <Dialog open={this.state.dialog} onClose={this.handleDialogToggle}>
                    <DialogTitle>텍스트 추가</DialogTitle>
                    <DialogContent>
                        <TextField label="텍스트 이름" type="text" name="textName" value={this.state.textName} onChange={this.handleValueChange} /><br />
                        <input className={classes.hidden} accept="text/plain" id="raised-button-file" type="file" file={this.state.file} value={this.state.fileName} onChange={this.handleFileChange} />
                        <label htmlFor="raised-button-file">
                            <Button variant="contained" color="primary" component="span" name="file">
                                {this.state.fileName === "" ? ".txt 파일 선택" : this.state.fileName}
                            </Button>
                        </label>
                        <TextTruncate
                            line={1}
                            truncateText="..."
                            text={this.state.fileContent}
                        />
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

export default withStyles(styles)(Texts);