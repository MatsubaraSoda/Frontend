// ===== Canvas 散点图和回归线模块 =====

/**
 * Canvas 配置
 */
const CANVAS_CONFIG = {
    WIDTH: 1000,
    HEIGHT: 1000,
    PADDING: 80, // 边距
    POINT_RADIUS: 4, // 散点半径
    LINE_WIDTH: 2, // 回归线宽度
    AXIS_WIDTH: 1, // 坐标轴宽度
    GRID_WIDTH: 0.5, // 网格线宽度
    TARGET_TICKS: 8, // 目标刻度数量
    COLORS: {
        BACKGROUND: '#ffffff',
        POINT: '#333333',
        REGRESSION_LINE: '#e74c3c',
        AXIS: '#2c3e50',
        GRID: '#bdc3c7',
        TEXT: '#2c3e50'
    }
};

/**
 * 散点图渲染器
 */
class ScatterPlotRenderer {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.xRange = [0, 1];
        this.yRange = [0, 1];
        
        this.initializeCanvas();
    }

    /**
     * 初始化Canvas
     */
    initializeCanvas() {
        if (!this.canvas || !this.ctx) {
            throw new Error('Canvas初始化失败');
        }
        
        // 设置Canvas尺寸
        this.canvas.width = CANVAS_CONFIG.WIDTH;
        this.canvas.height = CANVAS_CONFIG.HEIGHT;
        
        // 设置默认样式
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        this.ctx.font = '12px Arial';
        
        console.log('Canvas初始化完成');
    }

    /**
     * 计算数据范围
     * @param {Array} dataPoints - 数据点数组
     */
    calculateDataRange(dataPoints) {
        if (dataPoints.length === 0) return;

        const xValues = dataPoints.map(point => point.x);
        const yValues = dataPoints.map(point => point.y);

        const xMin = Math.min(...xValues);
        const xMax = Math.max(...xValues);
        const yMin = Math.min(...yValues);
        const yMax = Math.max(...yValues);

        // 添加10%的边距
        const xPadding = (xMax - xMin) * 0.1;
        const yPadding = (yMax - yMin) * 0.1;

        this.xRange = [xMin - xPadding, xMax + xPadding];
        this.yRange = [yMin - yPadding, yMax + yPadding];
    }

    /**
     * 将数据坐标转换为Canvas坐标
     * @param {number} x - 数据X坐标
     * @param {number} y - 数据Y坐标
     * @returns {Object} Canvas坐标
     */
    dataToCanvas(x, y) {
        const canvasX = CANVAS_CONFIG.PADDING + 
            ((x - this.xRange[0]) / (this.xRange[1] - this.xRange[0])) * 
            (CANVAS_CONFIG.WIDTH - 2 * CANVAS_CONFIG.PADDING);
        
        const canvasY = CANVAS_CONFIG.HEIGHT - CANVAS_CONFIG.PADDING - 
            ((y - this.yRange[0]) / (this.yRange[1] - this.yRange[0])) * 
            (CANVAS_CONFIG.HEIGHT - 2 * CANVAS_CONFIG.PADDING);
        
        return { x: canvasX, y: canvasY };
    }

    /**
     * 绘制网格
     */
    drawGrid() {
        this.ctx.save();
        this.ctx.strokeStyle = CANVAS_CONFIG.COLORS.GRID;
        this.ctx.lineWidth = CANVAS_CONFIG.GRID_WIDTH;
        this.ctx.setLineDash([2, 2]);

        // 计算刻度步长
        const xStep = (this.xRange[1] - this.xRange[0]) / CANVAS_CONFIG.TARGET_TICKS;
        const yStep = (this.yRange[1] - this.yRange[0]) / CANVAS_CONFIG.TARGET_TICKS;

        // 绘制垂直网格线
        for (let i = 0; i <= CANVAS_CONFIG.TARGET_TICKS; i++) {
            const x = this.xRange[0] + i * xStep;
            const canvasPos = this.dataToCanvas(x, this.yRange[0]);
            
            this.ctx.beginPath();
            this.ctx.moveTo(canvasPos.x, CANVAS_CONFIG.PADDING);
            this.ctx.lineTo(canvasPos.x, CANVAS_CONFIG.HEIGHT - CANVAS_CONFIG.PADDING);
            this.ctx.stroke();
        }

        // 绘制水平网格线
        for (let i = 0; i <= CANVAS_CONFIG.TARGET_TICKS; i++) {
            const y = this.yRange[0] + i * yStep;
            const canvasPos = this.dataToCanvas(this.xRange[0], y);
            
            this.ctx.beginPath();
            this.ctx.moveTo(CANVAS_CONFIG.PADDING, canvasPos.y);
            this.ctx.lineTo(CANVAS_CONFIG.WIDTH - CANVAS_CONFIG.PADDING, canvasPos.y);
            this.ctx.stroke();
        }

        this.ctx.restore();
    }

    /**
     * 绘制坐标轴
     */
    drawAxes() {
        this.ctx.save();
        this.ctx.strokeStyle = CANVAS_CONFIG.COLORS.AXIS;
        this.ctx.lineWidth = CANVAS_CONFIG.AXIS_WIDTH;
        this.ctx.setLineDash([]);

        // 绘制X轴
        this.ctx.beginPath();
        this.ctx.moveTo(CANVAS_CONFIG.PADDING, CANVAS_CONFIG.HEIGHT - CANVAS_CONFIG.PADDING);
        this.ctx.lineTo(CANVAS_CONFIG.WIDTH - CANVAS_CONFIG.PADDING, CANVAS_CONFIG.HEIGHT - CANVAS_CONFIG.PADDING);
        this.ctx.stroke();

        // 绘制Y轴
        this.ctx.beginPath();
        this.ctx.moveTo(CANVAS_CONFIG.PADDING, CANVAS_CONFIG.PADDING);
        this.ctx.lineTo(CANVAS_CONFIG.PADDING, CANVAS_CONFIG.HEIGHT - CANVAS_CONFIG.PADDING);
        this.ctx.stroke();

        this.ctx.restore();
    }

    /**
     * 绘制刻度标签
     */
    drawLabels() {
        this.ctx.save();
        this.ctx.fillStyle = CANVAS_CONFIG.COLORS.TEXT;
        this.ctx.font = '12px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'top';

        // 计算刻度步长
        const xStep = (this.xRange[1] - this.xRange[0]) / CANVAS_CONFIG.TARGET_TICKS;
        const yStep = (this.yRange[1] - this.yRange[0]) / CANVAS_CONFIG.TARGET_TICKS;

        // 绘制X轴标签
        for (let i = 0; i <= CANVAS_CONFIG.TARGET_TICKS; i++) {
            const x = this.xRange[0] + i * xStep;
            const canvasPos = this.dataToCanvas(x, this.yRange[0]);
            
            this.ctx.fillText(x.toFixed(2), canvasPos.x, CANVAS_CONFIG.HEIGHT - CANVAS_CONFIG.PADDING + 5);
        }

        // 绘制Y轴标签
        this.ctx.textAlign = 'right';
        this.ctx.textBaseline = 'middle';
        
        for (let i = 0; i <= CANVAS_CONFIG.TARGET_TICKS; i++) {
            const y = this.yRange[0] + i * yStep;
            const canvasPos = this.dataToCanvas(this.xRange[0], y);
            
            this.ctx.fillText(y.toFixed(2), CANVAS_CONFIG.PADDING - 5, canvasPos.y);
        }

        this.ctx.restore();
    }

    /**
     * 绘制散点
     * @param {Array} dataPoints - 数据点数组
     */
    drawDataPoints(dataPoints) {
        this.ctx.save();
        this.ctx.fillStyle = CANVAS_CONFIG.COLORS.POINT;

        dataPoints.forEach(point => {
            const canvasPos = this.dataToCanvas(point.x, point.y);
            
            this.ctx.beginPath();
            this.ctx.arc(canvasPos.x, canvasPos.y, CANVAS_CONFIG.POINT_RADIUS, 0, 2 * Math.PI);
            this.ctx.fill();
        });

        this.ctx.restore();
    }

    /**
     * 计算回归线
     * @param {Array} dataPoints - 数据点数组
     * @returns {Object} 回归线参数 {slope, intercept}
     */
    calculateRegressionLine(dataPoints) {
        if (dataPoints.length < 2) return null;

        const xValues = dataPoints.map(point => point.x);
        const yValues = dataPoints.map(point => point.y);

        const n = xValues.length;
        const xMean = xValues.reduce((sum, x) => sum + x, 0) / n;
        const yMean = yValues.reduce((sum, y) => sum + y, 0) / n;

        let numerator = 0;
        let denominator = 0;

        for (let i = 0; i < n; i++) {
            const xDiff = xValues[i] - xMean;
            numerator += xDiff * (yValues[i] - yMean);
            denominator += xDiff * xDiff;
        }

        const slope = denominator === 0 ? 0 : numerator / denominator;
        const intercept = yMean - slope * xMean;

        return { slope, intercept };
    }

    /**
     * 绘制回归线
     * @param {Object} regressionLine - 回归线参数
     */
    drawRegressionLine(regressionLine) {
        if (!regressionLine) return;

        this.ctx.save();
        this.ctx.strokeStyle = CANVAS_CONFIG.COLORS.REGRESSION_LINE;
        this.ctx.lineWidth = CANVAS_CONFIG.LINE_WIDTH;
        this.ctx.setLineDash([]);

        // 计算回归线在数据范围内的两个端点
        const x1 = this.xRange[0];
        const x2 = this.xRange[1];
        const y1 = regressionLine.slope * x1 + regressionLine.intercept;
        const y2 = regressionLine.slope * x2 + regressionLine.intercept;

        const p1 = this.dataToCanvas(x1, y1);
        const p2 = this.dataToCanvas(x2, y2);

        this.ctx.beginPath();
        this.ctx.moveTo(p1.x, p1.y);
        this.ctx.lineTo(p2.x, p2.y);
        this.ctx.stroke();

        this.ctx.restore();
    }

    /**
     * 清空画布
     */
    clearCanvas() {
        this.ctx.clearRect(0, 0, CANVAS_CONFIG.WIDTH, CANVAS_CONFIG.HEIGHT);
        
        // 设置白色背景
        this.ctx.save();
        this.ctx.fillStyle = CANVAS_CONFIG.COLORS.BACKGROUND;
        this.ctx.fillRect(0, 0, CANVAS_CONFIG.WIDTH, CANVAS_CONFIG.HEIGHT);
        this.ctx.restore();
    }

    /**
     * 渲染完整的散点图
     * @param {Array} dataPoints - 数据点数组
     */
    render(dataPoints) {
        if (!dataPoints || dataPoints.length === 0) {
            console.warn('没有数据点可以渲染');
            return;
        }

        try {
            // 清空画布
            this.clearCanvas();

            // 计算数据范围
            this.calculateDataRange(dataPoints);

            // 绘制各个组件
            this.drawGrid();
            this.drawAxes();
            this.drawLabels();
            this.drawDataPoints(dataPoints);

            // 计算并绘制回归线
            const regressionLine = this.calculateRegressionLine(dataPoints);
            if (regressionLine) {
                this.drawRegressionLine(regressionLine);
            }

            console.log(`散点图渲染完成，共${dataPoints.length}个数据点`);
            
        } catch (error) {
            console.error('散点图渲染失败:', error);
            throw error;
        }
    }
}

// ===== 导出模块 =====
export { ScatterPlotRenderer, CANVAS_CONFIG };
