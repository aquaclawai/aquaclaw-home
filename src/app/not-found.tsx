import Link from 'next/link'
import { MascotImage } from '@/components/ui/MascotImage'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-background text-foreground">
      {/* Mascot with bounce-in animation */}
      <div className="animate-bounce-in">
        <MascotImage pose="thinking" size={128} />
      </div>

      {/* Heading and message */}
      <div className="animate-bounce-in text-center mt-8 max-w-md">
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-primary mb-4">
          Hmm, even an AI can&apos;t find this page...
        </h1>
        <p className="font-sans text-lg text-foreground/70 mb-8">
          Our mascot searched every byte of data but came up empty-pawed.
          The page you&apos;re looking for might have been moved or doesn&apos;t exist.
        </p>
      </div>

      {/* Navigation options */}
      <div className="animate-bounce-in flex flex-col sm:flex-row items-center gap-4">
        <Link
          href="/en"
          className="px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors"
        >
          Back to Home
        </Link>
        <Link
          href="/en/diary"
          className="px-6 py-3 bg-muted text-foreground font-medium rounded-lg hover:bg-muted/80 transition-colors"
        >
          Read the Diary
        </Link>
        <Link
          href="/en/articles"
          className="px-6 py-3 bg-muted text-foreground font-medium rounded-lg hover:bg-muted/80 transition-colors"
        >
          Browse Articles
        </Link>
      </div>
    </div>
  )
}
