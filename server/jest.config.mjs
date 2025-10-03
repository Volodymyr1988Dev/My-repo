import { createDefaultPreset } from "ts-jest";

const tsJestTransformCfg = createDefaultPreset().transform;

export default {
  testEnvironment: "node",
  transform: {
    ...tsJestTransformCfg,
  },
  roots: ["src/tests"], 
  moduleFileExtensions: ["ts", "js", "json"],
};