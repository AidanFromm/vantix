'use client';

const logos = ['SecuredTampa', 'Just Four Kicks', 'CardLedger', 'Vantix'];

export default function SocialProofBar() {
  return (
    <section className="py-8 bg-[#EEE6DC]">
      <p
        className="text-[#7A746C] text-sm tracking-widest uppercase text-center mb-6"
        style={{ fontFamily: 'var(--font-satoshi, "Satoshi", sans-serif)' }}
      >
        Trusted by businesses ready to scale
      </p>
      <div className="overflow-hidden group">
        <div
          className="flex whitespace-nowrap animate-marquee group-hover:[animation-play-state:paused]"
        >
          {[...logos, ...logos].map((name, i) => (
            <span
              key={i}
              className="mx-8 sm:mx-12 text-lg sm:text-xl font-medium text-[#7A746C]/50 shrink-0"
              style={{ fontFamily: 'var(--font-satoshi, "Satoshi", sans-serif)' }}
            >
              {name}
            </span>
          ))}
          {[...logos, ...logos].map((name, i) => (
            <span
              key={`dup-${i}`}
              className="mx-8 sm:mx-12 text-lg sm:text-xl font-medium text-[#7A746C]/50 shrink-0"
              style={{ fontFamily: 'var(--font-satoshi, "Satoshi", sans-serif)' }}
            >
              {name}
            </span>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </section>
  );
}
