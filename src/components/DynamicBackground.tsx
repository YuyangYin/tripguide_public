import { useEffect, useRef } from 'react';
import { ThemeId } from '../types';

interface DynamicBackgroundProps {
  themeId: ThemeId;
}

export default function DynamicBackground({ themeId }: DynamicBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 400);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 800);

    const handleResize = () => {
      if (canvas && canvas.parentElement) {
        width = canvas.width = canvas.parentElement.clientWidth;
        height = canvas.height = canvas.parentElement.clientHeight;
      }
    };
    window.addEventListener('resize', handleResize);

    // 1. Snow particles (Glacial Theme)
    const snowflakes: { x: number; y: number; r: number; d: number; speed: number; drift: number }[] = [];
    for (let i = 0; i < 40; i++) {
      snowflakes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 3 + 1, // Snowflake radius
        d: Math.random() * 40,
        speed: Math.random() * 1 + 0.5,
        drift: Math.random() * 0.5 - 0.25,
      });
    }

    // 2. Fireplace sparks (Cozy Theme)
    const sparks: { x: number; y: number; size: number; alpha: number; speedY: number; speedX: number; life: number; maxLife: number }[] = [];
    const createSpark = () => {
      return {
        x: Math.random() * width,
        y: height - Math.random() * 50,
        size: Math.random() * 3 + 1,
        alpha: Math.random() * 0.5 + 0.5,
        speedY: -(Math.random() * 1.5 + 0.5),
        speedX: Math.random() * 1 - 0.5,
        life: 0,
        maxLife: Math.random() * 100 + 100,
      };
    };
    for (let i = 0; i < 20; i++) sparks.push(createSpark());

    // 3. Cyber grid offset (Cyber theme)
    let cyberOffset = 0;

    // 4. Aurora ribbon controls (Aurora theme)
    let auroraTime = 0;

    // 5. Glassy glow timing
    let glassyTime = 0;
    let frostedTime = 0;

    // 6. Midnight star particles
    const midnightStars: { x: number; y: number; r: number; alpha: number; pulseSpeed: number; phase: number }[] = [];
    for (let i = 0; i < 45; i++) {
      midnightStars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.5 + 0.2,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        phase: Math.random() * Math.PI * 2,
      });
    }

    // RENDER LOOP
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      if (themeId === 'glacial') {
        // Snow is rendered at the end of the render loop to support both glacial and dark themes.
      } 
      else if (themeId === 'cozy') {
        // Render rise-up embers from bottom fireplace
        for (let i = 0; i < sparks.length; i++) {
          const s = sparks[i];
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(237, 137, 54, ${s.alpha * (1 - s.life / s.maxLife)})`; // Orange-red spark
          ctx.shadowBlur = 10;
          ctx.shadowColor = 'rgba(237, 137, 54, 0.8)';
          ctx.fill();
          ctx.shadowBlur = 0; // Reset shadow

          // Update
          s.y += s.speedY;
          s.x += s.speedX + Math.sin(s.y / 20) * 0.1;
          s.life++;

          if (s.life >= s.maxLife || s.y < 0) {
            sparks[i] = createSpark();
          }
        }
      } 
      else if (themeId === 'cyber') {
        // Render perspective 3D road lines going into depth
        ctx.strokeStyle = 'rgba(0, 245, 255, 0.15)';
        ctx.lineWidth = 1.5;

        // Draw horizontal grid lines moving towards viewer
        cyberOffset = (cyberOffset + 1.5) % 40;
        const startY = height * 0.35; // horizon
        for (let y = startY; y < height; y += 40) {
          const currentY = y + cyberOffset;
          if (currentY > height) continue;
          
          // Exponential spacing to simulate 3D depth
          const ratio = (currentY - startY) / (height - startY);
          const drawY = startY + ratio * (height - startY);
          
          ctx.beginPath();
          ctx.moveTo(0, drawY);
          ctx.lineTo(width, drawY);
          ctx.stroke();
        }

        // Draw perspective lines meeting at vanishing point at horizon
        const vanishingX = width / 2;
        const vanishingY = height * 0.35;
        const lineCount = 10;
        for (let i = 0; i <= lineCount; i++) {
          const targetX = (width / lineCount) * i;
          ctx.beginPath();
          ctx.moveTo(vanishingX, vanishingY);
          ctx.lineTo(targetX, height);
          ctx.stroke();
        }
      } 
      else if (themeId === 'aurora') {
        // Draw elegant dancing auroral curtains using bezier paths
        auroraTime += 0.003;
        ctx.save();
        ctx.globalCompositeOperation = 'screen';

        const gradient = ctx.createLinearGradient(0, height * 0.1, 0, height * 0.5);
        gradient.addColorStop(0, 'rgba(16, 185, 129, 0)');
        gradient.addColorStop(0.5, 'rgba(16, 185, 129, 0.15)');
        gradient.addColorStop(0.8, 'rgba(6, 182, 212, 0.1)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = gradient;

        // Draw first wave
        ctx.beginPath();
        ctx.moveTo(0, height * 0.3);
        ctx.bezierCurveTo(
          width * 0.25, height * (0.2 + Math.sin(auroraTime) * 0.1),
          width * 0.75, height * (0.4 + Math.cos(auroraTime * 1.5) * 0.08),
          width, height * 0.25
        );
        ctx.lineTo(width, height * 0.5);
        ctx.bezierCurveTo(
          width * 0.75, height * (0.6 + Math.cos(auroraTime * 1.5) * 0.08),
          width * 0.25, height * (0.4 + Math.sin(auroraTime) * 0.1),
          0, height * 0.5
        );
        ctx.closePath();
        ctx.fill();

        // Draw second wave with different speed
        const gradient2 = ctx.createLinearGradient(0, height * 0.15, 0, height * 0.45);
        gradient2.addColorStop(0, 'rgba(99, 102, 241, 0)');
        gradient2.addColorStop(0.5, 'rgba(16, 185, 129, 0.1)');
        gradient2.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = gradient2;

        ctx.beginPath();
        ctx.moveTo(0, height * 0.25);
        ctx.bezierCurveTo(
          width * 0.3, height * (0.35 + Math.cos(auroraTime * 1.2) * 0.08),
          width * 0.6, height * (0.2 + Math.sin(auroraTime * 0.8) * 0.1),
          width, height * 0.35
        );
        ctx.lineTo(width, height * 0.45);
        ctx.bezierCurveTo(
          width * 0.6, height * (0.3 + Math.sin(auroraTime * 0.8) * 0.1),
          width * 0.3, height * (0.45 + Math.cos(auroraTime * 1.2) * 0.08),
          0, height * 0.35
        );
        ctx.closePath();
        ctx.fill();

        ctx.restore();
      }
      else if (themeId === 'glassy') {
        // Draw elegant floating modern tech glassy light blobs (matching Image 1)
        glassyTime += 0.0015;
        ctx.save();
        
        // Circular soft blue glow at top right
        const bx1 = width * 0.75 + Math.sin(glassyTime) * width * 0.15;
        const by1 = height * 0.15 + Math.cos(glassyTime * 1.2) * height * 0.04;
        const br1 = width * 0.6;
        
        const g1 = ctx.createRadialGradient(bx1, by1, 10, bx1, by1, br1);
        g1.addColorStop(0, 'rgba(56, 189, 248, 0.18)'); // Sky blue light
        g1.addColorStop(0.4, 'rgba(168, 85, 247, 0.06)'); // Soft violet
        g1.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.fillStyle = g1;
        ctx.beginPath();
        ctx.arc(bx1, by1, br1, 0, Math.PI * 2);
        ctx.fill();

        // Soft green/emerald glow at middle-left
        const bx2 = width * 0.15 + Math.cos(glassyTime * 0.7) * width * 0.1;
        const by2 = height * 0.35 + Math.sin(glassyTime * 1.1) * height * 0.06;
        const br2 = width * 0.65;
        
        const g2 = ctx.createRadialGradient(bx2, by2, 10, bx2, by2, br2);
        g2.addColorStop(0, 'rgba(52, 211, 153, 0.13)'); // Soft emerald-mint
        g2.addColorStop(0.5, 'rgba(14, 165, 233, 0.04)'); // Soft light blue
        g2.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.fillStyle = g2;
        ctx.beginPath();
        ctx.arc(bx2, by2, br2, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }
      else if (themeId === 'frosted') {
        // High-end frosted glass backdrop rendering with deep blue and purple floating nebula spots
        frostedTime += 0.002;
        ctx.save();
        
        // Dark indigo/night base fill
        ctx.fillStyle = '#0E0B1E';
        ctx.fillRect(0, 0, width, height);

        ctx.globalCompositeOperation = 'screen';

        // Glowing Blob 1: Deep Nebula Purple
        const px1 = width * 0.3 + Math.sin(frostedTime) * width * 0.2;
        const py1 = height * 0.25 + Math.cos(frostedTime * 0.8) * height * 0.1;
        const pr1 = Math.min(width, height) * 0.7;

        const pg1 = ctx.createRadialGradient(px1, py1, 0, px1, py1, pr1);
        pg1.addColorStop(0, 'rgba(147, 51, 234, 0.28)'); // Intense purple
        pg1.addColorStop(0.5, 'rgba(124, 58, 237, 0.12)'); // Deep lavender
        pg1.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = pg1;
        ctx.beginPath();
        ctx.arc(px1, py1, pr1, 0, Math.PI * 2);
        ctx.fill();

        // Glowing Blob 2: Glacier Ice Blue
        const px2 = width * 0.75 + Math.cos(frostedTime * 1.1) * width * 0.15;
        const py2 = height * 0.6 + Math.sin(frostedTime * 0.9) * height * 0.15;
        const pr2 = Math.min(width, height) * 0.8;

        const pg2 = ctx.createRadialGradient(px2, py2, 0, px2, py2, pr2);
        pg2.addColorStop(0, 'rgba(56, 189, 248, 0.24)'); // Vibrant sky/ice blue
        pg2.addColorStop(0.5, 'rgba(99, 102, 241, 0.10)'); // Soft indigo
        pg2.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = pg2;
        ctx.beginPath();
        ctx.arc(px2, py2, pr2, 0, Math.PI * 2);
        ctx.fill();

        // Glowing Blob 3: Royal Violet / Indigo (middle ground)
        const px3 = width * 0.5 + Math.sin(frostedTime * 0.5) * width * 0.1;
        const py3 = height * 0.45 + Math.cos(frostedTime * 0.7) * height * 0.08;
        const pr3 = Math.min(width, height) * 0.6;

        const pg3 = ctx.createRadialGradient(px3, py3, 0, px3, py3, pr3);
        pg3.addColorStop(0, 'rgba(139, 92, 246, 0.2)'); // Violet glow
        pg3.addColorStop(0.6, 'rgba(168, 85, 247, 0.05)');
        pg3.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = pg3;
        ctx.beginPath();
        ctx.arc(px3, py3, pr3, 0, Math.PI * 2);
        ctx.fill();

        // Drifting Glassy Dust Particles
        ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
        for (let i = 0; i < 15; i++) {
          const dx = (Math.sin(frostedTime * 0.3 + i) * 0.5 + 0.5) * width;
          const dy = ((frostedTime * 25 + i * 50) % (height + 40)) - 20;
          ctx.beginPath();
          ctx.arc(dx, height - dy, 1 + (i % 2), 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }
      else if (themeId === 'midnight') {
        // Deep serene obsidian starlight sky
        ctx.save();
        ctx.fillStyle = '#0C0E14';
        ctx.fillRect(0, 0, width, height);

        // Very subtle faint starlight glow in top-right
        const moonGrad = ctx.createRadialGradient(width * 0.85, height * 0.12, 0, width * 0.85, height * 0.12, width * 0.55);
        moonGrad.addColorStop(0, 'rgba(56, 189, 248, 0.05)');
        moonGrad.addColorStop(0.5, 'rgba(30, 41, 59, 0.03)');
        moonGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = moonGrad;
        ctx.fillRect(0, 0, width, height);

        // Render delicate twinkling stars
        for (let i = 0; i < midnightStars.length; i++) {
          const star = midnightStars[i];
          star.phase += star.pulseSpeed;
          const currentAlpha = 0.12 + (Math.sin(star.phase) * 0.5 + 0.5) * star.alpha;
          
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(226, 232, 240, ${currentAlpha})`;
          ctx.fill();

          // Subtle cross sparkle for key stars
          if (star.r > 1.3 && currentAlpha > 0.4) {
            ctx.strokeStyle = `rgba(56, 189, 248, ${currentAlpha * 0.5})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(star.x - star.r * 2.2, star.y);
            ctx.lineTo(star.x + star.r * 2.2, star.y);
            ctx.moveTo(star.x, star.y - star.r * 2.2);
            ctx.lineTo(star.x, star.y + star.r * 2.2);
            ctx.stroke();
          }
        }
        ctx.restore();
      }
      else if (themeId === 'ivory') {
        // Exquisite paper texture feel (matching Image 2)
        // Let's render extremely subtle diagonal fine lines to mimic fine-grained parchment/ivory paper
        ctx.strokeStyle = 'rgba(28, 25, 23, 0.015)';
        ctx.lineWidth = 0.5;
        for (let i = -height; i < width; i += 160) {
          ctx.beginPath();
          ctx.moveTo(i, 0);
          ctx.lineTo(i + height, height);
          ctx.stroke();
        }
      }
      else if (themeId === 'copenhagen') {
        // Nordic minimal dot grid background (matching Image 3)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.025)';
        const dotSpacing = 28;
        for (let x = dotSpacing / 2; x < width; x += dotSpacing) {
          for (let y = dotSpacing / 2; y < height; y += dotSpacing) {
            ctx.beginPath();
            ctx.arc(x, y, 0.8, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
      else if (themeId === 'newspaper') {
        // Render physical vintage newspaper details:
        
        // 1. Fill base warm newsprint paper color
        ctx.fillStyle = '#F4ECE1';
        ctx.fillRect(0, 0, width, height);

        // Define a stable, deterministic pseudo-random number generator so paper fibers & stains remain static
        let seed = 98765;
        const psRandom = () => {
          const x = Math.sin(seed++) * 10000;
          return x - Math.floor(x);
        };

        // 2. High-density paper pulp micro-pores and speckle noise (tactile coarse grain)
        ctx.fillStyle = 'rgba(27, 25, 23, 0.035)';
        for (let i = 0; i < 2500; i++) {
          const px = psRandom() * width;
          const py = psRandom() * height;
          const size = psRandom() * 1.5 + 0.3; // tiny grains
          ctx.fillRect(px, py, size, size);
        }

        // 3. Stationary organic wood pulp fibers
        ctx.strokeStyle = 'rgba(27, 25, 23, 0.06)';
        ctx.lineWidth = 0.5;
        for (let i = 0; i < 280; i++) {
          const fx = psRandom() * width;
          const fy = psRandom() * height;
          const fiberLength = psRandom() * 12 + 4;
          const angle = psRandom() * Math.PI * 2;
          const curveX = psRandom() * 6 - 3;
          
          ctx.beginPath();
          ctx.moveTo(fx, fy);
          ctx.quadraticCurveTo(
            fx + Math.cos(angle) * (fiberLength / 2) + curveX,
            fy + Math.sin(angle) * (fiberLength / 2) + curveX,
            fx + Math.cos(angle) * fiberLength,
            fy + Math.sin(angle) * fiberLength
          );
          ctx.stroke();
        }

        // 4. Vintage discolored age spots / coffee stains / watermarks (radial gradients)
        for (let i = 0; i < 12; i++) {
          const sx = psRandom() * width;
          const sy = psRandom() * height;
          const radius = psRandom() * 150 + 40;
          const intensity = psRandom() * 0.035 + 0.01;
          
          const stainGrad = ctx.createRadialGradient(sx, sy, 0, sx, sy, radius);
          stainGrad.addColorStop(0, `rgba(139, 90, 43, ${intensity})`); // faint organic stain
          stainGrad.addColorStop(0.5, `rgba(139, 90, 43, ${intensity * 0.4})`);
          stainGrad.addColorStop(1, 'rgba(0,0,0,0)');
          
          ctx.fillStyle = stainGrad;
          ctx.beginPath();
          ctx.arc(sx, sy, radius, 0, Math.PI * 2);
          ctx.fill();
        }

        // 5. Ink splatter droplets (larger vintage print imperfections)
        ctx.fillStyle = 'rgba(27, 25, 23, 0.07)';
        for (let i = 0; i < 25; i++) {
          const ix = psRandom() * width;
          const iy = psRandom() * height;
          const radius = psRandom() * 1.5 + 0.5;
          ctx.beginPath();
          ctx.arc(ix, iy, radius, 0, Math.PI * 2);
          ctx.fill();
        }

        // 6. Vintage division layout columns (understated editorial guideline grid)
        ctx.strokeStyle = 'rgba(27, 25, 23, 0.03)';
        ctx.lineWidth = 1;
        
        // Left column rule
        ctx.beginPath();
        ctx.moveTo(width * 0.28, 0);
        ctx.lineTo(width * 0.28, height);
        ctx.stroke();

        // Right column rule
        ctx.beginPath();
        ctx.moveTo(width * 0.72, 0);
        ctx.lineTo(width * 0.72, height);
        ctx.stroke();

        // 7. Tactile horizontal folded crease depth shadow!
        const creaseY = height * 0.42; // standard fold line
        const gCrease = ctx.createLinearGradient(0, creaseY - 35, 0, creaseY + 35);
        gCrease.addColorStop(0, 'rgba(0,0,0,0)');
        gCrease.addColorStop(0.48, 'rgba(27, 25, 23, 0.06)'); // shadowed crease fold
        gCrease.addColorStop(0.5, 'rgba(255, 255, 255, 0.04)'); // lit fold ridge
        gCrease.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = gCrease;
        ctx.fillRect(0, 0, width, height);
      }

      // RENDER SNOW FOR SPECIFIED THEMES (GLACIAL & DARK THEMES)
      const renderSnow = themeId === 'glacial' || ['midnight', 'aurora', 'cyber', 'frosted'].includes(themeId);
      if (renderSnow) {
        let snowColor = 'rgba(255, 255, 255, 0.8)';
        if (themeId === 'midnight') {
          snowColor = 'rgba(224, 242, 254, 0.42)'; // Soft starlight blue snow
        } else if (themeId === 'aurora') {
          snowColor = 'rgba(167, 243, 208, 0.42)'; // Soft pale mint-green auroral snow
        } else if (themeId === 'cyber') {
          snowColor = 'rgba(0, 245, 255, 0.38)';   // Soft glowing neon-cyan cyber snow
        } else if (themeId === 'frosted') {
          snowColor = 'rgba(243, 232, 255, 0.38)';  // Faint lavender-tinted winter snow
        }

        ctx.fillStyle = snowColor;
        for (let i = 0; i < snowflakes.length; i++) {
          const f = snowflakes[i];
          ctx.beginPath();
          ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2, true);
          ctx.fill();

          // Move the snow
          f.y += f.speed;
          f.x += f.drift + Math.sin(f.y / 30) * 0.2;

          // Reset if it goes out of screen
          if (f.y > height) {
            f.y = -10;
            f.x = Math.random() * width;
          }
          if (f.x > width) f.x = 0;
          else if (f.x < 0) f.x = width;
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [themeId]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0"
      style={{ mixBlendMode: themeId === 'aurora' ? 'screen' : 'normal' }}
    />
  );
}
