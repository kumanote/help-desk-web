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
            <span>{line}</span>
            {index !== lines.length - 1 && <br />}
          </>
        )
      })}
    </>
  )
}
