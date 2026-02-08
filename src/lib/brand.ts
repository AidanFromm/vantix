// Vantix Brand Constants
export const brand = {
  name: 'Vantix',
  tagline: 'Custom Digital Solutions',
  description: 'We build websites, apps, and inventory systems tailored to your business.',
  
  // Colors - Clean & Minimal with a premium accent
  colors: {
    primary: '#0A0A0A',      // Near black
    secondary: '#FAFAFA',    // Off white
    accent: '#3B82F6',       // Clean blue
    accentHover: '#2563EB',  // Darker blue
    muted: '#737373',        // Gray text
    border: '#262626',       // Dark border
    card: '#141414',         // Card background
  },
  
  // Services
  services: [
    {
      title: 'Web Development',
      description: 'Custom websites built for performance, scalability, and conversion.',
      icon: 'Globe',
    },
    {
      title: 'App Development', 
      description: 'Native and cross-platform mobile apps that users love.',
      icon: 'Smartphone',
    },
    {
      title: 'Inventory Systems',
      description: 'Real-time inventory management synced across all your channels.',
      icon: 'Package',
    },
    {
      title: 'Custom Solutions',
      description: 'If you can dream it, we can build it. Fully tailored to your needs.',
      icon: 'Sparkles',
    },
  ],
  
  // Team
  team: [
    { name: 'Aidan', role: 'Technical Lead', emoji: '⚡' },
    { name: 'Kyle', role: 'Business & Strategy', emoji: '📈' },
  ],
} as const;
