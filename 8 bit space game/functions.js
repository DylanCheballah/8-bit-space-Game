
export const getMousePos = (canvas, event) => {
    var rect = canvas.getBoundingClientRect();
    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    };
};
export const isInside = (pos, rect) => {
    return pos.x > rect.x && pos.x < (rect.x + rect.width) && pos.y < (rect.y + rect.heigth) && pos.y > rect.y;
};
export const shipMove = (f1, f2, f3) => {
    setTimeout(f1, 200);
    setTimeout(f2, 300);
    setTimeout(f3, 400);
};
