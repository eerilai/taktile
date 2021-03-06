import React, { Component } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import socketIOClient from 'socket.io-client';
import { bindActionCreators } from 'redux';
import axios from 'axios';
import Nav from './Nav';
import Home from './Home';
import Learn from './Learn';
import About from './About';
import Profile from './Profile';
import Game from './LiveGame';
import Chat from './LiveGame/chat';
import RedirectCreateUsernameModal from './RedirectChangeUsernameModal';
import { setAnonUsername, toggleLoginLogout, login, changeCurrentUsername, setCorrGames } from '../actions/actions';

var sectionStyle = {
  width: '100%',
  height: '100%',
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover'
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      selectModal: '',
    };

    const { socket } = props;

    axios
      .get('/auth/check')
      .then(res => {
        let currentUserInfo = res.data;
        let currentUsername = res.data.currentUsername;

        if (currentUsername !== undefined && currentUsername.includes('Tak-user-')){
          this.setState({selectModal: 'createUsername'});
        }

        if (currentUserInfo[0] !== '<') {
          props.toggleLoginLogout(true);
          props.login(currentUserInfo);
          socket.emit('login', currentUsername);
          this.fetchGames();
        } else {
            socket.emit('AnonUserSession', props.username);
          }
      })
      .catch(err => {
        console.error(err);
      });
      
    socket.on('setAnonUsername', (username) => {
      props.setAnonUsername(username);
    });

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  fetchGames() {
    let { userID } = this.props;
    axios.get(`/users/${userID}/games/current`)
      .then((games) => {
        this.props.setCorrGames(games.data);
      });
  }

  onClose = () => { this.setState({open: false}) }

  handleChange = (e, { value }) => {
    this.setState({selectModal: value})
  }

  handleSubmit(newUsername) {
    const { username, userID, socket } = this.props;
    const currentUsername = username;
    if(newUsername.length > 0){
      axios.post('/auth/changeUsername', { userID, currentUsername, newUsername })
        .then((res) => {
          const updatedUsername = res.data;
          this.props.changeCurrentUsername(updatedUsername);
          this.setState({selectModal: ''});
          socket.emit('login', updatedUsername);
        })
        .catch((err) => {
          console.error(err);
        })
    } else {
      // If an Empty string don't close modal
      this.setState({selectModal: 'createUsername'});
    }
  }

  render() {
    return (
      <div id="page" style={sectionStyle}>
        <Nav />
        <Switch>
          <Route path="/learn" component={Learn} />
          <Route path="/about" component={About} />
          <Route path="/profile/:userName" render={({ match }) => <Profile />} />
          <Route path="/profile" component={Profile} />
          <Route path="/game/:roomId" render={({ match }) => <Game />} />
          <Route path="/" component={Home} />
        </Switch>
        <RedirectCreateUsernameModal 
          selectModal={this.state.selectModal} 
          handleChange={this.handleChange} 
          handleSubmit={this.handleSubmit}
        />
      </div>
    );
  }
};

const mapStateToProps = (state) => {
  return {
    username: state.currentUsername,
    userID: state.userID,
    isLoggedIn: state.isLoggedIn,
    socket: state.socket,
    games: state.games,
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ setAnonUsername, toggleLoginLogout, login, changeCurrentUsername, setCorrGames }, dispatch);
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));