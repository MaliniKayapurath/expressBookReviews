const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const doesExist = (username) => {
    return users.some(user => user.username === username);
};

public_users.post("/register", (req,res) => {
  
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
}

if (doesExist(username)) {
        return res.status(409).json({ message: "User already exists" });
    }

    users.push({ "username": username, "password": password });
    return res.status(201).json({ message: "User successfully registered. Now you can login" });

});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  
    res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  
  const isbn = req.params.isbn;
  res.send(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  
  
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
  
  const isbn = req.params.isbn;

  if (books[isbn]) {
    // Return only the reviews object
    res.send(JSON.stringify(books[isbn].reviews, null, 4));
} else {
    res.status(404).json({ message: "Book not found" });
}

});

module.exports.general = public_users;


/* ================================
   Task 10: Using Promises & Async/Await
   to get list of books with Axios
   ================================ */

// Using Promises
function getBooksUsingPromises() {
    axios.get("https://malinimenonk-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/")   
      .then(response => {
        console.log("Books (using Promises):", response.data);
      })
      .catch(error => {
        console.error("Error fetching books (Promises):", error.message);
      });
  }
  
  // Using async/await
  async function getBooksUsingAsyncAwait() {
    try {
      const response = await axios.get("https://malinimenonk-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/"); 
      console.log("Books (using Async/Await):", response.data);
    } catch (error) {
      console.error("Error fetching books (Async/Await):", error.message);
    }
  }

  // ================================
// Task 11: Get book details by ISBN using Promises & Async/Await
// ================================

// Using Promises
function getBookByISBN_Promise(isbn) {
    axios.get(`https://malinimenonk-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/isbn/${isbn}`)
        .then(response => {
            console.log(`Book details (Promise) for ISBN ${isbn}:`, response.data);
        })
        .catch(error => {
            console.error(`Error fetching book by ISBN ${isbn} (Promise):`, error.message);
        });
}

// Using async/await
async function getBookByISBN_AsyncAwait(isbn) {
    try {
        const response = await axios.get(`https://malinimenonk-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/isbn/${isbn}`);
        console.log(`Book details (Async/Await) for ISBN ${isbn}:`, response.data);
    } catch (error) {
        console.error(`Error fetching book by ISBN ${isbn} (Async/Await):`, error.message);
    }
}

/* ================================
   Task 12: Get book details by author
   using Promises & Async/Await
   ================================ */
   // Using Promises
   function getBooksByAuthorUsingPromises(author) {
       axios.get(`https://malinimenonk-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/author/${author}`)
         .then(response => {
           console.log(`Books by ${author} (using Promises):`, response.data);
         })
         .catch(error => {
           console.error(`Error fetching books by ${author} (Promises):`, error.message);
         });
   }
   
   // Using async/await
   async function getBooksByAuthorUsingAsyncAwait(author) {
       try {
           const response = await axios.get(`https://malinimenonk-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/author/${author}`);
           console.log(`Books by ${author} (using Async/Await):`, response.data);
       } catch (error) {
           console.error(`Error fetching books by ${author} (Async/Await):`, error.message);
       }
   }
  
   /* ================================
   Task 13: Get book details by title
   using Promises & Async/Await
   ================================ */

const titleName = "Pride and Prejudice"; // Example title, replace with dynamic input

// Using Promises
function getBooksByTitleUsingPromises(title) {
    axios.get(`https://malinimenonk-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/title/${title}`)
      .then(response => {
        console.log(`Books with title "${title}" (using Promises):`, response.data);
      })
      .catch(error => {
        console.error(`Error fetching books with title "${title}" (Promises):`, error.message);
      });
}

// Using async/await
async function getBooksByTitleUsingAsyncAwait(title) {
    try {
        const response = await axios.get(`https://malinimenonk-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/title/${title}`);
        console.log(`Books with title "${title}" (using Async/Await):`, response.data);
    } catch (error) {
        console.error(`Error fetching books with title "${title}" (Async/Await):`, error.message);
    }
}
  
  
  getBooksUsingPromises();
  getBooksUsingAsyncAwait();

  getBookByISBN_Promise('1');
  getBookByISBN_AsyncAwait('1');

  getBooksByAuthorUsingPromises("Jane Austen");
  getBooksByAuthorUsingAsyncAwait("Jane Austen");

  getBooksByTitleUsingPromises("Pride and Prejudice");
 getBooksByTitleUsingAsyncAwait("Pride and Prejudice");