interface ColorSwatchProps {
  color: string
  label?: string
}

export function ColorSwatch({ color, label }: ColorSwatchProps) {
  return (
    <span className="inline-flex items-center gap-2">
      <span
        className="h-3.5 w-3.5 rounded-full border border-white shadow-sm ring-1 ring-slate-200"
        style={{ background: color }}
      />
      {label && <span className="text-sm text-slate-600">{label}</span>}
    </span>
  )
}
