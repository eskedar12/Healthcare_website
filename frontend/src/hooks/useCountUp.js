import { useEffect, useRef, useState } from 'react'

/**
 * Animates a numeric value from 0 up to the number embedded in `raw` when the
 * returned `ref` scrolls into view. Preserves any non-numeric prefix/suffix
 * and thousands separators, e.g. "2,426+" -> counts 0 -> 2426, renders "2,426+".
 * Values with no digits at all (e.g. "24/7") are returned unchanged, unanimated.
 */
const useCountUp = (raw, { duration = 1800 } = {}) => {
  const ref = useRef(null)
  const [display, setDisplay] = useState(null)
  const hasRun = useRef(false)

  const str = String(raw ?? '')
  const match = str.match(/[\d,]+/)

  useEffect(() => {
    if (!match) {
      setDisplay(str)
      return
    }

    const target = parseInt(match[0].replace(/,/g, ''), 10)
    const prefix = str.slice(0, match.index)
    const suffix = str.slice(match.index + match[0].length)
    const hasCommas = match[0].includes(',')

    const format = (n) =>
      `${prefix}${hasCommas ? n.toLocaleString('en-US') : n}${suffix}`

    setDisplay(format(0))

    const node = ref.current
    if (!node || typeof IntersectionObserver === 'undefined') {
      setDisplay(format(target))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasRun.current) {
            hasRun.current = true
            const start = performance.now()

            const tick = (now) => {
              const progress = Math.min((now - start) / duration, 1)
              // ease-out cubic
              const eased = 1 - Math.pow(1 - progress, 3)
              setDisplay(format(Math.round(eased * target)))
              if (progress < 1) requestAnimationFrame(tick)
            }
            requestAnimationFrame(tick)
            observer.disconnect()
          }
        })
      },
      { threshold: 0.4 }
    )

    observer.observe(node)
    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [str])

  return { ref, display: display ?? str }
}

export default useCountUp
