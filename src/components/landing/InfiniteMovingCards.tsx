'use client';

interface InfiniteMovingCardsProps {
  items: { quote?: string; name?: string; title?: string; content?: string }[];
  speed?: number;
  direction?: 'left' | 'right';
  className?: string;
}

export default function InfiniteMovingCards({
  items,
  speed = 40,
  direction = 'left',
  className = '',
}: InfiniteMovingCardsProps) {
  const animDir = direction === 'left' ? 'normal' : 'reverse';

  const card = (item: (typeof items)[0], i: number) => (
    <div
      key={i}
      className="flex-shrink-0 w-[300px] md:w-[350px] p-6 mx-3 rounded-2xl border border-[#E3D9CD] bg-[#EEE6DC]"
    >
      {item.quote && (
        <p className="text-[#7A746C] text-sm leading-relaxed mb-4">&ldquo;{item.quote}&rdquo;</p>
      )}
      {item.content && (
        <p className="text-[#7A746C] text-sm leading-relaxed mb-4">{item.content}</p>
      )}
      {item.name && (
        <div>
          <p className="text-[#B07A45] font-semibold text-sm">{item.name}</p>
          {item.title && <p className="text-[#7A746C] text-xs">{item.title}</p>}
        </div>
      )}
    </div>
  );

  return (
    <div className={`overflow-hidden ${className}`}>
      <div
        className="flex w-max"
        style={{
          animation: `marquee-cards ${speed}s linear infinite`,
          animationDirection: animDir,
        }}
      >
        <div className="flex shrink-0">{items.map((item, i) => card(item, i))}</div>
        <div className="flex shrink-0" aria-hidden>{items.map((item, i) => card(item, i + items.length))}</div>
      </div>
      <style jsx>{`
        @keyframes marquee-cards {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
