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
          backgroundColor: '#F4EFE8',
          backgroundImage: 'radial-gradient(circle at 30% 50%, rgba(184, 137, 90, 0.12) 0%, transparent 50%), radial-gradient(circle at 70% 50%, rgba(184, 137, 90, 0.08) 0%, transparent 50%)',
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
          <div style={{
            width: 160,
            height: 160,
            borderRadius: 40,
            background: 'linear-gradient(135deg, #8E5E34, #9A7048)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '8px 8px 24px rgba(0,0,0,0.15), -4px -4px 12px rgba(255,255,255,0.8)',
          }}>
            <div style={{ fontSize: 100, fontWeight: 800, color: 'white', lineHeight: 1 }}>V</div>
          </div>
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
              color: '#1C1C1C',
              letterSpacing: 4,
            }}
          >
            VANTIX
          </div>
          <div
            style={{
              fontSize: 26,
              fontWeight: 600,
              color: '#8E5E34',
              letterSpacing: 3,
              marginTop: 8,
            }}
          >
            AI-POWERED SOLUTIONS
          </div>
          <div
            style={{
              fontSize: 20,
              color: '#7A746C',
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
            height: 6,
            background: 'linear-gradient(90deg, #8E5E34, #D4A76A, #8E5E34)',
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
