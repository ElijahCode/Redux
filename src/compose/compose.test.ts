import { compose } from "./compose";

describe("Test compose function", () => {
  it("Test compose without pass args", () => {
    let number = 3;
    function a() {
      number *= 3;
    }
    function b() {
      number += 3;
    }
    function c() {
      number -= 4;
    }

    const result = compose(a, b, c);
    result();

    expect(number).toBe(6);
  });
  it("Test compose with using 1 argument", () => {
    function a(number) {
      return number * 3;
    }
    function b(number) {
      return number + 3;
    }
    function c(number) {
      return number - 4;
    }

    const composeFun = compose(a, b, c);
    const result = composeFun(3);

    expect(result).toBe(6);
  });
});
