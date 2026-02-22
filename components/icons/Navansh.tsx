"use client"
import { useEffect, useState } from "react"

interface NavanshLogoProps {
  /** Multiplier applied to the base 260×180 dimensions. Default: 1 */
  height?: number
  className?: string
  alt?: boolean
  /** Accessible label for screen-readers */
  title?: string
}

/**
 * Navansh Finserv Logo custom React component.
 *
 * Usage: 
 * 
 * Use height prop to scale the logo. Default height is 36px.
 * 
 * Use alt prop to invert colors for dark mode.
 * 
 * Use title prop to set the accessible label for screen-readers.
 */
export default function Navansh({
  height = 36,
  className,
  title = 'Navansh Finserv',
  alt,
}: NavanshLogoProps) {
  const BASE_WIDTH = (height * 260) / 185
  const BASE_HEIGHT = height
  const [darkVectorFill, setDarkVectorFill] = useState('#232931')

  useEffect(() => {
    setDarkVectorFill(alt ? '#eeeeee' : '#232931')
  }, [alt])

  return (
    <svg
      width={BASE_WIDTH}
      height={BASE_HEIGHT}
      viewBox="0 0 260 185"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      className={className}
      aria-label={title}
      role="img"
    >
      <title>{title}</title>
      <defs>
        <linearGradient id="navansh-gold-gradient">
          <stop style={{ stopColor: '#eccc59', stopOpacity: 1 }} offset="0" />
          <stop style={{ stopColor: '#c5a53d', stopOpacity: 1 }} offset="1" />
        </linearGradient>
        <clipPath clipPathUnits="userSpaceOnUse" id="navansh-clip-path">
          <path
            d="M 0,792 H 1152 V 0 H 0 Z"
            transform="translate(-670.53851,-522.57232)"
          />
        </clipPath>
        <radialGradient
          xlinkHref="#navansh-gold-gradient"
          id="navansh-radial-gradient"
          cx="244.5"
          cy="208.75"
          fx="244.5"
          fy="208.75"
          r="12"
          gradientUnits="userSpaceOnUse"
          gradientTransform="matrix(1.6383009,1.133815,-0.71550399,1.0452037,-8.970104,-279.49068)"
        />
      </defs>
      <g id="layer-MC0" transform="translate(-20.012491,-51.022797)">
        <path
          id="path1"
          d="m 60.752301,231.01498 29.25119,-0.004 29.438199,-54.54352 -16.03219,-25.09163 z"
          style={{
            fill: '#409e54',
            fillOpacity: 1,
            fillRule: 'nonzero',
            stroke: 'none',
            strokeWidth: 1.32124,
          }}
        />
        <path
          id="path2"
          d="m 205.23351,210.56356 -9.0166,20.45924 -30.83009,-9e-5 -63.66388,-98.00794 -52.015769,98.00106 H 20.012491 L 99.465446,82.41333 179.5195,207.40096 190.01884,186.59583 Z"
          style={{
            fill: darkVectorFill,
            fillOpacity: 1,
            fillRule: 'nonzero',
            stroke: 'none',
            strokeWidth: 1.32124,
          }}
        />
        <path
          id="path3"
          d="m 129.55565,113.68572 15.96673,24.85247 9.67782,-20.35558 55.64244,84.73387 13.78939,-24.37938 -71.3674,-110.294656 z"
          style={{
            fill: '#409e54',
            fillOpacity: 1,
            fillRule: 'nonzero',
            stroke: 'none',
            strokeWidth: 1.32124,
          }}
        />
        <path
          id="path4"
          d="m 213.10494,144.50607 16.7869,25.6601 44.23879,-86.047267 -23.78112,-10.777632 z"
          style={{
            fill: darkVectorFill,
            fillOpacity: 1,
            fillRule: 'nonzero',
            stroke: 'none',
            strokeWidth: 1.32124,
          }}
        />
        <path
          id="path5"
          d="m 0,0 -28.802,-17.577 c -1.092,-0.666 -1.063,-2.261 0.052,-2.888 L 0.828,-37.09 c 1.131,-0.636 2.524,0.201 2.494,1.497 L 2.546,-1.391 C 2.517,-0.101 1.101,0.672 0,0"
          transform="matrix(1.3357927,0,0,-1.3068551,275.57435,51.346372)"
          clipPath="url(#navansh-clip-path)"
          style={{
            fill: darkVectorFill,
            fillOpacity: 1,
            fillRule: 'nonzero',
            stroke: 'none',
          }}
        />
        <ellipse
          style={{
            fill: 'url(#navansh-radial-gradient)',
            stroke: 'none',
            strokeWidth: 1.024,
          }}
          id="path34"
          cx="242.23303"
          cy="215.91342"
          rx="20"
          ry="20.109383"
        />
      </g>
    </svg>
  )
}
