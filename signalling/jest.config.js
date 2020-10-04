module.exports = {
  preset: "@shelf/jest-mongodb",
  testTimeout: 30000,
  testResultsProcessor: "jest-junit",
  reporters: ["default", "jest-junit"],
};
