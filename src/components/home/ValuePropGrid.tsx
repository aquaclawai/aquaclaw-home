const ITEM_ICONS = ['✏️', '⚙️', '📦', '📖'] as const

interface ValuePropItem {
  title: string
  body: string
}

interface ValuePropGridProps {
  dict: {
    heading: string
    items: ValuePropItem[]
  }
}

export function ValuePropGrid({ dict }: ValuePropGridProps) {
  return (
    <section className="py-16 px-4">
      <h2 className="font-display text-3xl font-bold text-center mb-10">
        {dict.heading}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {dict.items.map((item, index) => (
          <div
            key={item.title}
            className="bg-card rounded-xl p-6 shadow-sm"
          >
            <div className="text-4xl mb-3" aria-hidden="true">
              {ITEM_ICONS[index] ?? '✨'}
            </div>
            <h3 className="font-display text-xl font-semibold mb-2">
              {item.title}
            </h3>
            <p className="font-sans text-foreground/70">{item.body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
