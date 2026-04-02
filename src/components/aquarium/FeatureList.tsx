import type en from '../../../dictionaries/en.json'

interface FeatureListProps {
  dict: {
    features: typeof en['aquarium']['features']
    useCases: typeof en['aquarium']['useCases']
  }
}

export function FeatureList({ dict }: FeatureListProps) {
  return (
    <div>
      {/* Features grid */}
      <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-6">
        {dict.features.heading}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {dict.features.items.map((item) => (
          <div key={item.title} className="bg-card rounded-xl p-5 shadow-sm">
            <h3 className="font-display font-semibold text-foreground mb-2">
              {item.title}
            </h3>
            <p className="text-sm text-foreground/70">{item.description}</p>
          </div>
        ))}
      </div>

      {/* Use Cases section */}
      <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mt-12 mb-6">
        {dict.useCases.heading}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {dict.useCases.items.map((item) => (
          <div
            key={item.title}
            className="bg-card rounded-xl p-5 shadow-sm border-l-4 border-primary"
          >
            <h3 className="font-display font-semibold text-foreground mb-2">
              {item.title}
            </h3>
            <p className="text-sm text-foreground/70">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
