export function EnIcon({ ...props }) {
  return (
    <svg
      viewBox="0 0 600 600"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <defs>
        <polygon
          id="en-icon-path-1"
          points="0 0 0 600 1200 600 1200 0"
        ></polygon>
        <path
          id="en-icon-path-3"
          d="M600,300 L1200,300 L1200,600 L600,300 Z M600,300 L600,600 L0,600 L600,300 Z M600,300 L0,300 L0,0 L600,300 Z M600,300 L600,0 L1200,0 L600,300 Z"
        ></path>
      </defs>
      <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g transform="translate(-300.000000, 0.000000)">
          <mask id="en-icon-mask-2" fill="white">
            <use xlinkHref="#en-icon-path-1"></use>
          </mask>
          <g></g>
          <g mask="url(#en-icon-mask-2)">
            <polygon
              fill="#012169"
              fillRule="nonzero"
              points="0 0 0 600 1200 600 1200 0"
            ></polygon>
            <path
              d="M0,0 L1200,600 M1200,0 L0,600"
              stroke="#FFFFFF"
              strokeWidth="120"
              fill="#000000"
              fillRule="nonzero"
            ></path>
            <g>
              <mask id="en-icon-mask-4" fill="white">
                <use xlinkHref="#en-icon-path-3"></use>
              </mask>
              <g></g>
              <path
                d="M0,0 L1200,600 M1200,0 L0,600"
                stroke="#C8102E"
                strokeWidth="80"
                fill="#000000"
                fillRule="nonzero"
                mask="url(#en-icon-mask-4)"
              ></path>
            </g>
            <path
              d="M600,0 L600,600 M0,300 L1200,300"
              stroke="#FFFFFF"
              strokeWidth="200"
              fill="#000000"
              fillRule="nonzero"
            ></path>
            <path
              d="M600,0 L600,600 M0,300 L1200,300"
              stroke="#C8102E"
              strokeWidth="120"
              fill="#000000"
              fillRule="nonzero"
            ></path>
          </g>
        </g>
      </g>
    </svg>
  )
}
