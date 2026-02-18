import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F4EFE8] flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <h1 className="text-8xl font-bold text-[#B07A45] mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-[#1C1C1C] mb-4">Page not found</h2>
        <p className="text-[#1C1C1C]/60 mb-8">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-block px-8 py-3 rounded-lg font-medium text-white transition-all shadow-md hover:shadow-lg"
          style={{
            background: 'linear-gradient(135deg, #B07A45, #8E5E34)',
          }}
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
