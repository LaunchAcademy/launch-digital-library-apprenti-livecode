import pg from "pg";

const pool = new pg.Pool({
  connectionString:
    "postgres://postgres:postgres@localhost:5432/launch_digital_library_development",
});

class Book {
  constructor({id, title, author, page_count, pageCount, description, fiction}) {
    this.id = id;
    this.title = title;
    this.author = author;
    this.pageCount = page_count || pageCount;
    this.description = description;
    this.fiction = fiction;
  }

  static async findAll() {
    try {
      const client = await pool.connect();
      const result = await client.query("SELECT * FROM books;");

      //get the results
      // console.log(result.rows);
      const bookData = result.rows;
      const books = bookData.map((book) => {
        // console.log(book)
        return new this(book);
      });
      //release the connection back to the pool
      client.release();
      return books;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  static async findById(id) {
    try {
      const client = await pool.connect();

      //Version 1
      // const query = "SELECT * FROM books WHERE ID = " + id + ";"
      // const result = await client.query(query)

      //Version 2 Using Placeholders
      const query = "SELECT * FROM books WHERE id = $1";
      const result = await client.query(query, [id]);

      //get results
      console.log(result.rows);
      const bookData = result.rows[0];
      const book = new this(bookData);

      //release the connection
      client.release();
      return book;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async save() {
    try {
      const client = await pool.connect();
      // Version 1
      // let query = 'INSERT INTO books (title, author, page_count, description, fiction) VALUES ('
      // query += `'${this.title}', '${this.author}', ${this.page_count}, '${this.description}', ${this.fiction})`
      // await client.query(query)

      // Version 2: Using Placeholders
      let query =
        "INSERT INTO books (title, author, page_count, description, fiction) VALUES ($1, $2, $3, $4, $5)";
      await client.query(query, [
        this.title,
        this.author,
        this.pageCount,
        this.description,
        this.fiction,
      ]);

      const result = await client.query(
        "SELECT * FROM books ORDER BY ID DESC LIMIT 1"
      );
      const newBookData = result.rows[0];
      this.id = newBookData.id;

      //release the connection back to the pool
      client.release();
      return true;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}

export default Book;
