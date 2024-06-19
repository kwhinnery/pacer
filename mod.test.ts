import { expect } from "@jest/globals";
import PACERClient from "./mod";

test("initTest", () => {
  const client = new PACERClient({
    username: "foo",
    password: "bar",
  });

  expect(client.username).toBe("foo");
  expect(client.password).toBe("bar");
});

test("caseSearchTest", async () => {
  const client = new PACERClient();
  const caseData = await client.findCase({ caseNumber: "1:2002bk20340" });
  expect(caseData.content.length).toBeGreaterThan(0);
});
