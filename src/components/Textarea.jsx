import { useId } from 'react'

/**
 * Komponen Textarea - Acuan CeKost Design System
 * Memiliki perilaku label, error, helperText, dan aksesibilitas yang selaras dengan Input.
 *
 * @param {Object} props
 * @param {string} [props.label=''] - Label kolom textarea di atas
 * @param {string} [props.name] - Atribut name HTML textarea
 * @param {string} [props.id] - ID elemen textarea (otomatis via useId jika kosong)
 * @param {string} [props.value] - Nilai controlled textarea
 * @param {function} [props.onChange] - Handler perubahan nilai
 * @param {string} [props.placeholder=''] - Teks petunjuk placeholder
 * @param {string} [props.error=''] - Pesan galat validasi
 * @param {string} [props.helperText=''] - Pesan bantuan di bawah textarea
 * @param {number} [props.rows=3] - Jumlah baris awal textarea
 * @param {boolean} [props.required=false] - Penanda wajib diisi
 * @param {boolean} [props.disabled=false] - Status nonaktif
 * @param {boolean} [props.fullWidth=true] - Lebar memenuhi kontainer
 * @param {string} [props.className=''] - Kelas Tailwind kustom pada pembungkus luar
 */
export default function Textarea({
  label = '',
  name,
  id,
  value,
  onChange,
  placeholder = '',
  error = '',
  helperText = '',
  rows = 3,
  required = false,
  disabled = false,
  fullWidth = true,
  className = '',
  ...restProps
}) {
  const autoId = useId()
  const textareaId = id || autoId
  const errorId = `${textareaId}-error`
  const helperId = `${textareaId}-helper`

  const hasError = Boolean(error)
  const describedBy = hasError ? errorId : helperText ? helperId : undefined

  return (
    <div
      className={`flex flex-col gap-1.5 ${fullWidth ? 'w-full' : 'w-auto'} ${className}`.trim()}
    >
      {label && (
        <label
          htmlFor={textareaId}
          className="flex items-center justify-between text-sm font-medium text-ink"
        >
          <span>{label}</span>
          {required && (
            <span className="text-xs text-muted font-normal">Wajib</span>
          )}
        </label>
      )}

      <textarea
        id={textareaId}
        name={name}
        rows={rows}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        aria-invalid={hasError ? 'true' : 'false'}
        aria-describedby={describedBy}
        className={`w-full rounded-control bg-surface text-ink text-sm p-3.5 transition-colors border placeholder:text-muted focus:outline-none focus:ring-1 ${
          hasError
            ? 'border-status-late focus:border-status-late focus:ring-status-late'
            : 'border-line focus:border-primary-500 focus:ring-primary-500'
        } ${disabled ? 'opacity-50 cursor-not-allowed bg-app-bg' : ''}`.trim()}
        {...restProps}
      />

      {hasError ? (
        <p id={errorId} className="text-xs text-status-late font-medium mt-0.5">
          {error}
        </p>
      ) : helperText ? (
        <p id={helperId} className="text-xs text-muted mt-0.5">
          {helperText}
        </p>
      ) : null}
    </div>
  )
}
