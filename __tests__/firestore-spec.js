const firebase = require("@firebase/testing");
const fs = require("fs");

describe("Minimal test", () => {
  const projectId = "hello";

  beforeAll(() => {
    firebase.loadFirestoreRules({
      projectId: projectId,
      rules: fs.readFileSync("firestore.rules", "utf8"),
    });
  });

  afterAll(() =>
    Promise.all(
      firebase.apps().map((app) => {
        app.delete();
      })
    )
  );

  test("Can't read data with anonynous request", async () => {
    const db = firebase.initializeTestApp({ projectId }).firestore();
    const ref = db.collection("hello-world");
    expect(await firebase.assertFails(ref.get()));
  });

  test("Can read data with authenicated request", async () => {
    const db = firebase
      .initializeTestApp({
        projectId: projectId,
        auth: { uid: "user", email: "user@demo.com" },
      })
      .firestore();
    const ref = db.collection("hello-world");
    expect(await firebase.assertSucceeds(ref.get()));
  });
});
