import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar'; //navigation bar
import Drawer from '@material-ui/core/Drawer'; //navigation 이 보여질 수 있도록 하기 위해서
import MenuItem from '@material-ui/core/MenuItem'; //navigation에 들어가는 각각의 아이템들
import IconButton from '@material-ui/core/IconButton';  //Appbar의 왼쪽에 들어갈 아이콘
import MenuIcon from '@material-ui/icons/Menu';

const styles = {
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: 'auto' //왼쪽정렬이 일어남 네비게이션 바가 있으면 왼쪽에 메뉴 버튼을 넣을려고 함
    }
}

class AppShell extends React.Component {
    
    constructor(props){
        super(props);
        this.state = {
            toggle: false
        }
    }
    
    handleDrawerToggle = () => this.setState({toggle: !this.state.toggle})

    render() {
        const {classes} = this.props;      
        return (
            <div className={classes.root}>
                <AppBar position='static'>
                    <IconButton className={classes.menuButton} color='inherit' onClick={this.handleDrawerToggle}>
                        <MenuIcon/>
                    </IconButton>
                </AppBar>
                <Drawer open={this.state.toggle}>
                    <MenuItem onClick ={this.handleDrawerToggle}>Home</MenuItem>
                    <MenuItem onClick ={this.handleDrawerToggle}>Home 2</MenuItem>
                </Drawer>
            </div>
            )
    }
}
export default withStyles(styles)(AppShell);