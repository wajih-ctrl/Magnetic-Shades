import Link from 'next/link';

export function Brand({ inverse=false }: { inverse?: boolean }) {
  return <Link href="/" className="flex items-center gap-3 font-[family-name:var(--font-heading)] font-bold tracking-[-0.03em]">
    <span className={`relative grid size-9 place-items-center rounded-xl ${inverse?'bg-white text-[#171c22]':'bg-[#171c22] text-white'}`}>
      <span className="absolute inset-[9px_6px] rounded-full border-2 border-[#d96b36]" />
      <span className="absolute inset-[13px_11px] rounded-full border-2 border-current" />
    </span>
    <span>Magnetic Shades</span>
  </Link>;
}

