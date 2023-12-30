import React, { useRef, useEffect } from "react";

const FireWorks = (props) => {
  const canvasRef = useRef(null);
  const particles = [];

  const createParticle = (x, y) => {
    const particle = {
      x,
      y,
      radius: Math.random() * 5 + 3,
      color: `hsl(${Math.random() * 360}, 50%, 50%)`,
      vx: Math.random() * 6 - 3,
      vy: Math.random() * -4 - 2,
      life: Math.random() * 100 + 200,
    };
    return particle;
  };

  const createParticles = (x, y, numParticles) => {
    let num = numParticles;

    while (num--) {
      const direction = Math.random() * Math.PI * 2;
      const velocity = randomBetween(10, 20);
      const radius = 10 + Math.random() * 20;
      const explode = true;

      const particle = createParticle(
        x + Math.cos(direction) * radius,
        y + Math.sin(direction) * radius
      );

      particles.push(particle);
    }
  };

  const createRandomParticles = () => {
    const canvas = canvasRef.current;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const areaWidth = canvas.width * 0.75;
    const areaHeight = canvas.height * 0.75;

    const x = centerX - areaWidth / 2 + Math.random() * areaWidth;
    const y = centerY - areaHeight / 2 + Math.random() * areaHeight;

    const numParticles = Math.floor(Math.random() * 50) + 5;
    const randomDelay = Math.floor(Math.random() * (1500 - 150 + 1)) + 150;
    setTimeout(() => {
      createParticles(x, y, numParticles);
    }, randomDelay);
  };

  useEffect(() => {
    const canvas = canvasRef.current;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const randomExplosionsInterval = setInterval(createRandomParticles, 1000);

    const drawBackground = () => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, "#0b0033");
      gradient.addColorStop(1, "#26001b");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    const draw = () => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      drawBackground(); // Hívjuk meg a háttér kirajzolását

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        p.x += p.vx;
        p.y += p.vy;
        p.radius *= 0.96;
        p.life--;

        if (
          p.life <= 0 ||
          p.x < 0 ||
          p.x > canvas.width ||
          p.y < 0 ||
          p.y > canvas.height
        ) {
          particles.splice(i, 1);
          i--;
        }
      }
    };

    const handleMouseClick = (e) => {
      const { clientX, clientY } = e;
      for (let i = 0; i < 20; i++) {
        particles.push(createParticle(clientX, clientY));
      }
    };

    window.addEventListener("resize", resizeCanvas);
    canvas.addEventListener("click", handleMouseClick);

    resizeCanvas();

    const animationId = requestAnimationFrame(function animate() {
      draw();
      requestAnimationFrame(animate);
    });

    return () => {
      clearInterval(randomExplosionsInterval);
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resizeCanvas);
      canvas.removeEventListener("click", handleMouseClick);
    };
  }, []);

  return (
    <div
      style={{
        overflow: "hidden",
      }}
    >
      <canvas ref={canvasRef} style={{ backgroundColor: "black" }} {...props} />
    </div>
  );
};

export default FireWorks;

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}
