const ARC_RADIUS = 15;

class Points {
    constructor(canvasNode) {
        this.canvasNode = canvasNode;
        this.context = this.canvasNode.getContext('2d');
        this.width = this.canvasNode.width = window.innerWidth;
        this.height = this.canvasNode.height = window.innerHeight;

        this.points = [];
        this.draggedIndex = null;

        this.handleResize = this.handleResize.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseDown = this.handleMouseDown.bind(this);

        this.init();
    }

    init() {
        this.canvasNode.addEventListener('mousedown', this.handleMouseDown);
        this.canvasNode.addEventListener('mousemove', this.handleMouseMove);
        this.canvasNode.addEventListener('mouseup', this.handleMouseUp);
        this.canvasNode.addEventListener('click', this.handleClick);
        window.addEventListener('resize', this.handleResize);
    }

    handleResize() {
        this.width = this.canvasNode.width = window.innerWidth;
        this.height = this.canvasNode.height = window.innerHeight;

        this.render();
    }

    handleMouseDown(event) {
        const { offsetX: x, offsetY: y } = event;
        const draggedIndex = this.points.findIndex(point =>
            this.isMouseOnPoint({ x, y }, point)
        );

        if (draggedIndex !== -1) {
            this.draggedIndex = draggedIndex;
        }
    }

    handleMouseMove(event) {
        const point = this.points[this.draggedIndex];

        if (point) {
            point.x = event.offsetX;
            point.y = event.offsetY;

            this.render();
        }
    }

    handleMouseUp() {
        if (this.draggedIndex !== null) {
            this.draggedIndex = null;

            this.render();
        }
    }

    handleClick(event) {
        const { offsetX: x, offsetY: y } = event;
        const hasClickedOnPoint = this.points.some(point =>
            this.isMouseOnPoint({ x, y }, point)
        );

        // If click coordinates are on an existing point
        if (hasClickedOnPoint) {
            return;
        }

        this.points.push({ x, y });
        this.render();
    }

    render() {
        this.context.clearRect(0, 0, this.width, this.height);

        this.points.forEach((point, index) => {
            const prevPoint = index === 0 ? point : this.points[index - 1];

            this.context.beginPath();
            this.context.strokeStyle = `rgba(255, 255, 255, ${this.draggedIndex !== null ? 0.5 : 1})`;
            this.context.lineWidth = 5;
            this.context.moveTo(prevPoint.x, prevPoint.y);
            this.context.lineTo(point.x, point.y);
            this.context.stroke();
            this.context.closePath();

            this.context.beginPath();
            this.context.fillStyle = '#ffffff';
            this.context.arc(
                point.x,
                point.y,
                ARC_RADIUS,
                0,
                Math.PI * 2
            );
            this.context.fill();
            this.context.closePath();
        });
    }

    isMouseOnPoint(mouse, point) {
        return (
            mouse.x >= point.x - ARC_RADIUS &&
            mouse.x <= point.x + ARC_RADIUS &&
            mouse.y >= point.y - ARC_RADIUS &&
            mouse.y <= point.y + ARC_RADIUS
        );
    }
}

new Points(document.getElementById('canvas'));
