/* eslint-disable react/no-unknown-property */
import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsSearch, BsFillStarFill} from 'react-icons/bs'
import {Link} from 'react-router-dom'
import Header from '../Header'
import Footer from '../Footer'
import './index.css'

const bookshelvesList = [
  {
    id: '22526c8e-680e-4419-a041-b05cc239ece4',
    value: 'ALL',
    label: 'All',
  },
  {
    id: '37e09397-fab2-46f4-9b9a-66b2324b2e22',
    value: 'READ',
    label: 'Read',
  },
  {
    id: '2ab42512-3d05-4fba-8191-5122175b154e',
    value: 'CURRENTLY_READING',
    label: 'Currently Reading',
  },
  {
    id: '361d5fd4-9ea1-4e0c-bd47-da2682a5b7c8',
    value: 'WANT_TO_READ',
    label: 'Want to Read',
  },
]

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class Bookshelves extends Component {
  state = {
    apiStatus: apiStatusConstants.inProgress,
    booksList: [],
    search: '',
    shelf: 'ALL',
  }

  componentDidMount() {
    this.getBooksData()
  }

  getBooksData = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const {search, shelf} = this.state
    const jwtToken = Cookies.get('jwt_token')

    const url = `https://apis.ccbp.in/book-hub/books?shelf=${shelf}&search=${search}`

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
        rating: eachBook.rating,
        readStatus: eachBook.read_status,
        title: eachBook.title,
      }))

      this.setState({
        booksList: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onChangeSearchInput = event => {
    this.setState({search: event.target.value})
  }

  onClickSearchButton = () => {
    this.getBooksData()
  }

  onClickShelfButton = value => {
    this.setState({shelf: value}, this.getBooksData)
  }

  renderSearchInput = () => {
    const {search} = this.state

    return (
      <div className="search-container">
        <input
          type="search"
          value={search}
          onChange={this.onChangeSearchInput}
          placeholder="Search"
        />
        <button
          type="button"
          testid="searchButton"
          onClick={this.onClickSearchButton}
        >
          <BsSearch />
        </button>
      </div>
    )
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
      <button type="button" onClick={this.getBooksData}>
        Try Again
      </button>
    </div>
  )

  renderBooksList = () => {
    const {booksList} = this.state

    return booksList.length === 0 ? (
      <div className="no-books-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/BookHub/failure-img.png"
          alt="no books"
        />
      </div>
    ) : (
      <ul className="books-list">
        {booksList.map(eachBook => (
          <li key={eachBook.id} className="book-item">
            <Link to={`/books/${eachBook.id}`} className="book-link">
              <img src={eachBook.coverPic} alt={eachBook.title} />

              <div className="book-details-card">
                <h1>{eachBook.title}</h1>
                <p>{eachBook.authorName}</p>

                <div className="rating-container">
                  <p>Avg Rating</p>
                  <BsFillStarFill className="star-icon" />
                  <p>{eachBook.rating}</p>
                </div>

                <div className="status-container">
                  <p>Status</p>
                  <span className="status-text">{eachBook.readStatus}</span>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    )
  }

  render() {
    const {apiStatus, shelf, search, booksList} = this.state

    const activeShelf = bookshelvesList.find(
      eachShelf => eachShelf.value === shelf,
    )

    const shelfLabel = activeShelf ? activeShelf.label : 'All'

    return (
      <>
        <Header />

        <div className="bookshelves-route-container">
          <div className="shelves-sidebar">
            <h1>Bookshelves</h1>

            <ul className="shelves-buttons-list">
              {bookshelvesList.map(eachShelf => (
                <li key={eachShelf.id}>
                  <button
                    type="button"
                    className={`shelf-button ${
                      shelf === eachShelf.value ? 'active-shelf' : ''
                    }`}
                    onClick={() => this.onClickShelfButton(eachShelf.value)}
                  >
                    {eachShelf.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="bookshelves-view-container">
            <div className="header-search-container">
              <h1>{shelfLabel} Books</h1>
              {this.renderSearchInput()}
            </div>

            {(() => {
              switch (apiStatus) {
                case apiStatusConstants.inProgress:
                  return this.renderLoadingView()

                case apiStatusConstants.success:
                  return booksList.length === 0 ? (
                    <div className="no-books-container">
                      <img
                        src="https://assets.ccbp.in/frontend/react-js/BookHub/failure-img.png"
                        alt="no books"
                      />
                      <p>Your search for {search} did not find any matches.</p>
                    </div>
                  ) : (
                    this.renderBooksList()
                  )

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

export default Bookshelves
