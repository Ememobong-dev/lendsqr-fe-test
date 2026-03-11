import Image from "next/image";
import styles from "./StatCard.module.scss";

type StatCardProps = {
  title: string;
  value: string;
  icon: string;
};

export default function StatCard({
  title,
  value,
  icon,
}: StatCardProps) {
  return (
    <article className={styles.card}>
      <div className={styles.card__icon}>
        <Image src={icon} alt={title} width={40} height={40} />
      </div>

      <p className={styles.card__title}>{title}</p>
      <h3 className={styles.card__value}>{value}</h3>
    </article>
  );
}