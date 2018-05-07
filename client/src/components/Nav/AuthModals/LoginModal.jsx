import React, { Component } from 'react';
import { Modal } from 'reactstrap';
import axios from 'axios';

class LoginModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usernameOrEmail: '',
      password: ''
    };
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleUsernameChange(e) {
    this.setState({
      usernameOrEmail: e.target.value
    });
  }

  handlePasswordChange(e) {
    this.setState({
      password: e.target.value
    });
  }

  handleSubmit() {
    const { usernameOrEmail, password } = this.state;
    axios.post('/auth/login', {
      username: usernameOrEmail,
      password
    });
  }

  render() {
    return (
      <Modal isOpen={this.props.modalView === 'login'}>
        <div>
          <a href="/auth/google">
            <button>Sign in with Google</button>
          </a>
          <p>Login</p>
          <form onSubmit={this.handleSubmit}>
            <div>
              <p>Username</p>
              <input type="text" value={this.state.username} onChange={this.handleUsernameChange} />
            </div>
            <div>
              <p>Password</p>
              <input type="text" value={this.state.password} onChange={this.handlePasswordChange} />
            </div>
            <div>
              <button>
                <input type="submit" value="Login" />
              </button>
            </div>
          </form>
          <p>Here for the first time?</p>
          <button onClick={() => { this.props.toggleView('signup') }}>Click here to signup</button>
          <button onClick={() => { this.props.toggleView('off') }}>Cancel</button>
        </div>
      </Modal>
    );
  }
}

export default LoginModal