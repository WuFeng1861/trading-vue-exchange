// 预加载图片
import {getLayoutPath} from "@/utils/index.js";

const prefetchImage = (imageUrl) => {
  var link = document.createElement('link');
  link.setAttribute('type','media_type');
  link.setAttribute('rel','prefetch');
  link.setAttribute('href',imageUrl);
  document.head.appendChild(link);
}


const prefetch = () => {
  const imageUrls = [
    getLayoutPath('Merc_1.jpg'),
    getLayoutPath('Merc_2.jpg'),
    getLayoutPath('Merc_3.jpg'),
    getLayoutPath('Merc_4.jpg'),
    getLayoutPath('Merc_5.jpg'),
  ];

  for(let i = 0; i < imageUrls.length; i++) {
    prefetchImage(imageUrls[i]);
  }
}

prefetch();
