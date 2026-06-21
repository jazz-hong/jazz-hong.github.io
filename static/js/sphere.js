(function () {
    const canvas = document.getElementById('sphere-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const PRIMARY = '#00ff00';

    function resize() {
        const parent = canvas.parentElement;
        const size = Math.min(parent.offsetWidth, parent.offsetHeight);
        canvas.width = size;
        canvas.height = size;
    }
    resize();
    window.addEventListener('resize', resize);

    let angle = 0;

    function project(x, y, z, globalAngle, cx, cy, r) {
        const cosA = Math.cos(globalAngle), sinA = Math.sin(globalAngle);
        const rx = x * cosA - z * sinA;
        const ry = y;
        const rz = x * sinA + z * cosA;
        const fov = 3;
        const scale = fov / (fov + rz);
        return { x: cx + rx * r * scale, y: cy + ry * r * scale };
    }

    function drawRing(tiltX, tiltY, tiltZ, radiusScale) {
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;
        const r = (Math.min(canvas.width, canvas.height) / 2) * 0.82 * radiusScale;
        const steps = 120;
        ctx.beginPath();
        for (let i = 0; i <= steps; i++) {
            const t = (i / steps) * Math.PI * 2;
            let x = Math.cos(t), y = Math.sin(t), z = 0;
            let y1 = y * Math.cos(tiltX) - z * Math.sin(tiltX);
            let z1 = y * Math.sin(tiltX) + z * Math.cos(tiltX);
            let x2 = x * Math.cos(tiltY) + z1 * Math.sin(tiltY);
            let z2 = -x * Math.sin(tiltY) + z1 * Math.cos(tiltY);
            let x3 = x2 * Math.cos(tiltZ) - y1 * Math.sin(tiltZ);
            let y3 = x2 * Math.sin(tiltZ) + y1 * Math.cos(tiltZ);
            const p = project(x3, y3, z2, angle, cx, cy, r);
            i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
        }
        ctx.strokeStyle = PRIMARY;
        ctx.lineWidth = 1.5;
        ctx.shadowColor = PRIMARY;
        ctx.shadowBlur = 6;
        ctx.stroke();
        ctx.shadowBlur = 0;
    }

    function drawCore() {
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;
        const r = 14;
        const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 3);
        glow.addColorStop(0, 'rgba(0,255,0,0.3)');
        glow.addColorStop(1, 'rgba(0,255,0,0)');
        ctx.beginPath();
        ctx.arc(cx, cy, r * 3, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fillStyle = PRIMARY;
        ctx.shadowColor = PRIMARY;
        ctx.shadowBlur = 20;
        ctx.fill();
        ctx.shadowBlur = 0;
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const deg60 = Math.PI / 3;
        drawRing(deg60, 0, 0, 1.0);
        drawRing(0, deg60, 0, 0.8);
        drawRing(0, 0, deg60, 0.6);
        drawCore();
        angle += (Math.PI * 2) / (20 * 60);
        requestAnimationFrame(animate);
    }

    animate();
})();
