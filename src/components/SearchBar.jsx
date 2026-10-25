import { useId } from 'react'
import { Search, X } from 'lucide-react'

/**
 * Komponen SearchBar - Acuan CeKost Design System
 *
 * @param {Object} props
 * @param {string} [props.value=''] - Nilai teks pencarian terkontrol
 * @param {function} [props.onChange] - Handler perubahan teks pencarian
 * @param {string} [props.placeholder='Cari nomor kamar atau nama penghuni...'] - Teks petunjuk placeholder
 * @param {function} [props.onClear] - Handler opsional saat tombol hapus teks diklik
 * @param {string} [props.id] - ID elemen input
 * @param {boolean} [props.fullWidth=true] - Menjadikan kolom selebar kontainer
 * @param {string} [props.className=''] - Kelas Tailwind kustom tambahan
 */
export default function SearchBar({
  value = '',
  onChange,
  placeholder = 'Cari nomor kamar atau nama penghuni...',
  onClear,
  id,
  fullWidth = true,
  className = '',
  ...restProps
}) {
  const autoId = useId()
  const inputId = id || autoId

  const handleClear = () => {
    if (typeof onClear === 'function') {
      onClear()
    } else if (typeof onChange === 'function') {
      onChange({ target: { value: '' } })
    }
  }

  const hasValue = Boolean(value && String(value).length > 0)

  return (
    <div
      className={`relative flex items-center ${
        fullWidth ? 'w-full' : 'w-auto'
      } ${className}`.trim()}
    >
      <Search
        aria-hidden="true"
        className="absolute left-3.5 h-4 w-4 text-muted pointer-events-none shrink-0"
      />

      <input
        id={inputId}
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        aria-label={placeholder}
        className={`h-11 w-full rounded-control bg-surface border border-line text-sm text-ink placeholder:text-muted pl-10 ${
          hasValue ? 'pr-10' : 'pr-3.5'
        } focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 shadow-sm transition-all`.trim()}
        {...restProps}
      />

      {hasValue && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Hapus pencarian"
          className="absolute right-2.5 h-6 w-6 rounded-full flex items-center justify-center text-muted hover:text-ink hover:bg-app-bg transition-colors cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary-500"
        >
          <X className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      )}
    </div>
  )
}
