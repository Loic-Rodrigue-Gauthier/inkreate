
import ActivityBox from '../ActivityBox/ActivityBox'
import styles from './ActivityBoxList.module.css'

function ActivityBoxList({activity}) {
  return (
    <div>
      {activity.map((activity, index) => (
        <ActivityBox
          key={index}
          {...activity}
        />
      ))}
    </div>
  )
}

export default ActivityBoxList