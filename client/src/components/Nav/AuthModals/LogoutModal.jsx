import React, { Component } from "react";
import { Modal } from "reactstrap";
import axios from "axios";
import { Button, Icon, Input, Header } from "semantic-ui-react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { toggleLoginLogout, logout } from "../../../actions/actions";
import generateCharacterName from '../../characterName';

class LogoutModal extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleLogout = this.handleLogout.bind(this);
  }

  handleLogout() {
    const { toggleView, toggleLoginLogout, logout, socket } = this.props;
    const guestUsername = generateCharacterName();
    
    let resetUserInfo = {
      userID: null,
      currentUsername: guestUsername,
      userEmail: null,
      rankedGames: null,
      rankedWins: null,
      rankedLosses: null,
      totalGames: null,
    }
    axios
      .post("/auth/logout")
      .then(() => {
        toggleView("off");
        toggleLoginLogout(false);
        logout(resetUserInfo);
        socket.emit('ResetAnonUserSession', guestUsername);
      })
      .catch(err => {
        console.error(err);
      });
  }

  render() {
    return (
      <Modal isOpen={this.props.modalView === "logout"}>
        <div className="logout">
        <Header icon='LogOut' content='Log-Out to Your Account' />
          <p className="question">Are you sure you want to Logout?</p>
          <Button color="blue" onClick={this.handleLogout}>
            <Icon size="large" name="sign out" corner />
            Logout
          </Button>
          <Button
            color="red"
            onClick={() => {
              this.props.toggleView("off");
            }}
          >
            <Icon size="large" name="ban" corner />
            Cancel
          </Button>
        </div>
      </Modal>
    );
  }
}

function mapStateToProps(state) {
  return {
    isLoggedIn: state.isLoggedIn,
    currentUsername: state.currentUsername,
    socket: state.socket,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ toggleLoginLogout, logout }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(LogoutModal);
