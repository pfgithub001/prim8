import { notFoundContent } from "@/content/notFound";
import { NotFoundView } from "@/views/NotFoundView";

export default function NotFound() {
  return <NotFoundView content={notFoundContent} />;
}
