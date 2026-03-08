import Image from "next/image";
import styles from "./StatCard.module.scss";

interface Props {
  title: string;
  value: string;
  icon: string;
}

export default function StatCard({ title, value, icon }: Props) {
  return (
    <div className={styles.card}>
      <Image src={icon} alt={title} width={40} height={40} />
      <p>{title}</p>
      <h3>{value}</h3>
    </div>
  );
}