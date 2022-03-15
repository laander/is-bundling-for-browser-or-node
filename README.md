# Is bundling for browser or node (?)

Authoring isomorphic packages yourself can be tricky.

When you use a bundler (webpack, rollup, parcel, vite etc.) and import external modules, the bundler reads the `package.json` fields to figure out which file it should use.

If your bundler targets a node.js environment, it usually prefers the `main` field  
If your bundler targets a browser environment, it usually prefers the `browser` field ([see spec](https://docs.npmjs.com/cli/v7/configuring-npm/package-json#browser))

There's two scenarios where isomorphism in js becomes especially hairy:

1. use other 3rd party isomorphic packages that are served at compile-time (not runtime), but you want to use the package on both server and client
2. you want to offer different builds for each environment (browser, node) to avoid polyfilling the native functionality for both environments in the same bundle

One example is when using the [`cross-fetch` lib](https://github.com/lquixada/cross-fetch/issues/80#issuecomment-760594660). It's isomorphic at bundle time, not runtime.

Read more [background here](https://nolanlawson.com/2015/10/19/the-struggles-of-publishing-a-javascript-library/) and [specifically this one](https://nolanlawson.com/2017/01/09/how-to-write-a-javascript-package-for-both-node-and-the-browser/) talks about node.js vs. browser packages

## Usage

Just import the named exports. The magic happens when your bundler resolves this module itself.

**NOTE!** The check happens at bundle/build-time, _NOT_ runtime.

```js
import {
  isFor,
  isForNode,
  isForBrowser,
} from "is-bundling-for-browser-or-node";

// If your bundler targets a node.js environment
expect(isFor).toBe("node");
expect(isForNode).toBe(true);
expect(isForBrowser).toBe(false);

// If your bundler targets a browser environment
expect(isFor).toBe("browser");
expect(isForNode).toBe(false);
expect(isForBrowser).toBe(true);
```

## Example with webpack

Here's a common appraoch to building an isomorphic packages where you provide a bundle for each target environment. Here, we force webpack to prefer different import strategies with the `target` property.

```js
// webpack.config.js
export default [
  // node
  {
    entry: "./src/index.ts",
    target: "node",
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "myLib.node.js",
      library: {
        name: "myLib",
        type: "umd",
        export: "default",
      },
    },
    externals: [nodeExternals()],
  },
  // browser
  {
    entry: "./src/index.ts",
    target: "web",
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "myLib.browser.js",
      library: {
        name: "myLib",
        type: "umd",
        export: "default",
      },
    },
  },
];
```

If you for instance want to offer different default settings for each environment, you can use this package to do so without having to split up your source files into two (i.e. you can keep the same entry).

# License

MIT License
