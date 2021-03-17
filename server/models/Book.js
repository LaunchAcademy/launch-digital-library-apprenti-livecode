import pg from "pg"
import _ from "lodash"

const pool = new pg.Pool({
  connectionString: "postgres://postgres:postgres@localhost:5432/launch_digital_library_development"
})

class Book {
  constructor({ id, title, author, page_count, pageCount, description, fiction}) {
    this.id = id
    this.title = title
    this.author = author
    this.pageCount = page_count || pageCount
    this.description = description
    this.fiction = fiction
  }
  
  static async findAll() {
    try {
      const client = await pool.connect()
      const result = await client.query("SELECT * FROM books;")
      const booksData = result.rows

      const books = booksData.map((book) => {
        return new this(book)
      })

      client.release()

      return books
    } catch (error) {
      console.error(error)
      pool.end()
    }
  }

  static async findById(id) {
    try {
      const client = await pool.connect()
      const result = await client.query("SELECT * FROM books WHERE id = $1", [id])
      // console.log(result)

      const bookData = result.rows[0]

      const book = new this(bookData)

      client.release()

      return book      
    } catch (error) {
      console.error(error)
      pool.end()
    }
  }

  async save() {
    try {
      const client = await pool.connect()
      const query = "INSERT INTO books (title, author, page_count, description, fiction) VALUES ($1, $2, $3, $4, $5)"
      const values = [this.title, this.author, this.pageCount, this.description, this.fiction]
      await client.query(query, values)

      const result = await client.query("SELECT * FROM books ORDER BY id DESC LIMIT 1")
      const newBook = result.rows[0]
      console.log(newBook)
      this.id = newBook.id

      client.release()

      return true
    } catch (error) {
      console.error(error)
      pool.end()
      return false
    }
  }
}

export default Book