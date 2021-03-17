import pg from "pg"
import _ from "lodash"

const pool = new pg.Pool({
  connectionString: "postgres://postgres:postgres@localhost:5432/launch_digital_library_development"
})

class Book {

}

export default Book