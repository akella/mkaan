'use client'
import { useLayoutEffect, useState, useRef } from "react"
import { debounce } from "lodash"

const useSectionHeight = () => {
  const [height, setHeight] = useState(0)
  const sectionRef = useRef(null)

  useLayoutEffect(() => {
    const handleResize = () => {
      setHeight(sectionRef.current?.clientHeight || window.innerHeight)
    }
    handleResize()
    const debouncedHandleResize = debounce(handleResize, 100)
    window.addEventListener("resize", debouncedHandleResize)
    return () => {
      window.removeEventListener("resize", debouncedHandleResize)
    }
  }, [])

  return { sectionHeight: height, sectionRef }
}

export default useSectionHeight
