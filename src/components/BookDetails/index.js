/* eslint-disable react/no-unknown-property */
import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsFillStarFill} from 'react-icons/bs'
import Header from '../Header'
import Footer from '../Footer'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class BookDetails extends Component {
  state = {apiStatus: apiStatusConstants.inProgress, bookDetailsData: {}}

  componentDidMount() {
    this.getBookDetailsData()
  }

  getBookDetailsData = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/book-hub/books/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    if (response.ok) {
      const data = await response.json()
      const updatedData = {
        aboutAuthor: data.book_details.about_author,
        aboutBook: data.book_details.about_book,
        authorName: data.book_details.author_name,
        coverPic: data.book_details.cover_pic,
        id: data.book_details.id,
        rating: data.book_details.rating,
        readStatus: data.book_details.read_status,
        title: data.book_details.title,
      }
      this.setState({
        bookDetailsData: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderLoadingView = () => (
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
      <button type="button" onClick={this.getBookDetailsData}>
        Try Again
      </button>
    </div>
  )

  renderSuccessView = () => {
    const {bookDetailsData} = this.state
    const {
      aboutAuthor,
      aboutBook,
      authorName,
      coverPic,
      rating,
      readStatus,
      title,
    } = bookDetailsData

    return (
      <div className="book-details-content">
        <div className="book-main-info">
          <img src={coverPic} alt={title} />
          <div>
            <h1>{title}</h1>
            <p>{authorName}</p>
            <p>Avg Rating {rating}</p>
            <BsFillStarFill />
            <p>
              Status: <span>{readStatus}</span>
            </p>
          </div>
        </div>
        <hr />
        <h1>About Author</h1>
        <p>{aboutAuthor}</p>
        <h1>About Book</h1>
        <p>{aboutBook}</p>
      </div>
    )
  }

  render() {
    const {apiStatus} = this.state
    return (
      <>
        <Header />
        <div className="book-details-route-container">
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
        <Footer />
      </>
    )
  }
}

export default BookDetails
