let userConfig = undefined
try {
  userConfig = await import('./v0-user-next.config')
} catch (e) {
  console.warn('No user config found:', e.message)
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    dirs: ['pages', 'components', 'lib', 'src'],
  },
  typescript: {
  },
  images: {
    domains: ['localhost', 'your-domain.com'],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
    optimizeCss: true,
    scrollRestoration: true,
  },
  poweredByHeader: false,
  compress: true,
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ]
      }
    ]
  }
}

function mergeConfig(nextConfig, userConfig) {
  if (!userConfig || typeof userConfig !== 'object') {
    return nextConfig
  }

  const result = { ...nextConfig }

  for (const key in userConfig) {
    if (!Object.prototype.hasOwnProperty.call(userConfig, key)) continue

    if (
      typeof result[key] === 'object' &&
      !Array.isArray(result[key]) &&
      result[key] !== null
    ) {
      result[key] = {
        ...result[key],
        ...userConfig[key],
      }
    } else {
      result[key] = userConfig[key]
    }
  }

  return result
}

export default mergeConfig(nextConfig, userConfig?.default || userConfig)
