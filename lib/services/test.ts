const Test = require("../models/test");

exports.createTest = async ({
  name,
  description,
  duration,
  requirements,
  cost,
}: any) => {
  return new Test({
    name: name,
    description: description,
    cost: cost,
    averageTime: duration,
    requirements: requirements,
  }).save();
};


exports.findByName = (testName: string) => {
  return Test.find({ name: { $regex:  new RegExp("/*" + testName + "*/")}}).exec();
}