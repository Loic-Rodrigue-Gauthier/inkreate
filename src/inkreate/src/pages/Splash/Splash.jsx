
import styles from './Splash.module.css'
import ImageTitleText from '../../components/ImageTitleText/ImageTitleText'
import reactLogo from '../../assets/react.svg';

function Splash() {
  return (
      <>
          <div>[logo.img] InKreate</div>
          <h3>Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto, reiciendis.</h3>
          <button>Start Writing!</button>
          <h2>Section 1</h2>
          <section>
            <ImageTitleText
              src={reactLogo}
              title="Lorem ipsum dolor sit amet."
            >
              <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Impedit tempore natus omnis illum. Distinctio perferendis temporibus obcaecati delectus, numquam ad!</p>
            </ImageTitleText>
            <ImageTitleText
              src={reactLogo}
              title="Lorem ipsum dolor sit amet."
            >
              <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Impedit tempore natus omnis illum. Distinctio perferendis temporibus obcaecati delectus, numquam ad!</p>
            </ImageTitleText>
            <ImageTitleText
              src={reactLogo}
              title="Lorem ipsum dolor sit amet."
            >
              <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Impedit tempore natus omnis illum. Distinctio perferendis temporibus obcaecati delectus, numquam ad!</p>
            </ImageTitleText>
            <ImageTitleText
              src={reactLogo}
              title="Lorem ipsum dolor sit amet."
            >
              <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Impedit tempore natus omnis illum. Distinctio perferendis temporibus obcaecati delectus, numquam ad!</p>
            </ImageTitleText>
            <ImageTitleText
              src={reactLogo}
              title="Lorem ipsum dolor sit amet."
            >
              <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Impedit tempore natus omnis illum. Distinctio perferendis temporibus obcaecati delectus, numquam ad!</p>
            </ImageTitleText>
            <ImageTitleText
              src={reactLogo}
              title="Lorem ipsum dolor sit amet."
            >
              <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Impedit tempore natus omnis illum. Distinctio perferendis temporibus obcaecati delectus, numquam ad!</p>
            </ImageTitleText>
          </section>
          <h2>Section 2</h2>
      </>
  )
}

export default Splash