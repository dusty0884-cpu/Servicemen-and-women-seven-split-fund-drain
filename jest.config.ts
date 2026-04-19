import type { Config } from "jest";

const config: Config = {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.tsx?$": ["ts-jest", { tsconfig: "tsconfig.json" }],
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^uuid$": "<rootDir>/__mocks__/uuid.ts",
  },
  testMatch: ["<rootDir>/__tests__/**/*.test.ts", "<rootDir>/__tests__/**/*.test.tsx"],
};

export default config;
