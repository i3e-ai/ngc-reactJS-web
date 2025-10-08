import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  sassOptions:{
    includePaths:['./src'],
    prependData:`@import "./src/app/styles/styles.less"`
  }
};

export default nextConfig;
