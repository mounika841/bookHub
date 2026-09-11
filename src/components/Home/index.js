/* eslint-disable react/no-unknown-property */
import {Component} from 'react'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import Slider from 'react-slick'
import Header from '../Header'
import Footer from '../Footer'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class Home extends Component {
  state = {
    apiStatus: apiStatusConstants.inProgress,
    topRatedBooks: [],
  }

  componentDidMount() {
    this.getTopRatedBooks()
  }

  getTopRatedBooks = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/book-hub/top-rated-books'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    if (response.ok) {
      const data = await response.json()
      const updatedData = data.books.map(eachBook => ({
        authorName: eachBook.author_name,
        coverPic: eachBook.cover_pic,
        id: eachBook.id,
        title: eachBook.title,
      }))
      this.setState({
        topRatedBooks: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderLoadingView = () => (
    // CCBP నిబంధనల ప్రకారం testid="loader" ఇక్కడ కరెక్ట్ గా ఉండాలి
    <div className="loader-container" testid="loader">
      <Loader type="TailSpin" color="#0284C7" height={50} width={50} />
    </div>
  )

  renderFailureView = () => (
    <div className="failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/BookHub/failure-img.png"
        alt="failure view"
      />
      <p>Something went wrong. Please try again</p>
      <button type="button" onClick={this.getTopRatedBooks}>
        Try Again
      </button>
    </div>
  )

  renderSuccessView = () => {
    const {topRatedBooks} = this.state
    const settings = {
      dots: false,
      infinite: false,
      speed: 500,
      slidesToShow: 4,
      slidesToScroll: 1,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
          },
        },
      ],
    }

    return (
      <div className="slider-container">
        <Slider {...settings}>
          {topRatedBooks.map(eachBook => (
            <div key={eachBook.id} className="top-rated-book-item">
              <Link to={`/books/${eachBook.id}`}>
                <img
                  src={eachBook.coverPic}
                  alt={eachBook.title}
                  className="top-rated-img"
                />
                <h1 className="top-rated-title">{eachBook.title}</h1>
                <p className="top-rated-author">{eachBook.authorName}</p>
              </Link>
            </div>
          ))}
        </Slider>
      </div>
    )
  }

  render() {
    const {apiStatus} = this.state
    return (
      <>
        <Header />
        <div className="home-container">
          <h1 className="home-heading">Find Your Next Favorite Books?</h1>
          <p className="home-description">
            You are in the right place. Tell us what titles or genres you have
            enjoyed in the past, and we will give you the perfect
            recommendation.
          </p>
          <Link to="/shelf">
            <button type="button" className="find-books-btn">
              Find Books
            </button>
          </Link>
          <div className="top-rated-section">
            <div className="top-rated-header">
              <h1 className="top-rated-heading">Top Rated Books</h1>
            </div>
            {(() => {
              switch (apiStatus) {
                case apiStatusConstants.inProgress:
                  return this.renderLoadingView()
                case apiStatusConstants.success:
                  return this.renderSuccessView()
                case apiStatusConstants.failure:
                  return this.renderFailureView()
                default:
                  return null
              }
            })()}
          </div>
        </div>
        <Footer />
      </>
    )
  }
}

export default Home
