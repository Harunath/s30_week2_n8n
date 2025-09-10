// import { PrismaClient } from "@prisma/client";

// const prismaClientSingleton = () => {
// 	return new PrismaClient();
// };

// declare global {
// 	var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
// }

// const prisma: ReturnType<typeof prismaClientSingleton> =
// 	globalThis.prismaGlobal ?? prismaClientSingleton();

// export default prisma;

// if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;

// export * from "@prisma/client"; // Exports models, enums, and Prisma types
// export type { PrismaClient } from "@prisma/client"; // Ensures PrismaClient type is available

import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
	prisma?: PrismaClient;
};

export const prisma =
	globalForPrisma.prisma ??
	new PrismaClient({
		// log: ["query", "error", "warn"], // optional
	});

if (process.env.NODE_ENV !== "production") {
	globalForPrisma.prisma = prisma;
}

// Re-export Prisma types/enums if you like:
export * from "@prisma/client";
