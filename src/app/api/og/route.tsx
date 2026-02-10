import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0a0a0a',
          backgroundImage: 'radial-gradient(circle at 30% 50%, rgba(16, 185, 129, 0.15) 0%, transparent 50%)',
        }}
      >
        {/* V Logo */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 60,
          }}
        >
          <svg width="200" height="200" viewBox="0 0 512 512">
            <defs>
              <linearGradient id="glow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
            </defs>
            <path d="M150 100 L256 400 L362 100 L300 100 L256 280 L212 100 Z" fill="url(#glow)"/>
          </svg>
        </div>

        {/* Text */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
          }}
        >
          <div
            style={{
              fontSize: 80,
              fontWeight: 800,
              color: 'white',
              letterSpacing: 6,
            }}
          >
            VANTIX
          </div>
          <div
            style={{
              fontSize: 28,
              fontWeight: 500,
              color: '#10b981',
              letterSpacing: 4,
              marginTop: 8,
            }}
          >
            GET ORGANIZED
          </div>
          <div
            style={{
              fontSize: 20,
              color: '#666666',
              marginTop: 16,
            }}
          >
            usevantix.com
          </div>
        </div>

        {/* Bottom accent */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 8,
            background: 'linear-gradient(90deg, #10b981, #059669)',
          }}
        />
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
