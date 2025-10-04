//import { createDefaultPreset } from "ts-jest";

//const tsJestTransformCfg = createDefaultPreset().transform;

export default {
  testEnvironment: "node",
  transform: {
    //...tsJestTransformCfg,
    "^.+\\.ts$": ["ts-jest", { tsconfig: "tsconfig.test.json" }],
  },
  roots: ["src/tests"], 
  moduleFileExtensions: ["ts", "js", "json"],
};