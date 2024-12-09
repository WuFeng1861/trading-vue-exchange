import {getImageGreenPath, getImageYellowPath, getSvgGreenPath, getSvgPath, getSvgYellowPath} from "@/utils/index.js";
// 切换css主题文件
let theme = localStorage['theme-index'] ? Number(localStorage['theme-index']) : 2;
document.documentElement.setAttribute("data-theme", theme);
// 切换主题色
export const changeTheme = () => {
  theme = theme === 1 ? 2 : 1;
  console.log('theme', theme)
  localStorage['theme-index'] = theme;
  // 刷新网页
  window.location.reload();
};
// 获取主题
export const getTheme = () => theme;
// 获取主题色
export const getThemeColor = () => {
  return getTheme() === 1 ? '#ABF600' : '#F0B90B';
}
export const getThemeColor2 = () => {
  return getTheme() === 1 ? '#608A00' : '#b98900';
}

// 获取不同颜色的svg
// 获取不同颜色的图片

export const getThemeSvg = (name) => {
  if (theme === 2) {
    return getSvgYellowPath(name);
  }
  return getSvgGreenPath(name);
}
export const getThemeImage = (name) => {
  if (theme === 2) {
    return getImageYellowPath(name);
  }
  return getImageGreenPath(name);
}
