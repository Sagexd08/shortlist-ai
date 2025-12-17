import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // @ts-ignore
  reactCompiler: true,
  serverExternalPackages: ['pdf2json', 'mammoth', 'natural', 'compute-cosine-similarity'],
};

export default nextConfig;
