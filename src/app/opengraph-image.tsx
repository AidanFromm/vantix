import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Vantix — Brand & Web Design Studio';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#FAFAF7',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          position: 'relative',
        }}
      >
        {/* Top accent line */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '6px',
            background: 'linear-gradient(90deg, #B8935A 0%, #D4B87A 50%, #B8935A 100%)',
          }}
        />

        {/* Logo wordmark */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '40px' }}>
          <span style={{ fontSize: '42px', fontWeight: 700, color: '#1A1A1A', letterSpacing: '-0.5px' }}>
            Vantix
          </span>
          <span style={{ fontSize: '42px', fontWeight: 700, color: '#B8935A' }}>.</span>
        </div>

        {/* Headline */}
        <div style={{ fontSize: '64px', fontWeight: 700, color: '#1A1A1A', lineHeight: 1.1, marginBottom: '24px', letterSpacing: '-1px' }}>
          Brand & Web Design
          <br />
          <span style={{ color: '#B8935A' }}>Studio</span>
        </div>

        {/* Subtext */}
        <div style={{ fontSize: '24px', color: '#6B6B6B', lineHeight: 1.5, maxWidth: '600px' }}>
          We design brands and build websites that convert.
          Web design, AI automation, and growth.
        </div>

        {/* Bottom info */}
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            left: '80px',
            right: '80px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span style={{ fontSize: '16px', color: '#9090A0', letterSpacing: '2px', textTransform: 'uppercase' as const }}>
            usevantix.com
          </span>
          <div style={{ display: 'flex', gap: '24px' }}>
            <span style={{ fontSize: '14px', color: '#B8935A' }}>Web Design</span>
            <span style={{ fontSize: '14px', color: '#B8935A' }}>AI Automation</span>
            <span style={{ fontSize: '14px', color: '#B8935A' }}>Brand Identity</span>
            <span style={{ fontSize: '14px', color: '#B8935A' }}>SEO & Growth</span>
          </div>
        </div>

        {/* Decorative corner */}
        <div
          style={{
            position: 'absolute',
            top: '40px',
            right: '80px',
            width: '60px',
            height: '60px',
            borderTop: '2px solid #B8935A',
            borderRight: '2px solid #B8935A',
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  );
}
