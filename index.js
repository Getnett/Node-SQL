require("dotenv").config();
const app = require("./src/app");
const dbPool = require("./src/db_pool");
const PORT = process.env.LOCAL_EXPRESS_SERVER_PORT;

dbPool
  .connect({
    host: process.env.LOCAL_DATABASE_SERVER_DOMAIN,
    port: process.env.LOCAL_DATABASE_SERVER_PORT,
    database: process.env.LOCAL_DATABASE_NAME,
    user: process.env.LOCAL_DATABASE_USER,
    password: "",
  })
  .then((res) => {
    console.log("🚀 Established database database connection!");
    app().listen(PORT, () => {
      console.log("🚀 Server is up on port 5001");
    });
  })
  .catch((error) => {
    console.log(" ❌ Connection to database failed!");
    console.error(error);
  });

console.log(app);
