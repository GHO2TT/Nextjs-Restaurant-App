import styles from "./LoadingSkeleton.module.css"; // Or your preferred styling method

function LoadingSkeleton() {
  return (
    <div className={styles.container}>
      <div className={styles.placeholderRow}>
        <div className={styles.placeholderImage} />
        <div className={styles.placeholderText} />
      </div>
      <div className={styles.placeholderRow}>
        <div className={styles.placeholderTextLarge} />
      </div>
    </div>
  );
}

export default LoadingSkeleton;
