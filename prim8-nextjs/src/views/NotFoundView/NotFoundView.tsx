import { Button } from "@/components/Button";
import type { NotFoundContent } from "@/content/notFound";
import { href } from "@/lib/routes";
import styles from "./NotFoundView.module.scss";

type Props = {
  content: NotFoundContent;
};

export function NotFoundView({ content }: Props) {
  return (
    <main className={styles.view}>
      <h1 className={styles.title}>{content.title}</h1>
      <p className={styles.message}>{content.message}</p>
      <Button href={href("home")} variant="secondary">
        {content.backLabel}
      </Button>
    </main>
  );
}
