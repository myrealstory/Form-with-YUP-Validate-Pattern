/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    compress: true,
    swcMinify: true,
    webpack(config) {
        config.module.rules.push({
            test: /\.svg$/,
            use: ["@svgr/webpack"],
        });
        return config;
    },
    images: {
        loader: "custom",
        loaderFile: "./src/loader/image.js",
        remotePatterns: [
        {
            protocol: "https",
            hostname: "**"
        }
        ]

    },
};

export default nextConfig;
