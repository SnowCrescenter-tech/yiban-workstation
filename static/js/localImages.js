/**
 * 本地图片资源管理
 * 提供图片URL或Base64编码
 */

// 默认图片资源
const defaultImages = {
  logo: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNDAgNjAiPjxwYXRoIGZpbGw9IiMzYjgyZjYiIGQ9Ik00MC4yIDExLjhDMjYuNyA1LjkgMTEuOSAxMi4yIDYgMjUuOCAwLjEgMzkuMyA2LjQgNTQuMSAyMCA2MGMxMy41IDUuOSAyOC4zLTAuNCAzNC4yLTE0czAtMjguMy0xNC0zNC4yem0tNi40IDM3Yy03LjcgMy4zLTE2LjctMC4xLTIwLTcuOGMtMy4zLTcuNyAwLjEtMTYuNyA3LjgtMjBzMTYuNyAwLjEgMjAgNy44YzMuMyA3LjcgMCAxNi43LTcuOCAyMHoiLz48cGF0aCBmaWxsPSIjMjUyMzIzIiBkPSJNOTAuNCAxNmgtMTB2NGg2djI0aDR2LTI4ek0xMDUuNCAxNmgtNnY0aDJ2MjBoLTJ2NGg2di00aC0ydi0yMGgydjQwaDR2LTQ0aC00djR6TTExNi40IDE2aC00djI4aDR2LTI4ek0xMjkuNCAxNmgtOHY0aDJ2MjBoLTJ2NGg4di00aC0ydi0yMGgydi00ek0xNDQuNCAxNmgtOHY0aDJ2MjBoLTJ2NGg0djRoNHYtNGg0di0yOGgtNHY0ek0xNTYuNCAxNmgtNHYyOGg0di0yOHpNMTczLjQgMTZoLTh2NGgydjI0aDR2LTI0aDJ2LTR6TTIwNC40IDE2aC04djRoMnYyMGgtMnY0aDh2LTRoLTJ2LTIwaDJ2LTR6TTE5MC40IDE2aC00djRoMnYyMGgydi0yNHpNMjEzLjQgMTZoLTR2MjhoNHYtMjh6TTIyMi40IDE2aC00djI4aDh2LTRoLTR2LTI0eiIvPjwvc3ZnPg==',
  avatar: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"%3E%3Crect width="100" height="100" fill="%23e5e7eb"/%3E%3Ccircle cx="50" cy="40" r="20" fill="%23909399"/%3E%3Cpath d="M20,85 C20,65 80,65 80,85" fill="%23909399"/%3E%3C/svg%3E',
  empty: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"%3E%3Crect width="200" height="200" fill="%23f9fafb"/%3E%3Cpath d="M75,80 L125,80 L115,120 L85,120 Z" fill="%23e5e7eb" stroke="%23d1d5db" stroke-width="2"/%3E%3Ccircle cx="100" cy="65" r="20" fill="%23e5e7eb" stroke="%23d1d5db" stroke-width="2"/%3E%3Cpath d="M60,140 L140,140" stroke="%23d1d5db" stroke-width="2"/%3E%3Ctext x="100" y="160" font-family="Arial" font-size="14" fill="%23909399" text-anchor="middle"%3E暂无数据%3C/text%3E%3C/svg%3E',
  error: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"%3E%3Crect width="200" height="200" fill="%23f9fafb"/%3E%3Ccircle cx="100" cy="70" r="50" fill="%23fee2e2" stroke="%23ef4444" stroke-width="2"/%3E%3Cpath d="M80,50 L120,90 M120,50 L80,90" stroke="%23ef4444" stroke-width="5" stroke-linecap="round"/%3E%3Ctext x="100" y="160" font-family="Arial" font-size="14" fill="%23ef4444" text-anchor="middle"%3E加载失败%3C/text%3E%3C/svg%3E',
  carousel1: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="400"%3E%3Crect width="800" height="400" fill="%236366f1"/%3E%3Ctext x="400" y="200" font-family="Arial" font-size="48" fill="white" text-anchor="middle" dominant-baseline="middle"%3E校园文化节%3C/text%3E%3C/svg%3E',
  carousel2: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="400"%3E%3Crect width="800" height="400" fill="%2310b981"/%3E%3Ctext x="400" y="200" font-family="Arial" font-size="48" fill="white" text-anchor="middle" dominant-baseline="middle"%3E新媒体技术培训%3C/text%3E%3C/svg%3E',
  carousel3: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="400"%3E%3Crect width="800" height="400" fill="%23f59e0b"/%3E%3Ctext x="400" y="200" font-family="Arial" font-size="48" fill="white" text-anchor="middle" dominant-baseline="middle"%3E校园形象宣传片%3C/text%3E%3C/svg%3E'
};

// 导出图片资源
export const images = defaultImages;

/**
 * 获取占位图片
 * @param {string} type - 图片类型：avatar, empty, error
 * @returns {string} 图片URL
 */
export function getPlaceholderImage(type) {
  switch (type) {
    case 'avatar':
      return images.avatar;
    case 'empty':
      return images.empty;
    case 'error':
      return images.error;
    default:
      return images.empty;
  }
}

/**
 * 预加载图片
 * 用于提前缓存图片，提升用户体验
 */
export function preloadImages() {
  for (const key in images) {
    if (Object.hasOwnProperty.call(images, key)) {
      const img = new Image();
      img.src = images[key];
    }
  }
}

// 页面加载完成后预加载图片
if (typeof window !== 'undefined') {
  window.addEventListener('load', preloadImages);
}

/**
 * 创建彩色块SVG图片
 * @param {string} text - 显示的文字
 * @param {string} color - 背景颜色，例如 '#ff0000' 或 'red'
 * @param {number} width - 宽度
 * @param {number} height - 高度
 * @returns {string} SVG图片的Data URL
 */
export function createColorBlockSVG(text, color = '#409eff', width = 300, height = 200) {
  // 将#号替换为正确的编码
  const colorCode = color.replace('#', '%23');
  
  // 生成SVG
  const svg = `data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"%3E%3Crect width="${width}" height="${height}" fill="${colorCode}"/%3E%3Ctext x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="18" fill="%23ffffff">${text}%3C/text%3E%3C/svg%3E`;
  
  return svg;
}
