/**
 * Komponen Card - Acuan CeKost Design System
 *
 * @param {Object} props
 * @param {import('react').ReactNode} props.children - Konten isi kartu
 * @param {string} [props.title=''] - Judul kartu pada header
 * @param {string} [props.subtitle=''] - Keterangan/subjudul di bawah judul
 * @param {import('react').ReactNode} [props.action=null] - Aksi kanan atas header kartu
 * @param {'none' | 'late' | 'partial' | 'paid' | 'primary'} [props.accent='none'] - Garis aksen vertikal di sisi kiri kartu
 * @param {'none' | 'sm' | 'md' | 'lg'} [props.padding='md'] - Ukuran padding ('none': p-0, 'sm': p-3, 'md': p-4, 'lg': p-5)
 * @param {function} [props.onClick] - Fungsi klik interaktif
 * @param {string} [props.className=''] - Kelas Tailwind kustom tambahan
 */
export default function Card({
  children,
  title = '',
  subtitle = '',
  action = null,
  accent = 'none',
  padding = 'md',
  onClick,
  className = '',
  ...restProps
}) {
  const isClickable = typeof onClick === 'function'

  const paddingStylesMap = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-5',
  }
  const paddingStyles = paddingStylesMap[padding] || paddingStylesMap.md

  const accentStylesMap = {
    late: 'border-l-4 border-l-status-late',
    partial: 'border-l-4 border-l-status-partial',
    paid: 'border-l-4 border-l-status-paid',
    primary: 'border-l-4 border-l-primary-600',
    none: '',
  }
  const accentStyles = accentStylesMap[accent] || ''

  const interactiveStyles = isClickable
    ? 'cursor-pointer hover:border-primary-500/50 active:scale-[0.99] transition-all select-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1'
    : ''

  const handleKeyDown = (event) => {
    if (isClickable && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault()
      onClick(event)
    }
  }

  const hasHeader = Boolean(title || subtitle || action)

  return (
    <div
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onClick={onClick}
      onKeyDown={isClickable ? handleKeyDown : undefined}
      className={`bg-surface rounded-card border border-line shadow-sm overflow-hidden ${paddingStyles} ${accentStyles} ${interactiveStyles} ${className}`.trim()}
      {...restProps}
    >
      {hasHeader && (
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            {title && (
              <h3 className="text-base font-semibold text-ink leading-snug">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs text-muted mt-0.5 leading-normal">
                {subtitle}
              </p>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      {children}
    </div>
  )
}
