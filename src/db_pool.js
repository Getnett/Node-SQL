const pg = require("pg");

class Pool {
  // using the class method to connect to the database allows connection with multiple databases
  _pool = null;
  connect(options) {
    this._pool = new pg.Pool(options);
    return this._pool.query("SELECT 1 + 1;"); // allows the pool to start connection to postgres
  }

  close() {
    if (this._pool) {
      return this._pool.end();
    }
    throw Error("Closing before creating connection");
  }

  query(sql, params) {
    return this._pool.query(sql, params); // This will prevent SQL exploit attack
  }
}

module.exports = new Pool();
