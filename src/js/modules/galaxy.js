import { Renderer, Triangle, Program, Vec3, Mesh } from 'https://cdn.jsdelivr.net/npm/ogl@1.0.11/+esm';

export class Galaxy {
  constructor(container, options = {}) {
    if (!container) {
      console.error('Galaxy: Container element is required');
      return;
    }

    this.container = container;
    this.options = {
      triggerElement: container, // Element to catch mouse events on
      starSpeed: 0.5,
      density: 1,
      hueShift: 140,
      disableAnimation: false,
      speed: 1.0,
      mouseInteraction: true,
      glowIntensity: 0.3,
      saturation: 0.0,
      mouseRepulsion: true,
      twinkleIntensity: 0.3,
      rotationSpeed: 0.1,
      repulsionStrength: 2,
      autoCenterRepulsion: 0,
      transparent: true,
      focal: [0.5, 0.5],
      rotation: [1.0, 0.0],
      ...options
    };

    this.renderer = null;
    this.program = null;
    this.mesh = null;
    this.rafId = null;
    this.resizeHandler = null;
    this.intersectionObserver = null;

    this.targetMousePos = { x: 0.5, y: 0.5 };
    this.smoothMousePos = { x: 0.5, y: 0.5 };
    this.targetMouseActive = 0.0;
    this.smoothMouseActive = 0.0;

    this.onPointerMove = null;
    this.onPointerLeave = null;

    this.vertexShader = `
      attribute vec2 uv;
      attribute vec2 position;

      varying vec2 vUv;

      void main() {
        vUv = uv;
        gl_Position = vec4(position, 0, 1);
      }
    `;

    this.fragmentShader = `
      precision highp float;

      uniform float uTime;
      uniform vec3 uResolution;
      uniform vec2 uFocal;
      uniform vec2 uRotation;
      uniform float uStarSpeed;
      uniform float uDensity;
      uniform float uHueShift;
      uniform float uSpeed;
      uniform vec2 uMouse;
      uniform float uGlowIntensity;
      uniform float uSaturation;
      uniform bool uMouseRepulsion;
      uniform float uTwinkleIntensity;
      uniform float uRotationSpeed;
      uniform float uRepulsionStrength;
      uniform float uMouseActiveFactor;
      uniform float uAutoCenterRepulsion;
      uniform bool uTransparent;

      varying vec2 vUv;

      #define NUM_LAYER 4.0
      #define STAR_COLOR_CUTOFF 0.2
      #define MAT45 mat2(0.7071, -0.7071, 0.7071, 0.7071)
      #define PERIOD 3.0

      float Hash21(vec2 p) {
        p = fract(p * vec2(123.34, 456.21));
        p += dot(p, p + 45.32);
        return fract(p.x * p.y);
      }

      float tri(float x) {
        return abs(fract(x) * 2.0 - 1.0);
      }

      float tris(float x) {
        float t = fract(x);
        return 1.0 - smoothstep(0.0, 1.0, abs(2.0 * t - 1.0));
      }

      float trisn(float x) {
        float t = fract(x);
        return 2.0 * (1.0 - smoothstep(0.0, 1.0, abs(2.0 * t - 1.0))) - 1.0;
      }

      vec3 hsv2rgb(vec3 c) {
        vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
        vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
        return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
      }

      float Star(vec2 uv, float flare) {
        float d = length(uv);
        float m = (0.05 * uGlowIntensity) / d;
        float rays = smoothstep(0.0, 1.0, 1.0 - abs(uv.x * uv.y * 1000.0));
        m += rays * flare * uGlowIntensity;
        uv *= MAT45;
        rays = smoothstep(0.0, 1.0, 1.0 - abs(uv.x * uv.y * 1000.0));
        m += rays * 0.3 * flare * uGlowIntensity;
        m *= smoothstep(1.0, 0.2, d);
        return m;
      }

      vec3 StarLayer(vec2 uv) {
        vec3 col = vec3(0.0);

        vec2 gv = fract(uv) - 0.5;
        vec2 id = floor(uv);

        for (int y = -1; y <= 1; y++) {
          for (int x = -1; x <= 1; x++) {
            vec2 offset = vec2(float(x), float(y));
            vec2 si = id + vec2(float(x), float(y));
            float seed = Hash21(si);
            float size = fract(seed * 345.32);
            float glossLocal = tri(uStarSpeed / (PERIOD * seed + 1.0));
            float flareSize = smoothstep(0.9, 1.0, size) * glossLocal;

            float red = smoothstep(STAR_COLOR_CUTOFF, 1.0, Hash21(si + 1.0)) + STAR_COLOR_CUTOFF;
            float blu = smoothstep(STAR_COLOR_CUTOFF, 1.0, Hash21(si + 3.0)) + STAR_COLOR_CUTOFF;
            float grn = min(red, blu) * seed;
            vec3 base = vec3(red, grn, blu);

            float hue = atan(base.g - base.r, base.b - base.r) / (2.0 * 3.14159) + 0.5;
            hue = fract(hue + uHueShift / 360.0);
            float sat = length(base - vec3(dot(base, vec3(0.299, 0.587, 0.114)))) * uSaturation;
            float val = max(max(base.r, base.g), base.b);
            base = hsv2rgb(vec3(hue, sat, val));

            vec2 pad = vec2(tris(seed * 34.0 + uTime * uSpeed / 10.0), tris(seed * 38.0 + uTime * uSpeed / 30.0)) - 0.5;

            float star = Star(gv - offset - pad, flareSize);
            vec3 color = base;

            float twinkle = trisn(uTime * uSpeed + seed * 6.2831) * 0.5 + 1.0;
            twinkle = mix(1.0, twinkle, uTwinkleIntensity);
            star *= twinkle;

            col += star * size * color;
          }
        }

        return col;
      }

      void main() {
        vec2 focalPx = uFocal * uResolution.xy;
        vec2 uv = (vUv * uResolution.xy - focalPx) / uResolution.y;

        vec2 mouseNorm = uMouse - vec2(0.5);

        if (uAutoCenterRepulsion > 0.0) {
          vec2 centerUV = vec2(0.0, 0.0);
          float centerDist = length(uv - centerUV);
          vec2 repulsion = normalize(uv - centerUV) * (uAutoCenterRepulsion / (centerDist + 0.1));
          uv += repulsion * 0.05;
        } else if (uMouseRepulsion) {
          vec2 mousePosUV = (uMouse * uResolution.xy - focalPx) / uResolution.y;
          float mouseDist = length(uv - mousePosUV);
          vec2 repulsion = normalize(uv - mousePosUV) * (uRepulsionStrength / (mouseDist + 0.1));
          uv += repulsion * 0.05 * uMouseActiveFactor;
        } else {
          vec2 mouseOffset = mouseNorm * 0.1 * uMouseActiveFactor;
          uv += mouseOffset;
        }

        float autoRotAngle = uTime * uRotationSpeed;
        mat2 autoRot = mat2(cos(autoRotAngle), -sin(autoRotAngle), sin(autoRotAngle), cos(autoRotAngle));
        uv = autoRot * uv;

        uv = mat2(uRotation.x, -uRotation.y, uRotation.y, uRotation.x) * uv;

        vec3 col = vec3(0.0);

        for (float i = 0.0; i < 1.0; i += 1.0 / NUM_LAYER) {
          float depth = fract(i + uStarSpeed * uSpeed);
          float scale = mix(20.0 * uDensity, 0.5 * uDensity, depth);
          float fade = depth * smoothstep(1.0, 0.9, depth);
          col += StarLayer(uv * scale + i * 453.32) * fade;
        }

        if (uTransparent) {
          float alpha = length(col);
          alpha = smoothstep(0.0, 0.3, alpha);
          alpha = min(alpha, 1.0);
          gl_FragColor = vec4(col, alpha);
        } else {
          gl_FragColor = vec4(col, 1.0);
        }
      }
    `;

    this.setupIntersectionObserver();
  }

  setupIntersectionObserver() {
    if (typeof IntersectionObserver === 'undefined') {
      this.initAndStart();
      return;
    }

    this.intersectionObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        this.initAndStart();
      } else {
        this.stopAndCleanup();
      }
    }, { threshold: 0.05 });

    this.intersectionObserver.observe(this.options.triggerElement || this.container);
  }

  initAndStart() {
    this.stopAndCleanup();

    // Setup OGL Renderer
    try {
      this.renderer = new Renderer({
        alpha: this.options.transparent,
        premultipliedAlpha: false,
        antialias: true
      });
    } catch (e) {
      console.error('Galaxy: WebGL is not supported or initialization failed', e);
      return;
    }

    const gl = this.renderer.gl;

    if (this.options.transparent) {
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      gl.clearColor(0, 0, 0, 0);
    } else {
      gl.clearColor(0, 0, 0, 1);
    }

    // Clear and append canvas
    while (this.container.firstChild) {
      this.container.removeChild(this.container.firstChild);
    }
    this.container.appendChild(gl.canvas);

    const geometry = new Triangle(gl);
    this.program = new Program(gl, {
      vertex: this.vertexShader,
      fragment: this.fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new Vec3(gl.canvas.width, gl.canvas.height, gl.canvas.width / gl.canvas.height) },
        uFocal: { value: new Float32Array(this.options.focal) },
        uRotation: { value: new Float32Array(this.options.rotation) },
        uStarSpeed: { value: this.options.starSpeed },
        uDensity: { value: this.options.density },
        uHueShift: { value: this.options.hueShift },
        uSpeed: { value: this.options.speed },
        uMouse: { value: new Float32Array([this.smoothMousePos.x, this.smoothMousePos.y]) },
        uGlowIntensity: { value: this.options.glowIntensity },
        uSaturation: { value: this.options.saturation },
        uMouseRepulsion: { value: this.options.mouseRepulsion },
        uTwinkleIntensity: { value: this.options.twinkleIntensity },
        uRotationSpeed: { value: this.options.rotationSpeed },
        uRepulsionStrength: { value: this.options.repulsionStrength },
        uMouseActiveFactor: { value: 0.0 },
        uAutoCenterRepulsion: { value: this.options.autoCenterRepulsion },
        uTransparent: { value: this.options.transparent }
      }
    });

    this.mesh = new Mesh(gl, { geometry, program: this.program });

    const resize = () => {
      if (!this.renderer || !this.program) return;
      this.renderer.setSize(this.container.offsetWidth, this.container.offsetHeight);
      const w = gl.canvas.width;
      const h = gl.canvas.height;
      this.program.uniforms['uResolution'].value.set(w, h, w / h);
    };

    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => {
        resize();
      });
      this.resizeObserver.observe(this.container);
    } else {
      window.addEventListener('resize', resize, false);
      this.resizeHandler = () => window.removeEventListener('resize', resize);
    }
    resize();

    // Mouse events
    if (this.options.mouseInteraction) {
      const trigger = this.options.triggerElement || this.container;

      this.onPointerMove = (e) => {
        const rect = trigger.getBoundingClientRect();
        // Mouse coordinates normalized to container size
        const x = (e.clientX - rect.left) / rect.width;
        const y = 1.0 - (e.clientY - rect.top) / rect.height;
        this.targetMousePos = { x, y };
        this.targetMouseActive = 1.0;
      };

      this.onPointerLeave = () => {
        this.targetMouseActive = 0.0;
      };

      trigger.addEventListener('pointermove', this.onPointerMove, { passive: true });
      trigger.addEventListener('pointerleave', this.onPointerLeave, { passive: true });
      trigger.addEventListener('pointerdown', this.onPointerMove, { passive: true });
    }

    const loop = (t) => {
      this.rafId = requestAnimationFrame(loop);
      if (!this.renderer || !this.program || !this.mesh) return;

      if (!this.options.disableAnimation) {
        this.program.uniforms['uTime'].value = t * 0.001;
        this.program.uniforms['uStarSpeed'].value = (t * 0.001 * this.options.starSpeed) / 10.0;
      }

      const lerp = 0.05;
      this.smoothMousePos.x += (this.targetMousePos.x - this.smoothMousePos.x) * lerp;
      this.smoothMousePos.y += (this.targetMousePos.y - this.smoothMousePos.y) * lerp;
      this.smoothMouseActive += (this.targetMouseActive - this.smoothMouseActive) * lerp;

      this.program.uniforms['uMouse'].value[0] = this.smoothMousePos.x;
      this.program.uniforms['uMouse'].value[1] = this.smoothMousePos.y;
      this.program.uniforms['uMouseActiveFactor'].value = this.smoothMouseActive;

      try {
        this.renderer.render({ scene: this.mesh });
      } catch (err) {
        console.error('Galaxy: Render failed, stopping loop', err);
        if (this.rafId) {
          cancelAnimationFrame(this.rafId);
          this.rafId = null;
        }
      }
    };

    this.rafId = requestAnimationFrame(loop);
  }

  stopAndCleanup() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }

    const trigger = this.options.triggerElement || this.container;
    if (trigger) {
      if (this.onPointerMove) {
        trigger.removeEventListener('pointermove', this.onPointerMove);
        trigger.removeEventListener('pointerdown', this.onPointerMove);
      }
      if (this.onPointerLeave) {
        trigger.removeEventListener('pointerleave', this.onPointerLeave);
      }
    }

    this.onPointerMove = null;
    this.onPointerLeave = null;

    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }

    if (this.resizeHandler) {
      this.resizeHandler();
      this.resizeHandler = null;
    }

    if (this.renderer) {
      try {
        const lose = this.renderer.gl.getExtension('WEBGL_lose_context');
        lose?.loseContext();
        const canvas = this.renderer.gl.canvas;
        canvas?.parentNode?.removeChild(canvas);
      } catch (e) {
        // Ignored
      }
    }

    this.mesh = null;
    this.program = null;
    this.renderer = null;
  }

  destroy() {
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
      this.intersectionObserver = null;
    }
    this.stopAndCleanup();
  }
}
