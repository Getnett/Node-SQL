const { randomBytes } = require("crypto");
const { default: migrate } = require("node-pg-migrate");
const format = require("pg-format");
const dbPool = require("./db_pool");

const DEFAULT_OPS = {
  host: process.env.LOCAL_DATABASE_SERVER_DOMAIN || "localhost",
  port: process.env.LOCAL_DATABASE_SERVER_PORT || "5432",
  database: process.env.LOCAL_DATABASE_NAME || "users-crud-test",
  user: process.env.LOCAL_DATABASE_USER || "postgres",
  password: "",
};

class Context {
  static async build() {
    // Randomly generate a role name to connect PG as user

    const roleName = "a" + randomBytes(4).toString("hex");

    // Connect to PG as usual

    await dbPool.connect(DEFAULT_OPS);

    // Create a new role in PG

    await dbPool.query(
      format("CREATE ROLE %I WITH LOGIN PASSWORD %L;", roleName, roleName)
    );

    // Create a schema with the name as the role

    await dbPool.query(
      format("CREATE SCHEMA %I AUTHORIZATION %I;", roleName, roleName)
    );

    // Disconnect entirly from PG

    await dbPool.close();

    // Run migration in the new schema

    await migrate({
      schema: roleName,
      direction: "up",
      log: () => {},
      noLock: true,
      dir: "migrations",
      databaseUrl: {
        host: process.env.LOCAL_DATABASE_SERVER_DOMAIN || "localhost",
        port: process.env.LOCAL_DATABASE_SERVER_PORT || "5432",
        database: process.env.LOCAL_DATABASE_NAME || "users-crud-test",
        user: roleName,
        password: roleName,
      },
    });

    // connect to PG as role name
    await dbPool.connect({
      host: process.env.LOCAL_DATABASE_SERVER_DOMAIN || "localhost",
      port: process.env.LOCAL_DATABASE_SERVER_PORT || "5432",
      database: process.env.LOCAL_DATABASE_NAME || "users-crud-test",
      user: roleName,
      password: roleName,
    });

    return new Context(roleName);
  }

  constructor(roleName) {
    this.roleName = roleName;
  }

  async close() {
    // Disconnect from PG
    await dbPool.close();

    // Reconnect as a root user
    await dbPool.connect(DEFAULT_OPS);

    // Delete the role and schema we created
    await dbPool.query(format("DROP SCHEMA %I CASCADE;", this.roleName));
    await dbPool.query(format("DROP ROLE %I", this.roleName));

    // Disconnect
    await dbPool.close();
  }

  async reset() {
    return dbPool.query("DELETE FROM users;");
  }
}
module.exports = Context;
