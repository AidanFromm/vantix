import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://usevantix.com'
  const now = new Date().toISOString()

  return [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/portfolio`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog/ai-automation-small-business`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog/custom-website-vs-template-2026`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog/cost-of-no-website`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog/ai-chatbot-customer-support-small-business`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog/from-spreadsheets-to-dashboards-business-intelligence`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog/what-is-ai-automation-plain-english-guide`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog/securedtampa-ecommerce-case-study`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog/7-signs-business-ready-for-ai`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/roi-calculator`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ]
}
