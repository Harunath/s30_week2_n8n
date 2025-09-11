// import { defineConfig, type Options } from "tsup";

// export default defineConfig((options: Options) => ({
// 	entry: ["src/**/*"],
// 	clean: true,
// 	format: ["cjs"],
// 	...options,
// }));

import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["src/index.ts"],
	format: ["cjs"],
	platform: "node",
	target: "node20",
	splitting: false,
	clean: true,
	dts: false,
	sourcemap: true,
	external: ["bcrypt", "@prisma/client", "@repo/db"],
});
