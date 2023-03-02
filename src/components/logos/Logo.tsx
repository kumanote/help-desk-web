export function Logo({ ...props }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2000 2000" {...props}>
      <path
        fill="currentColor"
        d="M64.27,1904.29c0-20.09-.04-37.57,0-55.05,.08-30.6,.26-61.2,.3-91.8,.07-43.95,.05-87.91,.07-131.86,.02-35.93-.03-71.86,.09-107.79,.24-70.82,.68-141.64,.81-212.46,.07-39.3-.36-78.59-.44-117.89-.05-22.19,1.28-44.47-.27-66.55-.74-10.51,3.13-16.26,9.7-22.77,25.76-25.51,51.02-51.5,76.67-77.12,34.34-34.3,68.95-68.34,103.29-102.65,33.18-33.14,66.11-66.54,99.27-99.7,22.81-22.82,45.91-45.36,68.73-68.17,28.24-28.22,56.3-56.62,84.49-84.89,25.84-25.9,51.78-51.7,77.62-77.59,13.36-13.4,26.52-27,39.92-40.36,20.23-20.18,40.66-40.18,60.88-60.37,18.33-18.3,36.43-36.82,54.76-55.11,41.9-41.8,83.95-83.46,125.8-125.3,46.37-46.37,92.59-92.89,138.88-139.34,20.88-20.96,41.86-41.81,62.53-62.98,4.37-4.47,9.25-6.22,15.06-6.2,27.55,.1,55.11,.44,82.66,.43,29.97-.01,59.93-.45,89.9-.44,22.18,0,44.37,.6,66.55,.63,23.6,.04,47.21-.43,70.81-.4,40.81,.04,81.62,.47,122.43,.41,39.91-.07,79.83-.69,119.74-.82,39.29-.13,78.57,.05,117.86,.08,34.92,.03,69.85,.11,104.77-.03,4.76-.02,9.52-1.23,16.38-2.19-2.4,3.24-3.57,5.33-5.21,6.96-21.6,21.6-43.32,43.09-64.9,64.71-24.91,24.95-49.66,50.04-74.56,74.99-52.15,52.26-104.3,104.51-156.55,156.67-27.27,27.23-54.85,54.16-82.08,81.43-28.22,28.26-56.18,56.78-84.29,85.15-5.38,5.42-10.91,10.7-16.43,15.98-4.52,4.32-25.57,25.26-30.18,29.79-28.2,27.69-56.3,55.5-84.26,83.45-13.61,13.6-26.7,27.7-40.28,41.33-28.17,28.27-56.52,56.36-84.76,84.56-13.64,13.62-27.15,27.37-40.79,40.99-14.1,14.08-28.31,28.05-42.41,42.13-14.33,14.3-28.57,28.68-42.88,42.99-25.13,25.14-50.25,50.28-75.42,75.37-26.59,26.49-53.33,52.84-79.84,79.41-22.28,22.33-44.21,45-66.5,67.32-20.86,20.89-42.07,41.44-62.98,62.29-22.82,22.77-45.44,45.76-68.2,68.6-15.71,15.76-31.51,31.42-47.26,47.15-31.29,31.25-62.51,62.56-93.85,93.75-35.61,35.45-71.36,70.74-106.95,106.21-37,36.88-73.85,73.89-110.79,110.83-30.99,30.99-62.07,61.9-93.01,92.93-30.29,30.39-60.42,60.94-90.71,91.34-18.78,18.84-37.69,37.55-56.61,56.25-1.92,1.9-4.33,3.29-7.58,5.73Z"
      />
      <path
        fill="currentColor"
        d="M1974.48,1878.01h-13.99c-45.67,0-91.34-.04-137,.07-3.88,0-7.75,1.03-11.63,1.58-1.3,.18-2.8,.84-3.89,.44-11.34-4.22-23.07-1.3-34.59-2.05-11.97-.78-23.95-1.3-35.93-1.7-4.29-.14-8.61,.6-12.91,.61-24.32,.06-48.65-.02-72.97,.05-10.55,.03-21.11,.39-31.66,.4-8.65,0-17.3-.41-25.95-.41-9.1,0-18.19,.26-27.29,.39-1.31,.02-2.65,.13-3.94-.04-15.94-2.14-31.82-1.65-47.83-.13-9.01,.85-18.24-.52-27.37-.9-1-.04-1.99-.27-2.98-.25-56.27,1.25-112.52-.96-168.78-1.32-17.53-.11-35.07,.4-52.61,.44-13.33,.03-26.65-.32-39.98-.34-10.76-.02-19.04-4.31-25.36-13.1-2.05-2.85-5.67-4.53-8.16-7.13-11.18-11.66-22.08-23.58-33.33-35.17-10.85-11.19-21.98-22.12-33.03-33.11-18.02-17.92-36.13-35.75-54.1-53.72-27.01-27.02-54-54.05-80.86-81.22-10.94-11.06-21.28-22.7-32.3-33.68-15.55-15.5-31.56-30.54-47.22-45.93-15.16-14.89-30.73-29.43-44.98-45.16-10.95-12.08-22.96-22.84-35.03-33.64-2.69-2.41-4.66-5.6-7.21-8.2-8.55-8.75-17.85-16.85-25.67-26.19-13.7-16.36-31.11-28.88-45.09-44.87-5.21-5.95-10.28-12.03-15.56-17.9-3.41-3.79-2.77-7.01,.57-10.4,10.19-10.32,20.34-20.68,30.43-31.09,10.6-10.93,21.1-21.96,31.68-32.91,6.67-6.91,13.31-13.86,20.17-20.58,8.69-8.52,17.6-16.81,26.41-25.21,6.47-6.17,13.11-12.17,19.38-18.53,13.46-13.67,26.61-27.64,40.11-41.27,9.74-9.84,20-19.17,29.73-29.01,7.84-7.93,14.99-16.55,22.92-24.38,9.15-9.03,19.03-17.32,28.2-26.34,7.77-7.65,14.97-15.88,22.43-23.85,4.5-4.81,8.91-9.72,13.56-14.38,20.1-20.15,40.22-40.28,60.44-60.32,13.8-13.68,26.45-28.54,41.72-40.71,2.08-1.66,3.95-3.65,6.2-5,3.94-2.37,7.28-3.15,11.09,1.46,9.23,11.16,19.04,21.87,28.92,32.46,7.93,8.5,16.38,16.5,24.48,24.84,9.41,9.7,18.64,19.57,28,29.31,9.38,9.75,19.51,18.86,28.09,29.26,11.19,13.57,24.73,24.71,36.6,37.53,15.99,17.27,32.84,33.85,47.53,52.16,8.22,10.25,19.02,17.45,27.08,27.54,2.05,2.57,4.36,4.92,6.6,7.33,5.83,6.27,11.65,12.55,17.54,18.76,7.96,8.38,15.97,16.71,23.97,25.05,3.65,3.81,7.4,7.53,11.01,11.38,14.29,15.22,28.53,30.47,42.8,45.71,6.33,6.76,12.6,13.58,19.03,20.25,8.7,9.01,17.54,17.89,26.3,26.84,1.6,1.64,3.29,3.23,4.68,5.04,10.68,13.92,23.03,26.27,35.59,38.46,5.92,5.74,11.21,12.14,16.95,18.08,16.78,17.36,33.85,34.45,50.41,52.02,11.14,11.82,21.51,24.38,32.42,36.42,4.2,4.64,9.05,8.69,13.43,13.18,9.22,9.44,18.43,18.9,27.45,28.53,8.11,8.66,15.73,17.79,23.96,26.33,25.76,26.73,51.87,53.12,77.49,79.99,11.36,11.92,21.72,24.8,32.84,36.95,3.93,4.3,9.11,7.44,13.16,11.65,9.85,10.28,19.42,20.82,29,31.36,11.39,12.52,22.46,25.33,34.07,37.65,6.98,7.4,15,13.82,22.06,21.15,13.56,14.07,26.75,28.5,40.13,42.74,2.24,2.38,4.92,4.39,6.93,6.94,1.83,2.32,3.02,5.14,5.66,9.79Z"
      />
      <path
        fill="currentColor"
        d="M66.45,965.56V101.91c9.79-3.2,583.1-3.21,592.96-1.23,0,10.7-.02,21.19,0,31.69,.04,14.71,.07,29.41,.18,44.12,.17,22.6,.51,45.21,.58,67.81,.1,34.52,.02,69.05,.06,103.57,0,4.91-.23,9.9,.55,14.7,.67,4.16-1.76,6.19-4.02,8.5-12.07,12.36-24.18,24.69-36.33,36.97-27.34,27.64-54.67,55.29-82.07,82.87-28.6,28.79-57.32,57.46-85.88,86.28-12.39,12.5-24.44,25.35-36.83,37.85-18.26,18.42-36.76,36.59-55.01,55.02-34.38,34.72-68.62,69.57-102.97,104.31-27.32,27.63-54.7,55.19-82.07,82.77-33.45,33.71-66.9,67.41-100.4,101.07-2.42,2.43-5.26,4.45-8.74,7.35Z"
      />
    </svg>
  )
}