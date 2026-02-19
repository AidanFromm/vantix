import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4EFE8] px-6">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-2xl bg-[#B07A45]/10 flex items-center justify-center mx-auto mb-8">
          <span className="text-3xl font-bold text-[#B07A45]">404</span>
        </div>
        <h1 className="text-3xl font-bold text-[#1C1C1C] mb-4">Page Not Found</h1>
        <p className="text-[#7A746C] leading-relaxed mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-[#B07A45] text-white font-semibold hover:bg-[#8E5E34] transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
