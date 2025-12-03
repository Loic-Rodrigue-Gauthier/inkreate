
import Contribution from '../Contribution/Contribution'
import styles from './ContributionList.module.css'

function ContributionList({contributions}) {
  return (
    <div>
      {contributions.map((contribution, index) => (
        <Contribution
          key={index}
          {...contribution}
        />
      ))}
    </div>
  )
}

export default ContributionList