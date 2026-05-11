import { useNavigate } from "react-router";

export default function Box({ dataObj, classes, image_class }) {
  console.log(image_class)
  console.log(dataObj)
  if (dataObj.data == null) return;
  const { role, path, ...rest } = dataObj.data;
  if (!Object.entries(rest).length) return;
  const { images, name, mal_id } = rest;
  return (
    <>
      <div className="relative w-full h-full">
        <a className="inline-block w-full h-full box-border " href={`/${path}/${mal_id}`}>
          <img style={{height:"100%"}} className={image_class} src={images.jpg.image_url} alt={name} />
          <div className={`${classes.responsive_text} ${classes.name_class}`}>{name}</div>
          {role ? <div className={`${classes.responsive_text} ${classes.role_class}`}>{role}</div> : ""}
        </a>
      </div>
    </>
  );
}
