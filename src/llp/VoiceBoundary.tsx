/**
 * The other half of the section: what the deployed product does with all
 * this. Values observed from the live build’s own response headers, which
 * is the only claim here that is not from the archive.
 */
export function VoiceBoundary() {
  const rows = [
    {
      id: 'IGB-KNW-001',
      igbo: 'Kedụ?',
      provider: 'elevenlabs',
      pronunciation: null,
      status: 'Candidate',
    },
    {
      id: 'IGB-KNW-002',
      igbo: 'Ọ dị mma.',
      provider: 'elevenlabs',
      pronunciation: 'ipa-inline',
      status: 'Candidate',
    },
  ]
  return (
    <div className="boundary">
      <p className="boundary__lead">
        What the deployed build returns when it is asked for each of these lines.
      </p>
      <table className="boundary__t data">
        <thead>
          <tr>
            <th>knowledge id</th>
            <th>line</th>
            <th>x-llp-provider</th>
            <th>x-llp-pronunciation</th>
            <th>x-llp-production-status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td className="ig">{r.igbo}</td>
              <td>{r.provider}</td>
              <td className={r.pronunciation ? 'is-set' : 'is-none'}>
                {r.pronunciation || 'not set'}
              </td>
              <td>{r.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="boundary__note caption">
        The override is applied to one line and withheld from the other, and the product says
        which. Observed from the live build, 14 September 2026.
      </p>
    </div>
  )
}
