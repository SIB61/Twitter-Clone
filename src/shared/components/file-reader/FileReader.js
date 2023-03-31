export function FileInput({ children, className,id, accept = "image/*" ,onSelect}) {
  const select = (ef) => {
    const file = ef.target.files[0]
    if(file){
    const fileReader = new FileReader()
    fileReader.onload = (el) => {
      onSelect({file:file,src:el.target.result})
    }
    fileReader.readAsDataURL(file)
    }
  }
  return (
    <div className={className} onClick={e=>e.stopPropagation()}>
      <label
        htmlFor={id}>
        {children}
      </label>
      <input
        id={id}
        accept={accept}
        style={{ display: "none" }}
        onChange={select}
        type="file"
      />
    </div>
  );
}
