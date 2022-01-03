const esbuild = require("esbuild");

esbuild
  .build({
    entryPoints: ["src/index.js"],
    outdir: "lib",
    bundle: true,
    sourcemap: true,
    minify: true,
    platform: "node",
    target: ["node10.4"],
  })
  .catch(() => process.exit(1));
