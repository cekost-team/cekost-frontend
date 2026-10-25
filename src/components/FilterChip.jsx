/**
 * Komponen FilterChip - Acuan CeKost Design System
 *
 * @param {Object} props
 * @param {string} props.label - Label teks nama filter (contoh: 'Semua', 'Lunas', 'Telat')
 * @param {boolean} [props.active=false] - Status aktif chip filter
 * @param {function} [props.onClick] - Fungsi aksi klik pemilihan filter
 * @param {number | string} [props.count] - Jumlah item opsional di dalam chip (misal: 12 -> 'Semua (12)')
 * @param {import('react').ReactNode} [props.icon=null] - Ikon pelengkap opsional
 * @param {string} [props.className=''] - Kelas Tailwind kustom tambahan
 */
export default function FilterChip({
  label = '',
  active = false,
  onClick,
  count,
  icon = null,
  className = '',
  ...restProps
}) {
  const baseStyles =
    'h-8 px-3 rounded-full text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-all select-none shrink-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 active:scale-95'

  const activeStyles = active
    ? 'bg-primary-600 text-white shadow-xs'
    : 'bg-surface text-muted border border-line hover:text-ink hover:bg-app-bg'

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active ? 'true' : 'false'}
      className={`${baseStyles} ${activeStyles} ${className}`.trim()}
      {...restProps}
    >
      {icon && <span className="shrink-0 flex items-center">{icon}</span>}
      <span>{label}</span>
      {count !== undefined && count !== null && (
        <span
          className={`text-[11px] font-medium leading-none ${
            active ? 'text-white/90' : 'text-muted'
          }`}
        >
          ({count})
        </span>
      )}
    </button>
  )
}
