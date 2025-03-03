/**
 * 数据可视化图表组件库
 * 为工作站提供美观、交互式的数据展现形式
 */

// 简单实现Canvas绘制图表的类库

// 基础图表类
export class Chart {
  constructor(container, options = {}) {
    if (!container) throw new Error('Chart container is required');
    
    this.container = container;
    this.canvas = document.createElement('canvas');
    this.container.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');
    
    // 基础配置
    this.options = Object.assign({
      width: container.clientWidth,
      height: container.clientHeight,
      padding: 20,
      animationDuration: 1000,
      backgroundColor: '#ffffff',
      responsive: true,
      tooltip: true,
      legend: true
    }, options);
    
    // 调整画布尺寸
    this.updateCanvasSize();
    
    // 响应式处理
    if (this.options.responsive) {
      window.addEventListener('resize', this.handleResize.bind(this));
    }
    
    // 交互事件
    if (this.options.tooltip) {
      this.tooltip = document.createElement('div');
      this.tooltip.className = 'chart-tooltip';
      this.tooltip.style.position = 'absolute';
      this.tooltip.style.padding = '8px';
      this.tooltip.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
      this.tooltip.style.color = '#fff';
      this.tooltip.style.borderRadius = '4px';
      this.tooltip.style.pointerEvents = 'none';
      this.tooltip.style.opacity = '0';
      this.tooltip.style.transition = 'opacity 0.3s';
      this.container.appendChild(this.tooltip);
      
      this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
      this.canvas.addEventListener('mouseout', this.handleMouseOut.bind(this));
    }
  }
  
  // 更新画布尺寸
  updateCanvasSize() {
    this.canvas.width = this.options.width;
    this.canvas.height = this.options.height;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.drawingArea = {
      left: this.options.padding,
      top: this.options.padding,
      right: this.width - this.options.padding,
      bottom: this.height - this.options.padding,
      width: this.width - 2 * this.options.padding,
      height: this.height - 2 * this.options.padding
    };
  }
  
  // 窗口大小变化处理
  handleResize() {
    this.options.width = this.container.clientWidth;
    this.options.height = this.container.clientHeight;
    this.updateCanvasSize();
    this.render();
  }
  
  // 鼠标移动处理
  handleMouseMove(e) {
    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const dataPoint = this.getDataPointAtCoordinate(x, y);
    
    if (dataPoint) {
      this.tooltip.style.opacity = '1';
      this.tooltip.style.left = `${e.clientX - rect.left + 10}px`;
      this.tooltip.style.top = `${e.clientY - rect.top + 10}px`;
      this.tooltip.innerHTML = this.getTooltipContent(dataPoint);
    } else {
      this.tooltip.style.opacity = '0';
    }
  }
  
  // 鼠标移出处理
  handleMouseOut() {
    this.tooltip.style.opacity = '0';
  }
  
  // 获取指定坐标点的数据（由子类实现）
  getDataPointAtCoordinate(x, y) {
    return null;
  }
  
  // 获取提示框内容（由子类实现）
  getTooltipContent(dataPoint) {
    return '';
  }
  
  // 清除画布
  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.ctx.fillStyle = this.options.backgroundColor;
    this.ctx.fillRect(0, 0, this.width, this.height);
  }
  
  // 渲染图表
  render() {
    this.clear();
    // 具体渲染逻辑由子类实现
  }
  
  // 销毁图表
  destroy() {
    if (this.options.responsive) {
      window.removeEventListener('resize', this.handleResize.bind(this));
    }
    
    if (this.options.tooltip) {
      this.canvas.removeEventListener('mousemove', this.handleMouseMove.bind(this));
      this.canvas.removeEventListener('mouseout', this.handleMouseOut.bind(this));
      this.container.removeChild(this.tooltip);
    }
    
    this.container.removeChild(this.canvas);
  }
}

// 柱状图
export class BarChart extends Chart {
  constructor(container, data, options = {}) {
    super(container, options);
    
    this.data = data;
    this.options = Object.assign({
      barSpacing: 20,
      barWidth: 40,
      colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#6366f1', '#8b5cf6'],
      xAxis: {
        gridLines: true,
        tickCount: 5,
      },
      yAxis: {
        gridLines: true,
        tickCount: 5,
      },
    }, this.options);
    
    this.render();
  }
  
  render() {
    super.render();
    
    const { data, ctx, drawingArea } = this;
    const { left, right, top, bottom, width, height } = drawingArea;
    
    // 找出数据最大值
    const maxValue = Math.max(...data.values);
    const barCount = data.values.length;
    
    // 计算每个柱子的宽度和间距
    const barWidth = this.options.barWidth;
    const barSpacing = this.options.barSpacing;
    const totalBarWidth = (barWidth + barSpacing) * barCount;
    
    // 计算起始X坐标
    const startX = left + (width - totalBarWidth) / 2;
    
    // 绘制Y轴
    ctx.strokeStyle = '#ccc';
    ctx.beginPath();
    ctx.moveTo(left, top);
    ctx.lineTo(left, bottom);
    ctx.stroke();
    
    // 绘制Y轴刻度和网格线
    const yTickCount = this.options.yAxis.tickCount;
    const yTickStep = maxValue / yTickCount;
    
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#666';
    ctx.font = '12px Arial';
    
    for (let i = 0; i <= yTickCount; i++) {
      const value = i * yTickStep;
      const y = bottom - (value / maxValue * height);
      
      // 刻度值
      ctx.fillText(Math.round(value), left - 5, y);
      
      // 网格线
      if (this.options.yAxis.gridLines && i > 0) {
        ctx.strokeStyle = '#eee';
        ctx.beginPath();
        ctx.moveTo(left, y);
        ctx.lineTo(right, y);
        ctx.stroke();
      }
    }
    
    // 绘制X轴
    ctx.strokeStyle = '#ccc';
    ctx.beginPath();
    ctx.moveTo(left, bottom);
    ctx.lineTo(right, bottom);
    ctx.stroke();
    
    // 绘制柱状图
    data.values.forEach((value, index) => {
      const x = startX + index * (barWidth + barSpacing);
      const barHeight = (value / maxValue) * height;
      const y = bottom - barHeight;
      
      // 设置柱子颜色
      ctx.fillStyle = this.options.colors[index % this.options.colors.length];
      
      // 绘制柱子
      ctx.fillRect(x, y, barWidth, barHeight);
      
      // 绘制标签
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillStyle = '#333';
      ctx.font = '12px Arial';
      ctx.fillText(data.labels[index], x + barWidth / 2, bottom + 5);
      
      // 绘制数值
      ctx.textBaseline = 'bottom';
      ctx.fillText(value, x + barWidth / 2, y - 5);
    });
    
    // 绘制标题
    if (data.title) {
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillStyle = '#333';
      ctx.font = 'bold 16px Arial';
      ctx.fillText(data.title, this.width / 2, 10);
    }
  }
  
  getDataPointAtCoordinate(x, y) {
    const { data, drawingArea } = this;
    const { left, bottom, height } = drawingArea;
    const barWidth = this.options.barWidth;
    const barSpacing = this.options.barSpacing;
    const barCount = data.values.length;
    const totalBarWidth = (barWidth + barSpacing) * barCount;
    const startX = left + (drawingArea.width - totalBarWidth) / 2;
    const maxValue = Math.max(...data.values);
    
    // 检查是否在任一柱子内
    for (let i = 0; i < data.values.length; i++) {
      const barX = startX + i * (barWidth + barSpacing);
      const barHeight = (data.values[i] / maxValue) * height;
      const barY = bottom - barHeight;
      
      if (x >= barX && x <= barX + barWidth && y >= barY && y <= bottom) {
        return {
          index: i,
          label: data.labels[i],
          value: data.values[i]
        };
      }
    }
    
    return null;
  }
  
  getTooltipContent(dataPoint) {
    return `${dataPoint.label}: ${dataPoint.value}`;
  }
}

// 饼图
export class PieChart extends Chart {
  constructor(container, data, options = {}) {
    super(container, options);
    
    this.data = data;
    this.options = Object.assign({
      colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#6366f1', '#8b5cf6'],
      donut: false,
      donutRatio: 0.5,
      startAngle: 0
    }, this.options);
    
    this.render();
  }
  
  render() {
    super.render();
    
    const { data, ctx, width, height } = this;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(centerX, centerY) - this.options.padding;
    
    // 计算总和
    const total = data.values.reduce((sum, value) => sum + value, 0);
    
    // 计算每个扇区的角度
    let startAngle = this.options.startAngle * (Math.PI / 180);
    
    // 绘制饼图或环形图
    const drawSlice = (startAngle, endAngle, color, label, value, percentage) => {
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();
      
      ctx.fillStyle = color;
      ctx.fill();
      
      // 如果是环形图，绘制中间的空心部分
      if (this.options.donut) {
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius * this.options.donutRatio, 0, Math.PI * 2);
        ctx.fillStyle = this.options.backgroundColor;
        ctx.fill();
      }
      
      // 绘制标签连接线和文字
      const midAngle = startAngle + (endAngle - startAngle) / 2;
      const labelRadius = radius * 1.2;
      const labelX = centerX + Math.cos(midAngle) * labelRadius;
      const labelY = centerY + Math.sin(midAngle) * labelRadius;
      
      // 连接线
      ctx.beginPath();
      ctx.moveTo(
        centerX + Math.cos(midAngle) * radius * 0.9,
        centerY + Math.sin(midAngle) * radius * 0.9
      );
      ctx.lineTo(labelX, labelY);
      ctx.strokeStyle = '#666';
      ctx.stroke();
      
      // 标签
      ctx.font = '12px Arial';
      ctx.fillStyle = '#333';
      ctx.textAlign = (labelX > centerX) ? 'left' : 'right';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${label}: ${value} (${percentage.toFixed(1)}%)`, labelX, labelY);
    };
    
    // 绘制每个扇区
    data.values.forEach((value, index) => {
      const percentage = (value / total) * 100;
      const angleSize = (percentage / 100) * Math.PI * 2;
      const endAngle = startAngle + angleSize;
      const color = this.options.colors[index % this.options.colors.length];
      
      drawSlice(
        startAngle,
        endAngle,
        color,
        data.labels[index],
        value,
        percentage
      );
      
      startAngle = endAngle;
    });
    
    // 绘制标题
    if (data.title) {
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillStyle = '#333';
      ctx.font = 'bold 16px Arial';
      ctx.fillText(data.title, this.width / 2, 10);
    }
    
    // 如果是环形图，在中心绘制总数
    if (this.options.donut) {
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#333';
      ctx.font = 'bold 14px Arial';
      ctx.fillText('总计', centerX, centerY - 10);
      ctx.font = 'bold 18px Arial';
      ctx.fillText(total.toString(), centerX, centerY + 15);
    }
  }
  
  getDataPointAtCoordinate(x, y) {
    const { data, width, height } = this;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(centerX, centerY) - this.options.padding;
    
    // 计算点击位置与中心点的距离
    const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
    
    // 如果点击在圆外，或者环形图的内圆内，则不处理
    if (distance > radius || (this.options.donut && distance < radius * this.options.donutRatio)) {
      return null;
    }
    
    // 计算点击位置的角度
    let angle = Math.atan2(y - centerY, x - centerX);
    if (angle < 0) angle += Math.PI * 2;
    
    // 调整起始角度
    const adjustedAngle = (angle - this.options.startAngle * (Math.PI / 180) + Math.PI * 2) % (Math.PI * 2);
    
    // 计算总和并找出点击的扇区
    const total = data.values.reduce((sum, value) => sum + value, 0);
    let currentAngle = 0;
    
    for (let i = 0; i < data.values.length; i++) {
      const percentage = (data.values[i] / total) * 100;
      const sliceAngle = (percentage / 100) * Math.PI * 2;
      
      if (adjustedAngle < currentAngle + sliceAngle) {
        return {
          index: i,
          label: data.labels[i],
          value: data.values[i],
          percentage
        };
      }
      
      currentAngle += sliceAngle;
    }
    
    return null;
  }
  
  getTooltipContent(dataPoint) {
    return `${dataPoint.label}: ${dataPoint.value} (${dataPoint.percentage.toFixed(1)}%)`;
  }
}

// 折线图
export class LineChart extends Chart {
  constructor(container, data, options = {}) {
    super(container, options);
    
    this.data = data;
    this.options = Object.assign({
      colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#6366f1'],
      lineWidth: 2,
      pointRadius: 4,
      fillArea: false,
      xAxis: {
        gridLines: true,
        tickCount: data.labels.length
      },
      yAxis: {
        gridLines: true,
        tickCount: 5,
      },
      animation: true
    }, this.options);
    
    // 如果有多个数据系列，格式化数据
    if (!Array.isArray(this.data.datasets) && !Array.isArray(this.data.values)) {
      this.data.datasets = [
        {
          label: this.data.label || '数据系列',
          values: this.data.values,
          color: this.options.colors[0]
        }
      ];
    } else if (Array.isArray(this.data.values)) {
      this.data.datasets = [
        {
          label: this.data.label || '数据系列',
          values: this.data.values,
          color: this.options.colors[0]
        }
      ];
    }
    
    // 动画相关
    this.animationProgress = 0;
    this.animationStartTime = null;
    
    this.render();
  }
  
  render() {
    super.render();
    
    const { data, ctx, drawingArea } = this;
    const { left, right, top, bottom, width, height } = drawingArea;
    
    // 找出所有数据系列中的最大值
    const allValues = data.datasets.reduce((all, dataset) => all.concat(dataset.values), []);
    const maxValue = Math.max(...allValues) * 1.1; // 增加10%的空间
    
    // 绘制X轴和Y轴
    ctx.strokeStyle = '#ccc';
    ctx.beginPath();
    ctx.moveTo(left, bottom);
    ctx.lineTo(right, bottom);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(left, bottom);
    ctx.lineTo(left, top);
    ctx.stroke();
    
    // 绘制Y轴刻度和网格线
    const yTickCount = this.options.yAxis.tickCount;
    const yTickStep = maxValue / yTickCount;
    
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#666';
    ctx.font = '12px Arial';
    
    for (let i = 0; i <= yTickCount; i++) {
      const value = i * yTickStep;
      const y = bottom - (value / maxValue * height);
      
      // 刻度值
      ctx.fillText(Math.round(value), left - 5, y);
      
      // 网格线
      if (this.options.yAxis.gridLines && i > 0) {
        ctx.strokeStyle = '#eee';
        ctx.beginPath();
        ctx.moveTo(left, y);
        ctx.lineTo(right, y);
        ctx.stroke();
      }
    }
    
    // 绘制X轴刻度和标签
    const labelCount = data.labels.length;
    const labelStep = width / (labelCount - 1);
    
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillStyle = '#666';
    
    data.labels.forEach((label, index) => {
      const x = left + index * labelStep;
      
      // 标签
      ctx.fillText(label, x, bottom + 5);
      
      // 网格线
      if (this.options.xAxis.gridLines && index > 0) {
        ctx.strokeStyle = '#eee';
        ctx.beginPath();
        ctx.moveTo(x, bottom);
        ctx.lineTo(x, top);
        ctx.stroke();
      }
    });
    
    // 绘制标题
    if (data.title) {
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillStyle = '#333';
      ctx.font = 'bold 16px Arial';
      ctx.fillText(data.title, this.width / 2, 10);
    }
    
    // 计算动画进度
    if (this.options.animation) {
      if (!this.animationStartTime) {
        this.animationStartTime = Date.now();
        requestAnimationFrame(this.animate.bind(this));
        return;
      }
      
      const elapsed = Date.now() - this.animationStartTime;
      const duration = this.options.animationDuration;
      this.animationProgress = Math.min(1, elapsed / duration);
    } else {
      this.animationProgress = 1;
    }
    
    // 绘制每个数据系列
    data.datasets.forEach((dataset, datasetIndex) => {
      const { values, color } = dataset;
      const points = [];
      
      // 计算各点坐标
      for (let i = 0; i < values.length; i++) {
        const x = left + i * labelStep;
        const valueRatio = values[i] / maxValue;
        const y = bottom - (valueRatio * height * this.animationProgress);
        points.push({ x, y });
      }
      
      // 绘制折线
      ctx.strokeStyle = color || this.options.colors[datasetIndex % this.options.colors.length];
      ctx.lineWidth = this.options.lineWidth;
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      
      ctx.stroke();
      
      // 如果需要填充区域
      if (this.options.fillArea) {
        ctx.fillStyle = `${color || this.options.colors[datasetIndex % this.options.colors.length]}33`; // 添加透明度
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        
        for (let i = 1; i < points.length; i++) {
          ctx.lineTo(points[i].x, points[i].y);
        }
        
        ctx.lineTo(points[points.length - 1].x, bottom);
        ctx.lineTo(points[0].x, bottom);
        ctx.closePath();
        ctx.fill();
      }
      
      // 绘制数据点
      ctx.fillStyle = color || this.options.colors[datasetIndex % this.options.colors.length];
      for (const point of points) {
        ctx.beginPath();
        ctx.arc(point.x, point.y, this.options.pointRadius, 0, Math.PI * 2);
        ctx.fill();
        
        // 点的边框
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    });
    
    // 绘制图例
    if (this.options.legend && data.datasets.length > 1) {
      const legendX = left;
      const legendY = top - 10;
      const lineLength = 20;
      
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.font = '12px Arial';
      
      let currentX = legendX;
      
      data.datasets.forEach((dataset, index) => {
        const color = dataset.color || this.options.colors[index % this.options.colors.length];
        
        // 图例线条
        ctx.strokeStyle = color;
        ctx.lineWidth = this.options.lineWidth;
        ctx.beginPath();
        ctx.moveTo(currentX, legendY);
        ctx.lineTo(currentX + lineLength, legendY);
        ctx.stroke();
        
        // 图例点
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(currentX + lineLength / 2, legendY, this.options.pointRadius, 0, Math.PI * 2);
        ctx.fill();
        
        // 图例文字
        ctx.fillStyle = '#333';
        ctx.fillText(dataset.label, currentX + lineLength + 5, legendY);
        
        // 更新X坐标
        currentX += lineLength + 5 + ctx.measureText(dataset.label).width + 15;
      });
    }
  }
  
  animate() {
    if (this.animationProgress < 1) {
      this.render();
      requestAnimationFrame(this.animate.bind(this));
    }
  }
  
  getDataPointAtCoordinate(x, y) {
    const { data, drawingArea } = this;
    const { left, bottom, width, height } = drawingArea;
    const labelCount = data.labels.length;
    const labelStep = width / (labelCount - 1);
    const allValues = data.datasets.reduce((all, dataset) => all.concat(dataset.values), []);
    const maxValue = Math.max(...allValues);
    
    // 找出距离点击位置最近的数据点
    let closestDistance = Infinity;
    let closestPoint = null;
    
    data.datasets.forEach((dataset, datasetIndex) => {
      const { values } = dataset;
      
      for (let i = 0; i < values.length; i++) {
        const pointX = left + i * labelStep;
        const pointY = bottom - (values[i] / maxValue * height);
        
        const distance = Math.sqrt(Math.pow(x - pointX, 2) + Math.pow(y - pointY, 2));
        
        if (distance < closestDistance && distance < this.options.pointRadius * 3) {
          closestDistance = distance;
          closestPoint = {
            datasetIndex,
            index: i,
            label: data.labels[i],
            datasetLabel: dataset.label,
            value: values[i]
          };
        }
      }
    });
    
    return closestPoint;
  }
  
  getTooltipContent(dataPoint) {
    return `${dataPoint.label}<br>${dataPoint.datasetLabel}: ${dataPoint.value}`;
  }
}

// 创建图表的工厂函数
export function createChart(type, container, data, options = {}) {
  switch (type.toLowerCase()) {
    case 'bar':
      return new BarChart(container, data, options);
    case 'pie':
    case 'donut':
      options.donut = type.toLowerCase() === 'donut';
      return new PieChart(container, data, options);
    case 'line':
      return new LineChart(container, data, options);
    default:
      throw new Error(`Unsupported chart type: ${type}`);
  }
}

// 注册全局方法
if (typeof window !== 'undefined') {
  window.ChartLib = {
    Chart,
    BarChart,
    PieChart,
    LineChart,
    createChart
  };
}