import Card from './Card'

/**
 * Komponen SummaryCard - Acuan CeKost Design System
 * Membungkus komponen Card dengan layout metrik keuangan / ringkasan operasional.
 *
 * @param {Object} props
 * @param {string} props.label - Label keterangan metrik (contoh: 'Total Ditagih', 'Sudah Diterima', 'Sisa Tunggakan')
 * @param {string | number} props.value - Nilai atau nominal metrik berformat tabular-nums
 * @param {import('react').ReactNode} [props.icon=null] - Ikon pelengkap di sudut kanan atas
 * @param {'default' | 'danger' | 'success'} [props.tone='default'] - Nada warna metrik
 * @param {string} [props.subtext=''] - Keterangan pendukung kecil di bawah nilai
 * @param {function} [props.onClick] - Fungsi klik kartu jika interaktif
 * @param {string} [props.className=''] - Kelas Tailwind kustom tambahan
 */
export default function SummaryCard({
  label = '',
  value = '',
  icon = null,
  tone = 'default',
  subtext = '',
  onClick,
  className = '',
  ...restProps
}) {
  const toneStylesMap = {
    default: {
      valueClass: 'text-ink',
      iconBoxClass: 'bg-primary-50 text-primary-600',
    },
    danger: {
      valueClass: 'text-status-late',
      iconBoxClass: 'bg-status-late-bg text-status-late',
    },
    success: {
      valueClass: 'text-status-paid',
      iconBoxClass: 'bg-status-paid-bg text-status-paid',
    },
  }

  const toneConfig = toneStylesMap[tone] || toneStylesMap.default

  return (
    <Card onClick={onClick} className={`flex flex-col justify-between ${className}`.trim()} {...restProps}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold text-muted tracking-wide">
          {label}
        </span>
        {icon && (
          <div
            className={`h-8 w-8 rounded-control flex items-center justify-center shrink-0 ${toneConfig.iconBoxClass}`}
          >
            {icon}
          </div>
        )}
      </div>

      <div className="mt-3">
        <div
          className={`text-2xl font-bold tracking-tight tabular-nums ${toneConfig.valueClass}`}
        >
          {value}
        </div>
        {subtext && (
          <p className="text-xs text-muted mt-1 leading-normal">
            {subtext}
          </p>
        )}
      </div>
    </Card>
  )
}
