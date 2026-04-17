interface SkeletonProps {
  className?: string;
  rounded?: string;
}

export default function Skeleton({
  className = "h-4 w-full",
  rounded = "rounded-lg",
}: SkeletonProps) {
  return (
    <div
      aria-hidden
      className={`${rounded} ${className} relative overflow-hidden bg-slate-100`}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer bg-[length:400px_100%]" />
    </div>
  );
}
