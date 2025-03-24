import { getImageProps, StaticImageData } from 'next/image'

export function getImageSet(imagedata: StaticImageData ) {
  const { props: { src, srcSet }} = getImageProps({alt: '', ...imagedata})
  if (!srcSet){
    return `image-set(url("${src}"))`;
  }
  const imageSet = srcSet
    .split(', ')
    .map((str) => {
      const [url, dpi] = str.split(' ')
      return `url("${url}") ${dpi}`
    })
    .join(', ')
  return `image-set(${imageSet})`
}