import * as THREE from "three";
import TextRing from "@/lib/three/TextRing";

const TEXT_COLOR = 0xffffff;
const TEXT_SIZE = 0.008;
const DEFAULT_TITLES = [
  "Creative",
  "Developer",
  "Interaction",
  "WebGL",
  "ThreeJS",
  "Experience",
];

const SCROLL_LERP = 0.05;
const SPEED_MULTIPLIER = 0.004;
const FONT_SIZE_PX = 60;
const LINE_HEIGHT_PX = 56;
const LETTER_SPACING_PX = -1.2;
const TEXT_RADIUS_RATIO = 0.18;
const MOBILE_BREAKPOINT = 768;
const DEFAULT_MOBILE_OFFSET_PX = 90; // shift carousel left by this many screen pixels on mobile

export default class HomeServicesSketch {
  constructor(container, options = {}) {
    if (!container) {
      throw new Error("HomeServicesSketch requires a container element");
    }

    this.container = container;
    this.titles =
      options.titles && options.titles.length ? options.titles : DEFAULT_TITLES;
    this.onIndexChange =
      typeof options.onIndexChange === "function"
        ? options.onIndexChange
        : null;
    this.repeatCount = Math.max(1, options.repeat ?? 1);
    this.renderTitles = this.buildRenderTitles();
    this.scene = new THREE.Scene();
    this.width = this.container.clientWidth;
    this.height = this.container.clientHeight;
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(this.width, this.height);
    this.container.appendChild(this.renderer.domElement);

    const pr = this.renderer.getPixelRatio();
    this.renderTarget = new THREE.WebGLRenderTarget(
      this.width * pr,
      this.height * pr,
      {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat,
      },
    );
    this.postScene = new THREE.Scene();
    this.postCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    this.postMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTexture: { value: this.renderTarget.texture },
        uResolution: {
          value: new THREE.Vector2(this.width * pr, this.height * pr),
        },
        uBlurStrength: { value: 1.0 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        precision highp float;
        uniform sampler2D uTexture;
        uniform vec2 uResolution;
        uniform float uBlurStrength;
        varying vec2 vUv;

        void main() {
          float yOffset = abs(vUv.y - 0.5);
          // float blurMask = smoothstep(0.04, 0.5, yOffset);
          float blurMask = abs(2.*atan(vUv.x,vUv.y-0.5)/3.14 - 1.);
          // blurMask = clamp(0.,1.,atan(vUv.x,vUv.y-0.5));
          float blurPx =  blurMask* uBlurStrength * 4.0;

          // if (blurPx <= 0.5) {
          //   gl_FragColor = texture2D(uTexture, vUv);
          //   return;
          // }

          vec2 texel = 1.0 / uResolution;
          vec2 step_ = texel * (blurPx / 4.0);

          vec3 colorSum = vec3(0.0);
          float alphaSum = 0.0;
          float weightSum = 0.0;
          for (int i = -4; i <= 4; i++) {
            for (int j = -4; j <= 4; j++) {
              float d2 = float(i * i + j * j);
              float w = exp(-d2 / 12.5);
              vec4 s = texture2D(uTexture, vUv + step_ * vec2(float(i), float(j)));
              colorSum += s.rgb * w;
              alphaSum += s.a * w;
              weightSum += w;
            }
          }
          float alpha = alphaSum / weightSum;
          vec3 rgb = alphaSum > 0.0 ? colorSum / alphaSum : vec3(0.0);
          gl_FragColor = vec4(rgb, alpha);
          // gl_FragColor = vec4(vec3(blurMask), 1.);
        }
      `,
      transparent: true,
    });
    this.postQuad = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      this.postMaterial,
    );
    this.postScene.add(this.postQuad);

    this.camera = new THREE.PerspectiveCamera(
      70,
      this.width / this.height,
      0.1,
      100
    );
    this.camera.position.set(0, 0, 2);
    this.updateSceneOffset = this.updateSceneOffset.bind(this);
    this.updateViewSize = this.updateViewSize.bind(this);
    this.updateViewSize();
    this.updateSceneOffset();

    this.scroll = { y: 0 };
    this.scrollTarget = 0;
    this.currentScroll = 0;
    this.currentIndex = 0;
    this.rotationIndex = 0;
    this.time = 0;
    this.isPlaying = true;
    this.texts = [];
    this.rafId = null;
    this.render = this.render.bind(this);

    this.handleResize = this.resize.bind(this);

    // Mobile-only extra left offset (in screen pixels)
    this.mobileOffsetPx =
      typeof options.mobileOffsetPx === "number"
        ? options.mobileOffsetPx
        : DEFAULT_MOBILE_OFFSET_PX;

    this.initTexts();
    this.resize();
    this.start();
    this.setupEvents();

    // Notify initial index
    this.emitIndexChange();
  }

  initTexts() {
    const titles = this.renderTitles;
    const length = titles.length;
    const sizePayload = this.getSizePayload();
    this.texts = titles.map((title, index) => {
      return new TextRing({
        element: { title },
        scene: this.scene,
        sizes: sizePayload,
        index,
        length,
        circleSpeed: 0.01,
        amplitude: 0.5,
        color: new THREE.Color(TEXT_COLOR),
        fontSize: TEXT_SIZE,
        fontSizePx: FONT_SIZE_PX,
        lineHeightPx: LINE_HEIGHT_PX,
        letterSpacingPx: LETTER_SPACING_PX,
        radiusRatio: TEXT_RADIUS_RATIO,
        mobileRadiusRatio: 0.5,
      });
    });
  }

  buildRenderTitles() {
    return Array.from({ length: this.repeatCount }, () => this.titles)
      .flat()
      .map((title) => title);
  }

  setupEvents() {
    window.addEventListener("resize", this.handleResize);
  }

  removeEvents() {
    window.removeEventListener("resize", this.handleResize);
  }

  goTo(index) {
    if (!this.texts.length) return;
    const length = this.texts.length;
    const normalizedIndex = ((index % length) + length) % length;
    const wrappedCurrent = ((this.rotationIndex % length) + length) % length;
    let delta = normalizedIndex - wrappedCurrent;
    if (delta > length / 2) {
      delta -= length;
    } else if (delta < -length / 2) {
      delta += length;
    }

    this.rotationIndex += delta;
    this.currentIndex = normalizedIndex;

    const angle = ((Math.PI * 2) / length) * this.rotationIndex;
    this.scrollTarget = angle;
    this.emitIndexChange();
  }

  next() {
    this.goTo(this.currentIndex + 1);
  }

  prev() {
    this.goTo(this.currentIndex - 1);
  }

  resize() {
    this.width = this.container.clientWidth || 1;
    this.height = this.container.clientHeight || 1;

    this.renderer.setSize(this.width, this.height);
    const pr = this.renderer.getPixelRatio();
    if (this.renderTarget) {
      this.renderTarget.setSize(this.width * pr, this.height * pr);
    }
    if (this.postMaterial) {
      this.postMaterial.uniforms.uResolution.value.set(
        this.width * pr,
        this.height * pr,
      );
    }
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
    this.updateViewSize();
    this.updateSceneOffset();

    const sizePayload = this.getSizePayload();
    this.texts.forEach((text) => {
      text.onResize(sizePayload);
    });
  }

  updateSceneOffset() {
    if (!this.camera) return;
    const halfWidth = (this.viewWidth ?? 0) / 2;
    // Base align scene to the left edge
    let offsetX = -halfWidth;
    // On mobile, nudge entire carousel further left by mobileOffsetPx
    if (
      this.width > 0 &&
      this.width < MOBILE_BREAKPOINT &&
      this.mobileOffsetPx > 0
    ) {
      const worldUnitsPerPixel =
        (this.viewWidth ?? 0) / Math.max(this.width, 1);
      offsetX -= this.mobileOffsetPx * worldUnitsPerPixel;
    }
    this.scene.position.x = offsetX;
  }

  updateViewSize() {
    if (!this.camera) {
      this.viewHeight = 2;
      this.viewWidth = 2;
      return;
    }
    const halfHeight =
      this.camera.position.z *
      Math.tan(THREE.MathUtils.degToRad(this.camera.fov) / 2);
    this.viewHeight = halfHeight * 2;
    this.viewWidth = this.viewHeight * this.camera.aspect;
  }

  getSizePayload() {
    return {
      width: this.width,
      height: this.height,
      viewHeight: this.viewHeight,
      viewWidth: this.viewWidth,
    };
  }

  start() {
    if (!this.isPlaying) {
      this.isPlaying = true;
    }
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.render();
  }

  render() {
    if (!this.isPlaying) return;

    this.time += 0.05;
    this.currentScroll +=
      (this.scrollTarget - this.currentScroll) * SCROLL_LERP;
    this.scroll.y = this.currentScroll;

    const speed = (this.scrollTarget - this.currentScroll) * SPEED_MULTIPLIER;

    this.texts.forEach((text) => {
      text.update(this.scroll, speed, 0.5);
    });

    this.renderer.setRenderTarget(this.renderTarget);
    this.renderer.clear();
    this.renderer.render(this.scene, this.camera);

    this.renderer.setRenderTarget(null);
    this.renderer.clear();
    this.renderer.render(this.postScene, this.postCamera);

    this.rafId = requestAnimationFrame(this.render);
  }

  dispose() {
    this.isPlaying = false;
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.removeEvents();

    this.texts.forEach((text) => text.dispose());
    this.texts = [];

    if (this.renderTarget) {
      this.renderTarget.dispose();
    }
    if (this.postQuad) {
      this.postQuad.geometry.dispose();
    }
    if (this.postMaterial) {
      this.postMaterial.dispose();
    }

    if (this.renderer) {
      this.renderer.dispose();
      this.renderer.forceContextLoss?.();
      this.renderer.domElement.remove();
    }
  }

  emitIndexChange() {
    if (!this.onIndexChange) return;
    const baseLength = this.titles.length || 1;
    const displayedIndex =
      ((this.currentIndex % baseLength) + baseLength) % baseLength; // 0-based
    this.onIndexChange(displayedIndex + 1); // send 1-based
  }
}
