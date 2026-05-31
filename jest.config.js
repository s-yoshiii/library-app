/** @type {import("jest").Config} **/
export default {
  testEnvironment: "node",
  transform: {
    "^.+\\.tsx?$": ["ts-jest", { tsconfig: "tsconfig.test.json" }],
  },
};