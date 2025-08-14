const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
    res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  res.send(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  
  const authorName = req.params.author;
  const booksByAuthor = {};
  const bookKeys = Object.keys(books);
  
    Object.keys(books).forEach((key) => {
        if (books[key].author.toLowerCase() === authorName.toLowerCase()) {
            booksByAuthor[key] = books[key];
        }
    });

    if (Object.keys(booksByAuthor).length > 0) {
        res.send(JSON.stringify(booksByAuthor, null, 4)); // pretty JSON
    } else {
        res.status(404).json({ message: "No books found by this author" });
    }
});



// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const titleName = req.params.title;
  const booksByTitle = {};

  Object.keys(books).forEach((key) => {
    if (books[key].title.toLowerCase() === titleName.toLowerCase()) {
        booksByTitle[key] = books[key];
    }
});

if (Object.keys(booksByTitle).length > 0) {
    res.send(JSON.stringify(booksByTitle, null, 4)); // pretty JSON
} else {
    res.status(404).json({ message: "No books found with this title" });
}

});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;

  if (books[isbn]) {
    // Return only the reviews object
    res.send(JSON.stringify(books[isbn].reviews, null, 4));
} else {
    res.status(404).json({ message: "Book not found" });
}

});

module.exports.general = public_users;
