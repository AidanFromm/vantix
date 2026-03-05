import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#1C1C1C',
          position: 'relative',
        }}
      >
        {/* Bronze gradient glow */}
        <div
          style={{
            position: 'absolute',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(176,122,69,0.15) 0%, transparent 70%)',
            left: '80px',
            top: '115px',
          }}
        />

        {/* Left: Logo V */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '160px',
            height: '160px',
            marginRight: '60px',
            fontSize: '120px',
            fontWeight: 900,
            color: '#B07A45',
            fontFamily: 'sans-serif',
          }}
        >
          V
        </div>

        {/* Right: Text */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div
            style={{
              fontSize: '64px',
              fontWeight: 800,
              color: '#FFFFFF',
              letterSpacing: '8px',
              fontFamily: 'sans-serif',
            }}
          >
            VANTIX
          </div>
          <div
            style={{
              width: '180px',
              height: '3px',
              backgroundColor: '#B07A45',
            }}
          />
          <div
            style={{
              fontSize: '22px',
              color: '#B07A45',
              fontWeight: 500,
              letterSpacing: '3px',
              fontFamily: 'sans-serif',
            }}
          >
            AI-POWERED INFRASTRUCTURE
          </div>
          <div
            style={{
              fontSize: '16px',
              color: '#7A746C',
              marginTop: '8px',
              fontFamily: 'sans-serif',
            }}
          >
            Automation · Websites · Dashboards · AI Systems
          </div>
        </div>

        {/* Bottom right URL */}
        <div
          style={{
            position: 'absolute',
            bottom: '30px',
            right: '40px',
            fontSize: '14px',
            color: '#7A746C',
            letterSpacing: '2px',
            fontFamily: 'sans-serif',
          }}
        >
          usevantix.com
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
