import assert from "assert";

// make sure various different ways of importing the module work
import nodeModule, { isFor, isForBrowser, isForNode } from "./index-node.js";
import browserModule from "./index-browser.js";

try {
  // node
  assert.deepEqual(nodeModule, {
    isFor: "node",
    isForBrowser: false,
    isForNode: true,
  });
  assert.strictEqual(nodeModule.isForNode, true);
  assert.strictEqual(nodeModule.isForBrowser, false);
  assert.strictEqual(isFor, "node");
  assert.strictEqual(isForNode, true);
  assert.strictEqual(isForBrowser, false);
  // browser
  assert.strictEqual(browserModule.isForBrowser, true);
  assert.strictEqual(browserModule.isForNode, false);
  console.log("✅", "Test passed");
} catch (e) {
  console.log("❌", "Test failed");
  console.error(e);
}
