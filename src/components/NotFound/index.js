import {Link} from 'react-router-dom'
import './index.css'

const NotFound = () => (
  <div className="not-found-container">
    <img
      src="https://assets.ccbp.in/frontend/react-js/BookHub/not-found-img.png"
      alt="not found"
      className="not-found-img"
    />
    <h1>Page Not Found</h1>
    <p>
      we are sorry, the page you requested could not be found. Please go back to
      the homepage.
    </p>
    <Link to="/">
      <button type="button" className="go-back-btn">
        Go Back to Home
      </button>
    </Link>
  </div>
)

export default NotFound
