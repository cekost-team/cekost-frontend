import { useId, useState } from 'react'

/**
 * Komponen Input - Acuan CeKost Design System
 *
 * @param {Object} props
 * @param {string} [props.label=''] - Label kolom input di atas
 * @param {string} [props.name] - Atribut name HTML input
 * @param {string} [props.id] - ID elemen input (otomatis digenerate via useId jika kosong)
 * @param {string} [props.type='text'] - Tipe input ('text', 'password', 'number', 'email', dll.)
 * @param {string | number} [props.value] - Nilai controlled input
 * @param {function} [props.onChange] - Handler perubahan nilai
 * @param {string} [props.placeholder=''] - Teks petunjuk placeholder
 * @param {string} [props.error=''] - Pesan galat validasi
 * @param {string} [props.helperText=''] - Pesan bantuan di bawah input
 * @param {boolean} [props.required=false] - Penanda input wajib diisi
 * @param {boolean} [props.disabled=false] - Status nonaktif input
 * @param {import('react').ReactNode} [props.prefix=null] - Awalan tetap di dalam input (e.g. "Rp", "+62", ikon)
 * @param {import('react').ReactNode} [props.suffix=null] - Akhiran di dalam input
 * @param {boolean} [props.fullWidth=true] - Lebar input memenuhi kontainer
 * @param {string} [props.className=''] - Kelas Tailwind kustom tambahan pada pembungkus luar
 */
export default function Input({
  label = '',
  name,
  id,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  error = '',
  helperText = '',
  required = false,
  disabled = false,
  prefix = null,
  suffix = null,
  fullWidth = true,
  className = '',
  ...restProps
}) {
  const autoId = useId()
  const inputId = id || autoId
  const errorId = `${inputId}-error`
  const helperId = `${inputId}-helper`

  const [showPassword, setShowPassword] = useState(false)
  const isPasswordType = type === 'password'
  const computedInputType = isPasswordType
    ? showPassword
      ? 'text'
      : 'password'
    : type

  const hasError = Boolean(error)
  const describedBy = hasError ? errorId : helperText ? helperId : undefined

  return (
    <div
      className={`flex flex-col gap-1.5 ${fullWidth ? 'w-full' : 'w-auto'} ${className}`.trim()}
    >
      {label && (
        <label
          htmlFor={inputId}
          className="flex items-center justify-between text-sm font-medium text-ink"
        >
          <span>{label}</span>
          {required && (
            <span className="text-xs text-muted font-normal">Wajib</span>
          )}
        </label>
      )}

      <div className="relative flex items-center">
        {prefix && (
          <div className="absolute left-3.5 flex items-center pointer-events-none text-muted text-sm font-medium">
            {prefix}
          </div>
        )}

        <input
          id={inputId}
          name={name}
          type={computedInputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          aria-invalid={hasError ? 'true' : 'false'}
          aria-describedby={describedBy}
          className={`h-11 w-full rounded-control bg-surface text-ink text-sm transition-colors border placeholder:text-muted focus:outline-none focus:ring-1 ${
            prefix ? 'pl-11' : 'pl-3.5'
          } ${
            isPasswordType || suffix ? 'pr-11' : 'pr-3.5'
          } ${
            hasError
              ? 'border-status-late focus:border-status-late focus:ring-status-late'
              : 'border-line focus:border-primary-500 focus:ring-primary-500'
          } ${
            disabled ? 'opacity-50 cursor-not-allowed bg-app-bg' : ''
          }`.trim()}
          {...restProps}
        />

        {isPasswordType && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={
              showPassword
                ? 'Sembunyikan kata sandi'
                : 'Tampilkan kata sandi'
            }
            className="absolute right-2.5 h-7 w-7 flex items-center justify-center text-muted hover:text-ink focus:outline-none focus:ring-1 focus:ring-primary-500 rounded-control transition-colors cursor-pointer"
          >
            {showPassword ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            )}
          </button>
        )}

        {!isPasswordType && suffix && (
          <div className="absolute right-3.5 flex items-center pointer-events-none text-muted text-sm font-medium">
            {suffix}
          </div>
        )}
      </div>

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
