import styles from "./Loader.module.scss"

export interface LoaderProps {
  fullscreen?: boolean
  visible?: boolean
}

export const Loader = (props: LoaderProps) => {
  const { fullscreen = false, visible = true } = props

  if (!visible) return null

  return (
    <div className={fullscreen ? styles["fullscreen-wrapper"] : styles.wrapper}>
      <div className={styles.spinner} />
    </div>
  )
}
