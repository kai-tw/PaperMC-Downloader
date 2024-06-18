import { strict as assert } from "node:assert";
import { Operations } from "./modules/Operations.mjs";

const operation = process.argv[2];
assert.deepEqual(typeof operation, "string", "You should provide the operation.\nAvailable Operations: " + Object.keys(Operations).join(", "));

assert.deepEqual(typeof Operations[operation], "function", "Unknown operation.");
Operations[operation]();