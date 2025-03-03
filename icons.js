// 图标和favicon生成脚本
(function() {
  // 创建favicon
  function generateFavicon() {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    
    // 绘制背景
    ctx.fillStyle = '#2A5CAA';
    ctx.fillRect(0, 0, 32, 32);
    
    // 绘制文字
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('YB', 16, 16);
    
    // 创建link元素并添加到head
    const link = document.createElement('link');
    link.rel = 'icon';
    link.type = 'image/x-icon';
    link.href = canvas.toDataURL();
    document.head.appendChild(link);
  }
  
  // 初始化图标
  generateFavicon();
})();
