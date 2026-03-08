import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  basePath: "/devarena",
  serverExternalPackages: ["@prisma/client", "@devarena/database"],
};

export default nextConfig;
