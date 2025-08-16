const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    return users.some(user => user.username === username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
    return users.some(user => user.username === username && user.password === password);
}

//only registered users can login
/*regd_users.post("/login", (req,res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    if (!authenticatedUser(username, password)) {
        return res.status(401).json({ message: "Invalid username or password" });
    }

    // Create JWT token for session
    const accessToken = jwt.sign({ username }, "access", { expiresIn: "1h" });

    // Save token in session
    req.session.authorization = { accessToken };

    return res.status(200).json({ message: "User successfully logged in", token: accessToken });

});*/

regd_users.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // validate username/password
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }

    // Check if user exists
    let userExists = users.filter((user) => {
        return (user.username === username && user.password === password)
    });

    if (userExists.length > 0) {
        // Generate JWT token
        let accessToken = jwt.sign({ data: password }, 'access', { expiresIn: 60 * 60 });

        // 🔑 Store token in session
        req.session.authorization = {
            accessToken,
            username
        };

        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  /*const isbn = req.params.isbn;
  const review = req.query.review;
  if (!review) {
        return res.status(400).json({ message: "Review query parameter is required" });
    }
    const token = req.session.authorization?.accessToken;
    if (!token) {
        return res.status(401).json({ message: "User not logged in" });
    }
    let username;
    try {
        const decoded = jwt.verify(token, "access");
        username = decoded.username;
    } catch (err) {
        return res.status(403).json({ message: "Invalid token" });
    }
    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }
    if (!books[isbn].reviews) {
        books[isbn].reviews = {};
    }
    books[isbn].reviews[username] = review;

    return res.status(200).json({ 
        message: "Review added/updated successfully", 
        reviews: books[isbn].reviews 
    });*/

    const isbn = req.params.isbn;
  const review = req.query.review;

  if (!review) {
    return res.status(400).json({ message: "Review query parameter is required" });
  }

  const token = req.session.authorization?.accessToken;
  const username = req.session.authorization?.username;

  if (!token) {
    return res.status(401).json({ message: "User not logged in" });
  }

  try {
    jwt.verify(token, "access"); // just to validate token
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (!books[isbn].reviews) {
    books[isbn].reviews = {};
  }

  books[isbn].reviews[username] = review;

  return res.status(200).json({
    message: "Review added/updated successfully",
    reviews: books[isbn].reviews
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
