// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['neosapiens.com.br', 'via.placeholder.com'], // 👈 adicionei aqui
  },
};

module.exports = nextConfig;