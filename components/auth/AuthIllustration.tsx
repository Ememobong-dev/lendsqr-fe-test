import Image from "next/image";
import Logo from "@/public/brandlogo.svg";
import Illustration from "@/assets/svgs/authIllus.svg";
import styles from "./AuthIllustration.module.scss";

export default function AuthIllustration() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.logo}>
        <Image src={Logo} alt="Lendsqr" priority />
      </div>

      <div className={styles.illustration}>
        <Image src={Illustration} alt="Login illustration" priority />
      </div>
    </div>
  );
}