/**
 * Komponen Button - Acuan CeKost Design System
 *
 * @param {Object} props
 * @param {import('react').ReactNode} props.children - Label atau konten tombol
 * @param {'primary' | 'secondary' | 'danger'} [props.variant='primary'] - Varian gaya tombol
 * @param {'md' | 'sm'} [props.size='md'] - Ukuran tinggi tombol ('md' = 44px / h-11, 'sm' = 32px / h-8)
 * @param {boolean} [props.fullWidth=false] - Tombol selebar kontainer penuh
 * @param {boolean} [props.loading=false] - Status memproses transaksi/data
 * @param {boolean} [props.disabled=false] - Status nonaktif
 * @param {'button' | 'submit' | 'reset'} [props.type='button'] - Tipe elemen button
 * @param {import('react').ReactNode} [props.icon=null] - Ikon tambahan
 * @param {function} [props.onClick] - Fungsi aksi klik
 * @param {string} [props.className=''] - Kelas Tailwind kustom tambahan
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  type = 'button',
  icon = null,
  onClick,
  className = '',
  ...restProps
}) {
  const isInactive = disabled || loading

  const baseStyles =
    'inline-flex items-center justify-center font-semibold transition-all duration-150 select-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1'

  const sizeStyles =
    size === 'sm'
      ? 'h-8 px-3 text-xs rounded-lg gap-1.5'
      : 'h-11 px-4 text-sm rounded-control gap-2'

  const variantStylesMap = {
    primary:
      'bg-primary-600 text-white shadow-sm hover:bg-primary-700 active:bg-primary-700',
    secondary:
      'bg-surface border border-primary-600 text-primary-600 hover:bg-primary-50 active:bg-primary-100',
    danger:
      'bg-surface border border-status-late text-status-late hover:bg-status-late-bg active:bg-status-late-bg/80',
  }
  const variantStyles = variantStylesMap[variant] || variantStylesMap.primary

  const stateStyles = isInactive
    ? 'opacity-50 cursor-not-allowed pointer-events-none'
    : 'cursor-pointer active:scale-[0.98]'

  const widthStyles = fullWidth ? 'w-full' : 'w-auto'

  return (
    <button
      type={type}
      disabled={isInactive}
      aria-busy={loading ? 'true' : undefined}
      onClick={onClick}
      className={`${baseStyles} ${sizeStyles} ${variantStyles} ${stateStyles} ${widthStyles} ${className}`.trim()}
      {...restProps}
    >
      {loading ? (
        <>
          <svg
            className="animate-spin -ml-0.5 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Memproses...</span>
        </>
      ) : (
        <>
          {icon && <span className="shrink-0 flex items-center">{icon}</span>}
          {children}
        </>
      )}
    </button>
  )
}
