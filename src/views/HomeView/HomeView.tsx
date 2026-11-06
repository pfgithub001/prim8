import type { HomeContent } from "@/content/home";
import { Contact } from "./sections/Contact";
import { Hero } from "./sections/Hero";
import styles from "./HomeView.module.scss";

type Props = {
  content: HomeContent;
};

export function HomeView({ content }: Props) {
  return (
    <main className={styles.view}>
      <Hero content={content.hero} />
      <Contact content={content.contact} />
    </main>
  );
}
