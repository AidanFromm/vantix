'use client'

import { useState, useEffect } from 'react'

export function useScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercent = docHeight > 0 ? scrollTop / docHeight : 0
      setProgress(Math.min(Math.max(scrollPercent, 0), 1))
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return progress
}

export function useSectionProgress(sectionStart: number, sectionEnd: number) {
  const progress = useScrollProgress()
  
  if (progress < sectionStart) return 0
  if (progress > sectionEnd) return 1
  return (progress - sectionStart) / (sectionEnd - sectionStart)
}
