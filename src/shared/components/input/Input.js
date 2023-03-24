import styles from './Input.module.css'
export function Input({placeHolder,style,className,register,type}){
  return <div  className={styles.input+" "+className} style={style}>
    <input {...register} placeholder=' ' type={type} />
    <label>{placeHolder}</label>
  </div>
}
