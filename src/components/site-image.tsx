import Image from "next/image";
import sizes from "@/data/image-sizes.generated.json";

type Props = {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
};

// Wraps next/image with the real dimensions recorded by `npm run images`.
export function SiteImage({ src, alt, className, priority, sizes: sizesAttr }: Props) {
  const dims = (sizes as Record<string, { width: number; height: number }>)[src] ?? { width: 1600, height: 1000 };
  return (
    <Image
      src={src}
      alt={alt}
      width={dims.width}
      height={dims.height}
      className={className}
      priority={priority}
      sizes={sizesAttr ?? "100vw"}
    />
  );
}
