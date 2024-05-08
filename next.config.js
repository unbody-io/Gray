/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ['@nextui-org/react', '@nextui-org/theme'],
    swcMinify: true,
    reactStrictMode: true,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.cdn.unbody.io',
                port: '',
                pathname: '**'
            }
        ]
    }
};

module.exports = nextConfig;
