import express from "express"

import Book from "../../../models/Book.js"

const booksRouter = new express.Router()

booksRouter.get("/", async (req, res) => {
  try {
    const books = await Book.findAll()
    res.json({ books: books })
  } catch (error) {
    console.error(error)
    // res.json({ errors: error })
  }
})

booksRouter.get("/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
    res.json({ book: book })
  } catch (error) {
    console.error(error)
  }
})

booksRouter.post("/", async (req, res) => {
  try {
    const newBookData = req.body
    console.log(req.body)
    const newBook = new Book(newBookData)
    
    await newBook.save()

    // console.log(newBook)
    res.json({ book: newBook })
  } catch (error) {
    console.error(error)
  }
})

export default booksRouter