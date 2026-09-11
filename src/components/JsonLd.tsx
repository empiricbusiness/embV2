/** Renders a JSON-LD block. Server component — nothing ships to the client. */
export default function JsonLd({ data }: { data: object | null }) {
  if (!data) return null
  return (
    <script
      type="application/ld+json"
      // Content is authored in-repo, never user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  )
}
