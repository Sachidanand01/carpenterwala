"use client";

import React, { useEffect, useRef, useState } from "react";

/**
 * Feature flag options:
 * 1. Prop `enabled={true|false}`
 * 2. `process.env.NEXT_PUBLIC_ENABLE_IDLE_ANIMATION !== "false"`
 * 3. Browser localStorage: `localStorage.getItem("cw_disable_idle_cursor") !== "true"`
 * 4. Window global: `window.DISABLE_IDLE_CURSOR`
 */

export default function CursorConstruction({
  enabled = true,
  idleDelayMs = 2600, // 2.6 seconds of inactivity triggers the scene
}) {
  const canvasRef = useRef(null);
  const stateRef = useRef({
    active: false,
    phase: "idle", // 'idle' | 'running' | 'scatter'
    cursorX: 0,
    cursorY: 0,
    lastMoveTime: 0,
    startTime: 0,
    scatterStartTime: 0,
    workers: [],
    cursorParts: [],
    houseParts: [],
    particles: [],
    speechBubbles: [],
    smokePuffs: [],
    confetti: [],
    houseBuiltProgress: 0,
    isPainted: false,
    paintProgress: 0,
    roofProgress: 0,
    targetHousePos: { x: 0, y: 0 },
    rafId: null,
  });

  const [isCursorHidden, setIsCursorHidden] = useState(false);

  useEffect(() => {
    // Check if disabled by env flag or user preference
    const envEnabled = process.env.NEXT_PUBLIC_ENABLE_IDLE_ANIMATION !== "false";
    if (!enabled || !envEnabled) return;

    // Check prefers-reduced-motion
    if (typeof window !== "undefined") {
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReduced) return;
      if (localStorage.getItem("cw_disable_idle_cursor") === "true") return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      const dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    const state = stateRef.current;
    state.lastMoveTime = Date.now();

    // Standard arrow cursor polygon definition (20px standard arrow)
    const getInitialCursorSegments = (ox, oy) => [
      // 0: Left spine / blade
      { id: "blade", p1: { x: ox, y: oy }, p2: { x: ox, y: oy + 19 }, color: "#1e293b", width: 2.5, attached: true, currentX: ox, currentY: oy + 9.5, angle: Math.PI / 2, len: 19 },
      // 1: Hypotenuse / Right roof-pitch edge
      { id: "roof", p1: { x: ox, y: oy }, p2: { x: ox + 14, y: oy + 13 }, color: "#1e293b", width: 2.5, attached: true, currentX: ox + 7, currentY: oy + 6.5, angle: 0.75, len: 19.1 },
      // 2: Barb / Inner notch crossbar
      { id: "notch", p1: { x: ox + 14, y: oy + 13 }, p2: { x: ox + 9, y: oy + 13 }, color: "#1e293b", width: 2.5, attached: true, currentX: ox + 11.5, currentY: oy + 13, angle: 0, len: 5 },
      // 3: Stem Right
      { id: "stemR", p1: { x: ox + 9, y: oy + 13 }, p2: { x: ox + 12.5, y: oy + 21 }, color: "#1e293b", width: 2.5, attached: true, currentX: ox + 10.75, currentY: oy + 17, angle: 1.16, len: 8.7 },
      // 4: Stem Base Cap
      { id: "stemB", p1: { x: ox + 12.5, y: oy + 21 }, p2: { x: ox + 9.5, y: oy + 22.5 }, color: "#1e293b", width: 2.5, attached: true, currentX: ox + 11, currentY: oy + 21.75, angle: -0.46, len: 3.3 },
      // 5: Stem Left
      { id: "stemL", p1: { x: ox + 9.5, y: oy + 22.5 }, p2: { x: ox + 5.5, y: oy + 14 }, color: "#1e293b", width: 2.5, attached: true, currentX: ox + 7.5, currentY: oy + 18.25, angle: 1.13, len: 9.4 },
      // 6: Barb Left
      { id: "barbL", p1: { x: ox + 5.5, y: oy + 14 }, p2: { x: ox, y: oy + 19 }, color: "#1e293b", width: 2.5, attached: true, currentX: ox + 2.75, currentY: oy + 16.5, angle: -0.74, len: 7.4 }
    ];

    // Spawn 5 unique miniature construction workers from page edges
    const initWorkers = (targetX, targetY) => {
      const edges = [
        { x: -30, y: Math.min(height - 40, Math.max(40, targetY - 60)) },
        { x: width + 30, y: Math.min(height - 40, Math.max(40, targetY + 40)) },
        { x: Math.min(width - 40, Math.max(40, targetX - 100)), y: -30 },
        { x: Math.min(width - 40, Math.max(40, targetX + 80)), y: height + 30 },
        { x: -30, y: Math.min(height - 40, Math.max(40, targetY + 80)) },
      ];

      return [
        {
          id: "foreman",
          name: "Vikram (Foreman)",
          x: edges[0].x,
          y: edges[0].y,
          targetX: targetX - 38,
          targetY: targetY + 12,
          speed: 3.8,
          role: "foreman",
          hatColor: "#c2410c", // CarpenterWala Rust Red
          vestColor: "#fbbf24",
          skinColor: "#f59e0b",
          heldItem: "clipboard",
          state: "running",
          animFrame: 0,
          facing: 1,
        },
        {
          id: "carpenter1",
          name: "Ramesh (Carpenter)",
          x: edges[1].x,
          y: edges[1].y,
          targetX: targetX + 10,
          targetY: targetY - 4,
          speed: 4.2,
          role: "dismantler",
          targetPartIdx: 0,
          hatColor: "#eab308", // Yellow hard hat
          vestColor: "#ea580c",
          skinColor: "#d97706",
          heldItem: "wrench",
          state: "running",
          animFrame: 0,
          facing: -1,
        },
        {
          id: "carpenter2",
          name: "Suresh (Lifter)",
          x: edges[2].x,
          y: edges[2].y,
          targetX: targetX + 16,
          targetY: targetY + 16,
          speed: 3.6,
          role: "lifter",
          targetPartIdx: 1,
          hatColor: "#eab308",
          vestColor: "#16a34a",
          skinColor: "#f59e0b",
          heldItem: "crowbar",
          state: "running",
          animFrame: 0,
          facing: 1,
        },
        {
          id: "builder",
          name: "Anil (Mason)",
          x: edges[3].x,
          y: edges[3].y,
          targetX: targetX - 10,
          targetY: targetY + 24,
          speed: 4.0,
          role: "builder",
          targetPartIdx: 3,
          hatColor: "#eab308",
          vestColor: "#ea580c",
          skinColor: "#d97706",
          heldItem: "hammer",
          state: "running",
          animFrame: 0,
          facing: 1,
        },
        {
          id: "painter",
          name: "Kabir (Master Painter)",
          x: edges[4].x,
          y: edges[4].y,
          targetX: targetX + 48,
          targetY: targetY + 14,
          speed: 3.4,
          role: "painter",
          hatColor: "#f8fafc", // White painter cap
          vestColor: "#38bdf8",
          skinColor: "#f59e0b",
          heldItem: "roller",
          state: "running",
          animFrame: 0,
          facing: 1,
        },
      ];
    };

    // Calculate nice position for the house next to the cursor (ensure it doesn't clip offscreen)
    const calculateHouseTarget = (cx, cy) => {
      let hx = cx + 45;
      let hy = cy - 8;
      if (hx + 65 > width) {
        hx = cx - 65; // Place on left if close to right edge
      }
      if (hy + 60 > height) {
        hy = cy - 45;
      }
      if (hy < 30) hy = 30;
      return { x: hx, y: hy };
    };

    const startConstruction = () => {
      if (state.active) return;
      state.active = true;
      state.phase = "running";
      state.startTime = Date.now();
      state.houseBuiltProgress = 0;
      state.isPainted = false;
      state.paintProgress = 0;
      state.roofProgress = 0;
      state.particles = [];
      state.speechBubbles = [];
      state.smokePuffs = [];
      state.confetti = [];

      const cx = state.cursorX;
      const cy = state.cursorY;
      state.targetHousePos = calculateHouseTarget(cx, cy);
      state.cursorParts = getInitialCursorSegments(cx, cy);
      state.workers = initWorkers(cx, cy);

      // Hide default browser cursor temporarily while animation plays around the spot
      setIsCursorHidden(true);

      // Foreman gives an opening whistle!
      setTimeout(() => {
        if (state.phase === "running" && state.workers[0]) {
          addSpeechBubble(state.workers[0], "🏗️ Let's build!", 1600);
        }
      }, 700);
    };

    const scatterAndExit = () => {
      if (!state.active || state.phase === "scatter") return;
      state.phase = "scatter";
      state.scatterStartTime = Date.now();
      setIsCursorHidden(false); // Restore native mouse immediately

      // All workers shout in surprise and scramble away
      const panicWords = ["⚡ Whoa!", "🏃‍♂️ Move!", "🚨 Back to work!", "💨 Run!", "👷‍♂️ Yikes!"];
      state.workers.forEach((w, idx) => {
        w.state = "panic";
        // Pick nearest offscreen exit
        const exitLeft = w.x < width / 2;
        const exitTop = w.y < height / 2;
        w.targetX = exitLeft ? -60 : width + 60;
        w.targetY = exitTop ? -60 : height + 60;
        w.speed = 8 + Math.random() * 4;

        if (idx < panicWords.length) {
          addSpeechBubble(w, panicWords[idx], 900);
        }

        // Drop tiny dust particles
        for (let i = 0; i < 6; i++) {
          state.particles.push({
            x: w.x,
            y: w.y + 10,
            vx: (Math.random() - 0.5) * 4,
            vy: (Math.random() - 0.5) * 4,
            size: 2 + Math.random() * 3,
            color: "#e2e8f0",
            life: 1,
            decay: 0.05,
          });
        }
      });

      // House poofs into wood dust & sparks
      const hx = state.targetHousePos.x;
      const hy = state.targetHousePos.y;
      for (let i = 0; i < 20; i++) {
        state.particles.push({
          x: hx + Math.random() * 45,
          y: hy + Math.random() * 40,
          vx: (Math.random() - 0.5) * 6,
          vy: -Math.random() * 5 - 1,
          size: 2 + Math.random() * 4,
          color: Math.random() > 0.5 ? "#c2410c" : "#d97706",
          life: 1,
          decay: 0.04,
        });
      }
    };

    const resetState = () => {
      state.active = false;
      state.phase = "idle";
      setIsCursorHidden(false);
      if (ctx) ctx.clearRect(0, 0, width, height);
    };

    const addSpeechBubble = (worker, text, duration = 1400) => {
      if (!worker) return;
      state.speechBubbles.push({
        workerId: worker.id,
        text,
        expires: Date.now() + duration,
      });
    };

    // Listeners for mouse activity
    const onMouseMove = (e) => {
      state.lastMoveTime = Date.now();
      state.cursorX = e.clientX;
      state.cursorY = e.clientY;

      if (state.active) {
        scatterAndExit();
      }
    };

    const onUserInteraction = () => {
      state.lastMoveTime = Date.now();
      if (state.active) {
        scatterAndExit();
      }
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mousedown", onUserInteraction, { passive: true });
    window.addEventListener("keydown", onUserInteraction, { passive: true });
    window.addEventListener("scroll", onUserInteraction, { passive: true });
    window.addEventListener("touchstart", onUserInteraction, { passive: true });

    // ─────────────────────────────────────────────────────────────
    // CANVAS DRAWING & SIMULATION ENGINE (60 FPS)
    // ─────────────────────────────────────────────────────────────

    // Helper: Draw little cartoon human worker
    const drawWorker = (w, time) => {
      ctx.save();
      ctx.translate(w.x, w.y);
      if (w.facing === -1) {
        ctx.scale(-1, 1);
      }

      const isWalking = w.state === "running" || w.state === "carrying" || w.state === "panic";
      const legBob = isWalking ? Math.sin(time * 0.015 * (w.speed || 3)) * 4 : 0;
      const armBob = isWalking ? Math.cos(time * 0.015 * (w.speed || 3)) * 6 : 0;

      // Drop shadow
      ctx.beginPath();
      ctx.ellipse(0, 16, 6, 2.5, 0, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(15, 23, 42, 0.18)";
      ctx.fill();

      // Boots & Legs
      ctx.strokeStyle = "#1e3a8a"; // Blue jeans
      ctx.lineWidth = 3;
      ctx.lineCap = "round";

      // Left leg
      ctx.beginPath();
      ctx.moveTo(-2.5, 4);
      ctx.lineTo(-2.5 - legBob * 0.6, 14);
      ctx.stroke();

      // Right leg
      ctx.beginPath();
      ctx.moveTo(2.5, 4);
      ctx.lineTo(2.5 + legBob * 0.6, 14);
      ctx.stroke();

      // Tiny Boots
      ctx.fillStyle = "#78350f";
      ctx.fillRect(-4.5 - legBob * 0.6, 13, 3.5, 3);
      ctx.fillRect(1 + legBob * 0.6, 13, 3.5, 3);

      // Torso / Hi-vis Vest
      ctx.fillStyle = w.vestColor;
      ctx.beginPath();
      ctx.roundRect(-5, -4, 10, 9, 2);
      ctx.fill();

      // Hi-vis reflective silver stripe
      ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
      ctx.fillRect(-5, 0, 10, 2);

      // Belt
      ctx.fillStyle = "#451a03";
      ctx.fillRect(-5, 4, 10, 1.5);
      // Tool buckle
      ctx.fillStyle = "#fbbf24";
      ctx.fillRect(-1, 4, 2, 1.5);

      // Arms
      ctx.strokeStyle = w.vestColor;
      ctx.lineWidth = 2.5;

      if (w.state === "carrying") {
        // Arms lifted holding timber/beam above head
        ctx.beginPath();
        ctx.moveTo(-4, -1);
        ctx.lineTo(-6, -10);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(4, -1);
        ctx.lineTo(6, -10);
        ctx.stroke();
      } else if (w.state === "hammering") {
        const hammerStrike = Math.sin(time * 0.02) * 8;
        ctx.beginPath();
        ctx.moveTo(3, -1);
        ctx.lineTo(8, -4 - hammerStrike);
        ctx.stroke();

        // Tiny Hammer
        ctx.strokeStyle = "#94a3b8";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(8, -4 - hammerStrike);
        ctx.lineTo(12, -8 - hammerStrike);
        ctx.stroke();
        ctx.fillStyle = "#475569";
        ctx.fillRect(10, -11 - hammerStrike, 4, 3);
      } else if (w.state === "painting") {
        const rollOffset = Math.sin(time * 0.008) * 8;
        ctx.beginPath();
        ctx.moveTo(3, -1);
        ctx.lineTo(10, -2 + rollOffset);
        ctx.stroke();

        // Paint Roller Pole & Roller Head
        ctx.strokeStyle = "#94a3b8";
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(10, -2 + rollOffset);
        ctx.lineTo(14, -6 + rollOffset);
        ctx.stroke();
        // Fluffy orange roller head
        ctx.fillStyle = "#c2410c";
        ctx.fillRect(13, -11 + rollOffset, 3.5, 8);
      } else {
        // Walking swing arms
        ctx.beginPath();
        ctx.moveTo(-4, -1);
        ctx.lineTo(-6 + armBob * 0.6, 5);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(4, -1);
        ctx.lineTo(6 - armBob * 0.6, 5);
        ctx.stroke();
      }

      // Head
      ctx.fillStyle = w.skinColor;
      ctx.beginPath();
      ctx.arc(0, -8, 4.5, 0, Math.PI * 2);
      ctx.fill();

      // Face (Eyes & Smile)
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(1.5, -9, 1.2, 1.5); // Eye
      ctx.beginPath();
      ctx.arc(1.5, -7, 1.2, 0, Math.PI); // Smile
      ctx.stroke();

      // Hard Hat / Cap
      ctx.fillStyle = w.hatColor;
      ctx.beginPath();
      ctx.arc(0, -10, 5, Math.PI, 0, false);
      ctx.lineTo(6.5, -9);
      ctx.lineTo(-6.5, -9);
      ctx.closePath();
      ctx.fill();

      // Hat highlight / brim
      ctx.fillStyle = "rgba(255,255,255,0.4)";
      ctx.fillRect(-4, -13, 4, 1.5);

      ctx.restore();
    };

    // Helper: Draw cursor polygon or remaining attached lines
    const drawCursorModel = () => {
      const cx = state.cursorX;
      const cy = state.cursorY;

      // Draw shadow
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(cx + 1, cy + 2);
      ctx.lineTo(cx + 1, cy + 21);
      ctx.lineTo(cx + 6, cy + 16);
      ctx.lineTo(cx + 10, cy + 24.5);
      ctx.lineTo(cx + 13.5, cy + 23);
      ctx.lineTo(cx + 10, cy + 15);
      ctx.lineTo(cx + 15, cy + 15);
      ctx.closePath();
      ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
      ctx.fill();

      // Draw cursor parts that are still attached or floating
      state.cursorParts.forEach((part) => {
        if (part.attached) {
          ctx.strokeStyle = part.color;
          ctx.lineWidth = part.width;
          ctx.lineCap = "round";
          ctx.lineJoin = "round";
          ctx.beginPath();
          ctx.moveTo(part.p1.x, part.p1.y);
          ctx.lineTo(part.p2.x, part.p2.y);
          ctx.stroke();
        } else if (part.inTransit) {
          // Being carried by a worker
          ctx.save();
          ctx.translate(part.currentX, part.currentY);
          ctx.rotate(part.angle);
          ctx.fillStyle = "#d97706"; // warm golden wood beam
          ctx.strokeStyle = "#78350f";
          ctx.lineWidth = 1.5;
          ctx.fillRect(-part.len / 2, -2, part.len, 4);
          ctx.strokeRect(-part.len / 2, -2, part.len, 4);
          ctx.restore();
        }
      });

      // Arrow body white fill if mostly intact
      const attachedCount = state.cursorParts.filter((p) => p.attached).length;
      if (attachedCount >= 4) {
        ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
        ctx.beginPath();
        ctx.moveTo(cx + 1.5, cy + 2);
        ctx.lineTo(cx + 1.5, cy + 17);
        ctx.lineTo(cx + 5, cy + 13.5);
        ctx.lineTo(cx + 8.5, cy + 20.5);
        ctx.lineTo(cx + 10.5, cy + 19.5);
        ctx.lineTo(cx + 7.5, cy + 12.5);
        ctx.lineTo(cx + 12.5, cy + 12.5);
        ctx.closePath();
        ctx.fill();
      }

      ctx.restore();
    };

    // Helper: Draw the growing miniature house
    const drawMiniatureHouse = (time) => {
      const hx = state.targetHousePos.x;
      const hy = state.targetHousePos.y;
      const prog = state.houseBuiltProgress;
      if (prog <= 0.05) return;

      const houseW = 46;
      const houseH = 34;
      const wallProgress = Math.min(1, prog * 2.2);
      const roofProgress = Math.max(0, Math.min(1, (prog - 0.45) * 2.2));
      const detailsProgress = Math.max(0, Math.min(1, (prog - 0.75) * 4));

      ctx.save();
      ctx.translate(hx, hy);

      // Ground / Foundation beam
      ctx.fillStyle = "#78350f"; // Rich timber base
      ctx.fillRect(-2, houseH, houseW + 4, 3.5);

      // House Walls
      if (wallProgress > 0) {
        const curH = houseH * wallProgress;
        const startY = houseH - curH;

        // Base timber/linen wall color
        ctx.fillStyle = state.isPainted ? "#faf5ef" : "#e2d9cc";
        ctx.fillRect(0, startY, houseW, curH);

        // Vertical wood plank lines
        ctx.strokeStyle = state.isPainted ? "rgba(194, 65, 12, 0.15)" : "rgba(120, 53, 15, 0.2)";
        ctx.lineWidth = 1;
        for (let x = 7; x < houseW; x += 8) {
          ctx.beginPath();
          ctx.moveTo(x, startY);
          ctx.lineTo(x, houseH);
          ctx.stroke();
        }

        // Wall Border / Corner framing posts
        ctx.strokeStyle = state.isPainted ? "#c2410c" : "#92400e";
        ctx.lineWidth = 2;
        ctx.strokeRect(0, startY, houseW, curH);
      }

      // Door & Window (Details)
      if (detailsProgress > 0) {
        // Front Door
        const doorW = 12;
        const doorH = 18 * detailsProgress;
        ctx.fillStyle = state.isPainted ? "#c2410c" : "#78350f";
        ctx.fillRect(8, houseH - doorH, doorW, doorH);
        ctx.strokeStyle = "#451a03";
        ctx.lineWidth = 1;
        ctx.strokeRect(8, houseH - doorH, doorW, doorH);

        // Brass doorknob
        ctx.fillStyle = "#fbbf24";
        ctx.beginPath();
        ctx.arc(17, houseH - 9, 1.2, 0, Math.PI * 2);
        ctx.fill();

        // Cozy window
        ctx.fillStyle = "#bae6fd"; // Sky blue glass
        ctx.fillRect(26, houseH - 19, 13, 13);
        ctx.strokeStyle = "#0284c7";
        ctx.lineWidth = 1.2;
        ctx.strokeRect(26, houseH - 19, 13, 13);
        // Window 4-pane cross
        ctx.beginPath();
        ctx.moveTo(32.5, houseH - 19);
        ctx.lineTo(32.5, houseH - 6);
        ctx.moveTo(26, houseH - 12.5);
        ctx.lineTo(39, houseH - 12.5);
        ctx.stroke();

        // Warm light glow inside window
        ctx.fillStyle = "rgba(251, 191, 36, 0.25)";
        ctx.fillRect(27, houseH - 18, 11, 11);
      }

      // Peaked Roof (A-Frame)
      if (roofProgress > 0) {
        const roofPeakY = -15 * roofProgress;
        const roofPeakX = houseW / 2;

        ctx.beginPath();
        ctx.moveTo(-5, 0);
        ctx.lineTo(roofPeakX, roofPeakY);
        ctx.lineTo(houseW + 5, 0);
        ctx.closePath();

        // Roof color: Unpainted wood or vibrant CarpenterWala terracotta
        ctx.fillStyle = state.isPainted ? "#c2410c" : "#b45309";
        ctx.fill();

        // Roof shingle texture
        ctx.strokeStyle = state.isPainted ? "#9a3412" : "#78350f";
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Chimney
        if (detailsProgress > 0.4) {
          ctx.fillStyle = "#991b1b"; // Brick chimney
          ctx.fillRect(30, roofPeakY + 4, 7, 12);
          ctx.fillStyle = "#450a0a";
          ctx.fillRect(29, roofPeakY + 3, 9, 2.5); // Chimney cap
        }

        // Tiny Flag / CarpenterWala mini pennant on peak!
        if (detailsProgress >= 0.9) {
          ctx.strokeStyle = "#1e293b";
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(roofPeakX, roofPeakY);
          ctx.lineTo(roofPeakX, roofPeakY - 9);
          ctx.stroke();

          // Orange waving triangular flag
          const flagWave = Math.sin(time * 0.008) * 2;
          ctx.fillStyle = "#ea580c";
          ctx.beginPath();
          ctx.moveTo(roofPeakX, roofPeakY - 9);
          ctx.lineTo(roofPeakX + 8 + flagWave, roofPeakY - 6.5);
          ctx.lineTo(roofPeakX, roofPeakY - 4);
          ctx.closePath();
          ctx.fill();
        }
      }

      // Fresh paint drip / wet sheen sparkle
      if (state.isPainted && detailsProgress > 0.8) {
        const sparkle = Math.sin(time * 0.006) * 0.5 + 0.5;
        ctx.fillStyle = `rgba(255, 255, 255, ${sparkle * 0.7})`;
        ctx.beginPath();
        ctx.arc(10, 5, 1.5, 0, Math.PI * 2);
        ctx.arc(35, -5, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    };

    // Main animation loop
    const loop = (timestamp) => {
      state.rafId = requestAnimationFrame(loop);

      const now = Date.now();
      const idleTime = now - state.lastMoveTime;

      // 1. Idle Trigger Check
      if (!state.active && idleTime >= idleDelayMs) {
        startConstruction();
      }

      if (!state.active) return;

      // Clear Canvas
      ctx.clearRect(0, 0, width, height);

      const elapsed = (now - state.startTime) / 1000; // in seconds

      // ─────────────────────────────────────────────────────────────
      // TIMELINE / CHOREOGRAPHY
      // ─────────────────────────────────────────────────────────────

      // Phase A: Dismantling Cursor (0.8s - 3.2s)
      if (elapsed > 0.8 && elapsed < 3.2) {
        const dProg = (elapsed - 0.8) / 2.0;

        // Unbolt parts one by one
        state.cursorParts.forEach((part, idx) => {
          const triggerTime = idx * 0.28;
          if (dProg > triggerTime && part.attached) {
            part.attached = false;
            part.inTransit = true;

            // Sparkle / Wood dust puff
            for (let i = 0; i < 4; i++) {
              state.particles.push({
                x: part.currentX,
                y: part.currentY,
                vx: (Math.random() - 0.5) * 3,
                vy: (Math.random() - 0.5) * 3,
                size: 2,
                color: "#fbbf24",
                life: 1,
                decay: 0.06,
              });
            }
          }
        });
      }

      // Phase B: Assembling House (2.0s - 6.5s)
      if (elapsed > 2.0 && elapsed < 6.5) {
        const buildSpeed = (elapsed - 2.0) / 3.2;
        state.houseBuiltProgress = Math.min(1, buildSpeed);

        // Workers move parts towards house
        const hx = state.targetHousePos.x;
        const hy = state.targetHousePos.y;

        state.cursorParts.forEach((part, idx) => {
          if (part.inTransit) {
            const targetPartX = hx + 10 + (idx % 3) * 12;
            const targetPartY = hy + 10 + Math.floor(idx / 3) * 10;
            part.currentX += (targetPartX - part.currentX) * 0.08;
            part.currentY += (targetPartY - part.currentY) * 0.08;

            if (state.houseBuiltProgress > 0.8) {
              part.inTransit = false; // Absorbed into the house structure!
            }
          }
        });
      }

      // Phase C: Painting & Polish (5.2s - 7.5s)
      if (elapsed > 5.2 && !state.isPainted) {
        state.isPainted = true;
        addSpeechBubble(state.workers[4], "🎨 Fresh Paint!", 1600);

        // Confetti celebration
        const hx = state.targetHousePos.x;
        const hy = state.targetHousePos.y;
        for (let i = 0; i < 18; i++) {
          state.confetti.push({
            x: hx + 23,
            y: hy + 10,
            vx: (Math.random() - 0.5) * 5,
            vy: -Math.random() * 4 - 2,
            color: ["#c2410c", "#ea580c", "#fbbf24", "#16a34a", "#38bdf8"][Math.floor(Math.random() * 5)],
            size: 3 + Math.random() * 2,
            rot: Math.random() * Math.PI,
            vRot: 0.1,
            life: 1,
            decay: 0.02,
          });
        }
      }

      // Phase D: Chimney Smoke Puffs (6.0s+)
      if (elapsed > 6.0 && state.phase === "running") {
        if (Math.random() < 0.06) {
          const hx = state.targetHousePos.x;
          const hy = state.targetHousePos.y;
          state.smokePuffs.push({
            x: hx + 33.5,
            y: hy - 11,
            vx: (Math.random() - 0.5) * 0.3 + 0.4, // float gently right
            vy: -0.6 - Math.random() * 0.4,
            size: 2.5,
            alpha: 0.7,
          });
        }
      }

      // ─────────────────────────────────────────────────────────────
      // WORKER AI & POSITION UPDATE
      // ─────────────────────────────────────────────────────────────

      state.workers.forEach((w) => {
        if (state.phase === "scatter") {
          // Sprint away towards offscreen exit
          const dx = w.targetX - w.x;
          const dy = w.targetY - w.y;
          const dist = Math.hypot(dx, dy);
          if (dist > 5) {
            w.facing = dx > 0 ? 1 : -1;
            w.x += (dx / dist) * w.speed;
            w.y += (dy / dist) * w.speed;
          }
          return;
        }

        // Running / working phases
        const dx = w.targetX - w.x;
        const dy = w.targetY - w.y;
        const dist = Math.hypot(dx, dy);

        if (dist > 4) {
          w.facing = dx > 0 ? 1 : -1;
          w.x += (dx / dist) * Math.min(w.speed, dist);
          w.y += (dy / dist) * Math.min(w.speed, dist);
          w.state = "running";
        } else {
          // Arrived at work station!
          if (w.role === "builder" && state.houseBuiltProgress < 0.95) {
            w.state = "hammering";
            if (Math.random() < 0.05) {
              state.particles.push({
                x: w.x + 8,
                y: w.y - 4,
                vx: (Math.random() - 0.5) * 2,
                vy: -Math.random() * 2,
                size: 1.5,
                color: "#e2e8f0",
                life: 1,
                decay: 0.08,
              });
            }
          } else if (w.role === "painter" && state.isPainted) {
            w.state = "painting";
          } else if (w.role === "foreman") {
            w.state = "idle";
          } else {
            w.state = "idle";
          }
        }
      });

      // If all workers left screen in scatter mode, reset
      if (state.phase === "scatter") {
        const anyOnScreen = state.workers.some(
          (w) => w.x >= -50 && w.x <= width + 50 && w.y >= -50 && w.y <= height + 50
        );
        if (!anyOnScreen && (now - state.scatterStartTime > 1200)) {
          resetState();
          return;
        }
      }

      // ─────────────────────────────────────────────────────────────
      // RENDER SCENE ELEMENTS
      // ─────────────────────────────────────────────────────────────

      // 1. Draw remaining cursor parts
      if (state.phase !== "scatter" && state.houseBuiltProgress < 0.95) {
        drawCursorModel();
      }

      // 2. Draw House
      drawMiniatureHouse(timestamp);

      // 3. Draw Chimney Smoke
      state.smokePuffs.forEach((puff, idx) => {
        puff.x += puff.vx;
        puff.y += puff.vy;
        puff.size += 0.08;
        puff.alpha -= 0.008;

        ctx.fillStyle = `rgba(148, 163, 184, ${Math.max(0, puff.alpha)})`;
        ctx.beginPath();
        ctx.arc(puff.x, puff.y, puff.size, 0, Math.PI * 2);
        ctx.fill();

        if (puff.alpha <= 0) {
          state.smokePuffs.splice(idx, 1);
        }
      });

      // 4. Draw Workers
      state.workers.forEach((w) => {
        drawWorker(w, timestamp);
      });

      // 5. Particles (Dust & Sparks)
      state.particles.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= p.decay;

        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;

        if (p.life <= 0) {
          state.particles.splice(idx, 1);
        }
      });

      // 6. Confetti
      state.confetti.forEach((c, idx) => {
        c.x += c.vx;
        c.y += c.vy;
        c.vy += 0.1; // gravity
        c.rot += c.vRot;
        c.life -= c.decay;

        ctx.save();
        ctx.translate(c.x, c.y);
        ctx.rotate(c.rot);
        ctx.fillStyle = c.color;
        ctx.globalAlpha = Math.max(0, c.life);
        ctx.fillRect(-c.size / 2, -c.size / 2, c.size, c.size * 0.6);
        ctx.restore();
        ctx.globalAlpha = 1.0;

        if (c.life <= 0 || c.y > height + 20) {
          state.confetti.splice(idx, 1);
        }
      });

      // 7. Speech Bubbles
      state.speechBubbles.forEach((sb, idx) => {
        if (now > sb.expires) {
          state.speechBubbles.splice(idx, 1);
          return;
        }

        const worker = state.workers.find((w) => w.id === sb.workerId);
        if (!worker) return;

        ctx.save();
        ctx.font = "bold 11px system-ui, -apple-system, sans-serif";
        const textMetrics = ctx.measureText(sb.text);
        const bw = textMetrics.width + 12;
        const bh = 20;
        const bx = worker.x - bw / 2;
        const by = worker.y - 30;

        // Bubble background
        ctx.fillStyle = "rgba(15, 23, 42, 0.9)";
        ctx.beginPath();
        ctx.roundRect(bx, by, bw, bh, 6);
        ctx.fill();

        // Bubble pointer beak
        ctx.beginPath();
        ctx.moveTo(worker.x - 3, by + bh);
        ctx.lineTo(worker.x + 3, by + bh);
        ctx.lineTo(worker.x, by + bh + 4);
        ctx.closePath();
        ctx.fill();

        // Text
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(sb.text, worker.x, by + bh / 2);
        ctx.restore();
      });
    };

    state.rafId = requestAnimationFrame(loop);

    return () => {
      if (state.rafId) cancelAnimationFrame(state.rafId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onUserInteraction);
      window.removeEventListener("keydown", onUserInteraction);
      window.removeEventListener("scroll", onUserInteraction);
      window.removeEventListener("touchstart", onUserInteraction);
    };
  }, [enabled, idleDelayMs]);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="idle-construction-canvas"
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 99999,
          display: "block",
        }}
        aria-hidden="true"
      />
      {isCursorHidden && (
        <style jsx global>{`
          body,
          body * {
            cursor: none !important;
          }
        `}</style>
      )}
    </>
  );
}
