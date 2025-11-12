/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        // apply to every route (pages & assets)
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value:
              "frame-ancestors 'self' https://exucomics.com https://www.exucomics.com https://weebly.com https://www.weebly.com https://sandbox.weebly.com https://*.weebly.com https://editmysite.com https://www.editmysite.com",
          },
        ],
      },
    ];
  },
};

export default nextConfig;

