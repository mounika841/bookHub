import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect, withRouter} from 'react-router-dom'
import './index.css'

class Login extends Component {
  state = {username: '', password: '', showError: false, errorMsg: ''}

  onSubmitSuccess = jwtToken => {
    const {history} = this.props
    // Test 104 కోసం కుకీ సెట్ చేయడం
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    // Test 105 కోసం హిస్టరీ కాల్ చేయడం
    history.replace('/')
  }

  onSubmitFailure = errorMsg => {
    this.setState({showError: true, errorMsg})
  }

  submitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}

    // Test 101 కోసం కచ్చితమైన కరెక్ట్ API URL
    const url = 'https://apis.ccbp.in/login'

    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }

    const response = await fetch(url, options)
    const data = await response.json()

    if (response.ok === true) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  render() {
    const {username, password, showError, errorMsg} = this.state
    const jwtToken = Cookies.get('jwt_token')

    if (jwtToken !== undefined) {
      return <Redirect to='/' />
    }

    return (
      <div className='login-form-container'>
        <img
          src='https://ccbp.in'
          className='login-website-logo-desktop-image'
          alt='website login'
        />

        <form className='form-container' onSubmit={this.submitForm}>
          <img
            src='https://ccbp.in'
            className='login-website-logo-mobile-image'
            alt='login website logo'
          />

          <h1 className='login-heading'>Book Hub</h1>

          <div className='input-container'>
            <label className='input-label' htmlFor='username'>
              USERNAME
            </label>
            <input
              type='text'
              id='username'
              className='username-input-field'
              value={username}
              onChange={this.onChangeUsername}
              placeholder='Username'
            />
          </div>

          <div className='input-container'>
            <label className='input-label' htmlFor='password'>
              PASSWORD
            </label>
            <input
              type='password'
              id='password'
              className='password-input-field'
              value={password}
              onChange={this.onChangePassword}
              placeholder='Password'
            />
          </div>

          <button type='submit' className='login-button'>
            Login
          </button>

          {/* Test 103 కోసం ఎస్టరిస్క్ (*) గుర్తు లేకుండా మెసేజ్ మాత్రమే చూపిస్తున్నాము */}
          {showError && <p className='error-message'>{errorMsg}</p>}
        </form>
      </div>
    )
  }
}

export default withRouter(Login)
