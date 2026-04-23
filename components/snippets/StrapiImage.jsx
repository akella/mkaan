import Image from "next/image";

export default function StrapiImage({ field, fill = false, ...props }) {

  const params = {}
  if (!fill) {
    params.width = field.width;
    params.height = field.height;
  } else {
    params.fill = true;
  }

  if(!field.url) {
    return null;
  }

  return (
    <Image
      src={field.url}
      alt={field.alternativeText || 'image'}
      {...params}
      {...props}
    />
  );
}