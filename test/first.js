let expect = require("chai").expect;
const {validate} = require("uuid");

describe("Sample test", () => {
  it("should pass ", () => {
    expect(validate("53ec1c8c-80ad-4442-a43f-3d24db031040")).to.equal(true);
  });
});
