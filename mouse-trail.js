// Mouse Trail Effect
document.addEventListener('DOMContentLoaded', function() {
    const trails = [];
    const numTrails = 12; // Number of trails
    const trailDelay = 10; // Trail delay

    // Create trail elements
    for (let i = 0; i < numTrails; i++) {
        const trail = document.createElement('div');
        trail.className = 'mouse-trail';
        const img = document.createElement('img');
        img.src = 'img/mouse.gif';
        trail.appendChild(img);
        trail.style.opacity = 1 - (i / numTrails); // Gradient opacity
        document.body.appendChild(trail);
        trails.push({
            element: trail,
            x: 0,
            y: 0
        });
    }

    // Update trail position
    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Animation loop
    function animate() {
        let currentX = mouseX;
        let currentY = mouseY;

        trails.forEach((trail, index) => {
            // Delayed follow effect
            setTimeout(() => {
                trail.element.style.left = `${currentX}px`;
                trail.element.style.top = `${currentY}px`;
            }, index * trailDelay);
        });

        requestAnimationFrame(animate);
    }

    animate();
}); 