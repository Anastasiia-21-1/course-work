import { withSentryConfig } from '@sentry/nextjs';
import { env } from './src/utils/env.mjs';

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client'],
  },
};

export default withSentryConfig(nextConfig, {
  org: 'asiia',
  project: 'javascript-nextjs',
  silent: !env.CI,
  widenClientFileUpload: true,
  reactComponentAnnotation: {
    enabled: true,
  },
  hideSourceMaps: true,
  disableLogger: true,
  automaticVercelMonitors: true,
});
