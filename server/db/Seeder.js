import pg from 'pg'
const pool = new pg.Pool({connectionString:"postgres://postgres:password@localhost:5432/launch_digital_library_development"})

class Seeder {
  static async seed() {
    try {
      const query = "INSERT INTO books (title, author, page_count, description, fiction) VALUES ($1, $2, $3, $4, $5)"
      
      const record1 = ["How Far You'll Go", "Dr.Seuss", 20, "children's", true]
      await pool.query(query, record1)
      
      const record2 = ["Green Eggs and Ham", "Dr.Seuss", "25", "children's", "true"]
      await pool.query(query, record2)

      const result = await pool.query("SELECT * FROM books;")
      console.log(result.rows)
      pool.end()
    } catch (error) {
      pool.end()
    }
  }
}

export default Seeder