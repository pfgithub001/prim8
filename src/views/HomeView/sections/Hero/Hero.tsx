import { Button } from "@/components/Button";
import { anchors } from "@/constants/anchors";
import type { HomeContent } from "@/content/home";
import { href } from "@/lib/routes";
import styles from "./Hero.module.scss";

type Props = {
  content: HomeContent["hero"];
};

export function Hero({ content }: Props) {
  return (
    <section className={styles.hero}>
      <div className={styles.inner}>
        <p className={styles.eyebrow}>{content.eyebrow}</p>
        <h1 className={styles.title}>{content.title}</h1>
        <p className={styles.lead}>{content.lead}</p>
        <Button href={`${href("home")}#${anchors.contact}`}>{content.ctaLabel}</Button>
      </div>
    </section>
  );
}
