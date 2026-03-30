import Image from 'next/image'

type MascotPose = 'default' | 'waving' | 'thinking' | 'sleeping'

interface MascotImageProps {
  pose?: MascotPose
  size?: number
  className?: string
  alt?: string
}

export function MascotImage({
  pose = 'default',
  size = 128,
  className = '',
  alt = 'AquaClaw mascot',
}: MascotImageProps) {
  return (
    <Image
      src={`/mascot/mascot-${pose}.png`}
      alt={alt}
      width={size}
      height={size}
      unoptimized
      className={`[image-rendering:pixelated] ${className}`}
      priority={pose === 'default'}
    />
  )
}
