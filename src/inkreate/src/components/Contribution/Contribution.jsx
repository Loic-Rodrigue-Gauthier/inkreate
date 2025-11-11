
import styles from './Contribution.module.css'

function Contribution({title, segment, choice, paragraph}) {
  return (
    <div>
      <div>
        <h2>{title}</h2>
        <div>Segment #{segment}</div>
      </div>
      <div>
        <div>{choice}</div>
        <div>{paragraph}</div>
      </div>
    </div>
  )
}

export default Contribution