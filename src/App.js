import React, { useState, useEffect } from 'react';
import './App.css';
import booksData from './BooksData';
import { CiHeart } from "react-icons/ci";
import { IoSearchSharp } from "react-icons/io5";

function App() {
  const [selectedBook, setSelectedBook] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [wishlist, setWishlist] = useState(() => {
    const savedWishlist = localStorage.getItem('wishlist');
    return savedWishlist ? JSON.parse(savedWishlist) : [];
  });
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleBookClick = (book) => {
    setSelectedBook(book);
  };

  const handleBookChange = (direction) => {
    if (!selectedBook) return;

    const currentIndex = booksData.findIndex(book => book.id === selectedBook?.id);
    const newIndex = (currentIndex + direction + booksData.length) % booksData.length;
    setSelectedBook(booksData[newIndex]);
  };

  const handleWishlistToggle = (book) => {
    const isInWishlist = wishlist.some(item => item.id === book.id);

    let updatedWishlist;
    if (isInWishlist) {
      updatedWishlist = wishlist.filter(item => item.id !== book.id);
    } else {
      updatedWishlist = [...wishlist, book];
    }

    setWishlist(updatedWishlist);
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
  };

  const handleSearchToggle = () => {
    setSearchVisible(!searchVisible);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredBooks = booksData.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % 4);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="App">
      <header className="header">
        <h1><span style={{ color: '#007bff' }}>B</span>ook<span style={{ color: '#007bff' }}>C</span>hor</h1>
        <div className="header-controls">
          <IoSearchSharp
            className="search-icon"
            onClick={handleSearchToggle}
          />
          {searchVisible && (
            <input
              type="text"
              className="search-input"
              placeholder="Search for books..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          )}
        </div>
      </header>

      <div className="store-banner">
        <div className="scroller" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
          <img
            src="https://img.bookchor.com/web_banners/2024083177341.webp"
            alt="bookchor-banner"
          />
          <img
            src="https://img.bookchor.com/web_banners/2024080117433.webp"
            alt="bookchor-banner"
          />
          <img
            src="https://img.bookchor.com/web_banners/2024080333485.webp"
            alt="bookchor-banner"
          />
          <img
            src="https://img.bookchor.com/web_banners/2024090246451.webp"
            alt="bookchor-banner"
          />
        </div>
      </div>

      <div className="top-picks">
        <h3>Our Top Picks</h3>
        <div className="book-grid">
          {filteredBooks.map((book) => (
            <div key={book.id} className="book-item" onClick={() => handleBookClick(book)}>
              <div className="wishlist-icon-container">
                <CiHeart
                  className={`wishlist-icon ${wishlist.some(item => item.id === book.id) ? 'in-wishlist' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleWishlistToggle(book);
                  }}
                />
              </div>
              <img src={book.imageUrl} alt={book.title} />
              <h4>{book.title}</h4>
              <p>{book.author}</p>
            </div>
          ))}
        </div>
      </div>

      {selectedBook && (
        <div className="book-details">
          <div className="details-content">
            <h2>{selectedBook.title}</h2>
            <p><strong>Author:</strong> {selectedBook.author}</p>
            <p><strong>Description:</strong> {selectedBook.description}</p>
            <p><strong>Price:</strong> ₹{selectedBook.price}</p>
            <button onClick={() => setSelectedBook(null)}>Close</button>
            <button onClick={() => handleBookChange(-1)}>Previous</button>
            <button onClick={() => handleBookChange(1)}>Next</button>
          </div>
        </div>
      )}

      <div className="wishlist">
        <h3>Your Wishlist</h3>
        <div className="book-grid">
          {wishlist.length > 0 ? (
            wishlist.map((book) => (
              <div key={book.id} className="book-item">
                <img src={book.imageUrl} alt={book.title} />
                <h4>{book.title}</h4>
                <p>{book.author}</p>
                <button
                  className="wishlist-btn"
                  onClick={() => handleWishlistToggle(book)}
                >
                  Remove from Wishlist
                </button>
              </div>
            ))
          ) : (
            <p>Your wishlist is empty.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
