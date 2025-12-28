import Link from 'next/link';
import { Tv } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center px-4">
        <Tv className="size-24 text-zinc-600 mx-auto mb-6" />
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          TV Show Not Found
        </h1>
        <p className="text-zinc-400 text-lg mb-8">
          The TV show you're looking for doesn't exist or has been removed.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-white text-black rounded-lg font-semibold hover:bg-white/90 transition-colors"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
}

