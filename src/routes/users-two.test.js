const request = require("supertest");
const buildApp = require("../app");
const UsersRepo = require("../repos/users_repo");
const Context = require("../context");

let context;

beforeAll(async () => {
  context = await Context.build();
});
beforeEach(async () => {
  await context.reset();
});
afterAll(() => {
  return context.close();
});

it("creates a user", async () => {
  const startingCount = await UsersRepo.countUsers();
  await request(buildApp())
    .post("/users")
    .send({ username: "from test file", bio: "from test bio" })
    .expect(200);

  const afterRequestCount = await UsersRepo.countUsers();
  expect(afterRequestCount - startingCount).toEqual(1);
});
