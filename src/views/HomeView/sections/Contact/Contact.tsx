import { ContactForm } from "@/components/ContactForm";
import { anchors } from "@/constants/anchors";
import type { HomeContent } from "@/content/home";
import styles from "./Contact.module.scss";

type Props = {
  content: HomeContent["contact"];
};

export function Contact({ content }: Props) {
  return (
    <section id={anchors.contact} className={styles.contact} aria-labelledby="contact-title">
      <div className={styles.inner}>
        <h2 id="contact-title" className={styles.title}>
          {content.title}
        </h2>
        <p className={styles.intro}>{content.intro}</p>
        <ContactForm labels={content.form} />
      </div>
    </section>
  );
}
