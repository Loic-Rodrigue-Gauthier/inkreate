import { useNavigate } from "react-router-dom";
import styles from "./Splash.module.css";
import ImageTitleText from "../../components/ImageTitleText/ImageTitleText";
import NumberedTitleText from "../../components/NumberedTitleText/NumberedTitleText";
import GlobalStats from "../../components/GlobalStats/GlobalStats";
import avatarPlaceholder from "../../assets/avatar.svg";
import heroTexture from "../../assets/bliss.jpg";

function Splash() {
  const navigate = useNavigate();

  const goToPage = () => {
    navigate("/authentication");
  };

  const testimonials = [
    {
      name: "Sarah M.",
      title: "Fantasy Writer",
      quote:
        "InKreate has revolutionized how I write. Collaborating with other writers has made my stories so much richer and more alive!",
    },
    {
      name: "Mark A.",
      title: "Sci-fi Author",
      quote:
        "It's the perfect blend of writing community where everyone encourages each other. The real-time collaboration features are incredible!",
    },
    {
      name: "Emily R.",
      title: "Mystery Author",
      quote:
        "My stories look far more polished. InKreate helped me discover new partners for storytelling through collaboration.",
    },
  ];

  return (
    <div className={styles.page}>
      <section
        className={styles.hero}
        style={{ "--hero-bg": `url(${heroTexture})` }}
      >
        <div className={styles.heroText}>
          <div className={styles.logoRow}>
            <div className={styles.logoMark}>🪶</div>
            <h1>InKreate</h1>
          </div>
          <h2>Where stories come alive through collaborative storytelling</h2>
          <p>
            Join a vibrant community of writers who create incredible stories
            together. Write, collaborate, share, and connect with storytellers
            from around the world.
          </p>
          <div className={styles.ctaRow}>
            <button className="btn primary" onClick={goToPage}>
              Start Writing Together
            </button>
            <button className="btn ghost">
              <a href="#featuresSection">Explore Features</a>
            </button>
          </div>
          <div className={styles.statsRow}>
            <GlobalStats number="10k+" desc="Active Writers" />
            <GlobalStats number="25k+" desc="Story Creations" />
            <GlobalStats number="500k+" desc="Story Segments" />
          </div>
        </div>
        <div className={styles.heroCard}>
          <p className={styles.heroOverline}>Collaborate, share, discover.</p>
          <h3>
            Start your story alone or invite co-authors to build new worlds
            together.
          </h3>
          <div className={styles.heroActions}>
            <button className="btn primary" onClick={goToPage}>
              Join the Community
            </button>
            <button className="btn ghost" onClick={goToPage}>
              See Stories
            </button>
          </div>
        </div>
      </section>

      <section id="featuresSection" className={styles.features}>
        <div className={styles.sectionHeader}>
          <h3>Why Choose InKreate</h3>
          <p className={styles.subtext}>
            Discover the tools and community features that make collaborative
            storytelling magical.
          </p>
        </div>
        <div className={styles.featureGrid}>
          <ImageTitleText src={avatarPlaceholder} title="Collaborative Writing">
            <p>
              Write stories together, segment by segment, with writers from
              around the world.
            </p>
          </ImageTitleText>
          <ImageTitleText src={avatarPlaceholder} title="Social Community">
            <p>
              Follow your favorite writers, receive updates, and discover new
              friends.
            </p>
          </ImageTitleText>
          <ImageTitleText src={avatarPlaceholder} title="Real-time Chat">
            <p>
              Communicate with co-authors and plan your story direction
              together.
            </p>
          </ImageTitleText>
          <ImageTitleText src={avatarPlaceholder} title="Story Discovery">
            <p>
              Explore stories by genre, popularity, or find new collaborative
              opportunities.
            </p>
          </ImageTitleText>
          <ImageTitleText src={avatarPlaceholder} title="Read Later">
            <p>Save interesting stories to read when you have time.</p>
          </ImageTitleText>
          <ImageTitleText src={avatarPlaceholder} title="Rate & Review">
            <p>
              Rate stories, comment on segments, and provide feedback to fellow
              writers.
            </p>
          </ImageTitleText>
        </div>
      </section>

      <section className={styles.steps}>
        <div className={styles.sectionHeader}>
          <h3>How It Works</h3>
          <p className={styles.subtext}>
            Start your collaborative writing journey in three simple steps.
          </p>
        </div>
        <div className={styles.stepGrid}>
          <NumberedTitleText number="1" title="Create or Join">
            <p>
              Start a new story or join an existing collaboration project that
              inspires you.
            </p>
          </NumberedTitleText>
          <NumberedTitleText number="2" title="Write Together">
            <p>
              Add your segments, collaborate in real-time, and keep an amazing
              narrative flowing.
            </p>
          </NumberedTitleText>
          <NumberedTitleText number="3" title="Share & Discover">
            <p>
              Publish your collaborative masterpiece and discover new stories.
            </p>
          </NumberedTitleText>
        </div>
      </section>

      <section className={styles.testimonials}>
        <div className={styles.sectionHeader}>
          <h3>What Writers Say</h3>
          <p className={styles.subtext}>
            Hear from our community of collaborative storytellers.
          </p>
        </div>
        <div className={styles.testimonialGrid}>
          {testimonials.map((item, idx) => (
            <div key={idx} className={styles.testimonialCard}>
              <div className={styles.stars}>⭐⭐⭐⭐⭐</div>
              <p className={styles.quote}>"{item.quote}"</p>
              <div className={styles.author}>{item.name}</div>
              <div className={styles.role}>{item.title}</div>
            </div>
          ))}
        </div>
      </section>

      <div className={styles.footerCta}>
        <div>
          <h3>Ready to start your collaborative writing journey?</h3>
          <p className={styles.subtext}>
            Join thousands of writers who are already creating incredible
            stories together on InKreate.
          </p>
        </div>
        <button className="btn primary" onClick={goToPage}>
          Join the Community
        </button>
      </div>
    </div>
  );
}

export default Splash;
