import { useNavigate } from 'react-router-dom'
import styles from './Splash.module.css'
import ImageTitleText from '../../components/ImageTitleText/ImageTitleText'
import NumberedTitleText from '../../components/NumberedTitleText/NumberedTitleText'
import GlobalStats from '../../components/GlobalStats/GlobalStats'
import reactLogo from '../../assets/react.svg'
import viteLogo from '../../assets/vite.svg'

function Splash() {
  const navigate = useNavigate()

  const goToPage = () => {
    navigate("/authentication")
  }

  return (
    <>
      <div>
        <img src={viteLogo} alt="viteLogo" />
        <h1>InKreate</h1>
      </div>
      <h3>Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto, reiciendis.</h3>
      <button onClick={goToPage}>Start Writing!</button>
      <section>
        <GlobalStats number="10k+" desc="Lorem ipsum dolor sit amet." />
        <GlobalStats number="25k+" desc="Lorem ipsum dolor sit amet." />
        <GlobalStats number="500k+" desc="Lorem ipsum dolor sit amet." />
      </section>
      <h2>Section 1</h2>
      <section>
        <ImageTitleText src={reactLogo} title="Lorem ipsum dolor sit amet.">
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Impedit tempore natus omnis illum. Distinctio perferendis temporibus obcaecati delectus, numquam ad!</p>
        </ImageTitleText>
        <ImageTitleText src={reactLogo} title="Lorem ipsum dolor sit amet.">
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Impedit tempore natus omnis illum. Distinctio perferendis temporibus obcaecati delectus, numquam ad!</p>
        </ImageTitleText>
        <ImageTitleText src={reactLogo} title="Lorem ipsum dolor sit amet.">
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Impedit tempore natus omnis illum. Distinctio perferendis temporibus obcaecati delectus, numquam ad!</p>
        </ImageTitleText>
        <ImageTitleText src={reactLogo} title="Lorem ipsum dolor sit amet.">
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Impedit tempore natus omnis illum. Distinctio perferendis temporibus obcaecati delectus, numquam ad!</p>
        </ImageTitleText>
        <ImageTitleText src={reactLogo} title="Lorem ipsum dolor sit amet.">
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Impedit tempore natus omnis illum. Distinctio perferendis temporibus obcaecati delectus, numquam ad!</p>
        </ImageTitleText>
        <ImageTitleText src={reactLogo} title="Lorem ipsum dolor sit amet.">
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Impedit tempore natus omnis illum. Distinctio perferendis temporibus obcaecati delectus, numquam ad!</p>
        </ImageTitleText>
      </section>
      <h2>Section 2</h2>
      <section>
        <NumberedTitleText number="1" title="Lorem ipsum dolor sit amet.">
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Impedit tempore natus omnis illum. Distinctio perferendis temporibus obcaecati delectus, numquam ad!</p>
        </NumberedTitleText>
        <NumberedTitleText number="2" title="Lorem ipsum dolor sit amet.">
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Impedit tempore natus omnis illum. Distinctio perferendis temporibus obcaecati delectus, numquam ad!</p>
        </NumberedTitleText>
        <NumberedTitleText number="3" title="Lorem ipsum dolor sit amet.">
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Impedit tempore natus omnis illum. Distinctio perferendis temporibus obcaecati delectus, numquam ad!</p>
        </NumberedTitleText>
      </section>
      <button onClick={goToPage}>Start Writing!</button>
    </>
  )
}

export default Splash