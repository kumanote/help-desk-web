interface Props {
  text: string
}

export function TextContainer({ text }: Props) {
  const lines = text.split('\n')
  return (
    <>
      {lines.map((line, index) => {
        return (
          <>
            <span key={index}>
              {line}
              {index !== lines.length - 1 && <br />}
            </span>
          </>
        )
      })}
    </>
  )
}
