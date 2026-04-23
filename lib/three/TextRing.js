import * as THREE from "three";
import { MSDFTextGeometry, uniforms } from "@/lib/msdf/index.js";
import fontData from "@/lib/fonts/Neuton-Regular-msdf.json";
// Keep JSON import as-is (you replaced contents with Helvetica);
// but ensure the atlas PNG matches the JSON pages entry.
const atlasURL = "/textures/HelveticaNeueRoman.png";

const textVertexShader = `
attribute vec2 layoutUv;
attribute float lineIndex;
attribute float lineLettersTotal;
attribute float lineLetterIndex;
attribute float lineWordsTotal;
attribute float lineWordIndex;
attribute float wordIndex;
attribute float letterIndex;

varying vec2 vUv;
varying vec2 vLayoutUv;
varying vec3 vViewPosition;
varying vec3 vNormal;
varying float vLineIndex;
varying float vLineLettersTotal;
varying float vLineLetterIndex;
varying float vLineWordsTotal;
varying float vLineWordIndex;
varying float vWordIndex;
varying float vLetterIndex;

uniform float uSpeed;
uniform float uAmplitude;

mat4 rotationMatrix(vec3 axis, float angle) {
  axis = normalize(axis);
  float s = sin(angle);
  float c = cos(angle);
  float oc = 1.0 - c;

  return mat4(
    oc * axis.x * axis.x + c,
    oc * axis.x * axis.y - axis.z * s,
    oc * axis.z * axis.x + axis.y * s,
    0.0,
    oc * axis.x * axis.y + axis.z * s,
    oc * axis.y * axis.y + c,
    oc * axis.y * axis.z - axis.x * s,
    0.0,
    oc * axis.z * axis.x - axis.y * s,
    oc * axis.y * axis.z + axis.x * s,
    oc * axis.z * axis.z + c,
    0.0,
    0.0,
    0.0,
    0.0,
    1.0
  );
}

vec3 rotate(vec3 v, vec3 axis, float angle) {
  mat4 m = rotationMatrix(axis, angle);
  return (m * vec4(v, 1.0)).xyz;
}

void main() {
  vUv = uv;
  vLayoutUv = layoutUv;
  vNormal = normal;
  vLineIndex = lineIndex;
  vLineLettersTotal = lineLettersTotal;
  vLineLetterIndex = lineLetterIndex;
  vLineWordsTotal = lineWordsTotal;
  vLineWordIndex = lineWordIndex;
  vWordIndex = wordIndex;
  vLetterIndex = letterIndex;

  vec3 newPosition = position;
  newPosition = rotate(newPosition, vec3(0.0, 0.0, 1.0), uSpeed * position.x * uAmplitude);

  vec4 mvPosition = vec4(newPosition, 1.0);
  mvPosition = modelViewMatrix * mvPosition;
  gl_Position = projectionMatrix * mvPosition;
  vViewPosition = -mvPosition.xyz;
}
`;

const textFragmentShader = `
varying vec2 vUv;

uniform float uOpacity;
uniform float uThreshold;
uniform float uAlphaTest;
uniform vec3 uColor;
uniform sampler2D uMap;
uniform vec3 uStrokeColor;
uniform float uStrokeOutsetWidth;
uniform float uStrokeInsetWidth;
uniform vec2 uMapResolution;
uniform float uBlurAmount;

float median(float r, float g, float b) {
  return max(min(r, g), min(max(r, g), b));
}

float msdfAlpha(vec2 uv) {
  vec3 s = texture2D(uMap, uv).rgb;
  float sigDist = median(s.r, s.g, s.b) - 0.5;
  return smoothstep(-0.1, 0.1, sigDist);
}

void main() {
  vec3 s = texture2D(uMap, vUv).rgb;
  float sigDist = median(s.r, s.g, s.b) - 0.5;
  float afwidth = 1.4142135623730951 / 2.0;
  float alpha;
  #ifdef IS_SMALL
    alpha = smoothstep(uThreshold - afwidth, uThreshold + afwidth, sigDist);
  #else
    alpha = clamp(sigDist / fwidth(sigDist) + 0.5, 0.0, 1.0);
  #endif

  if (alpha < uAlphaTest) discard;
  vec4 filledFragColor = vec4(uColor, uOpacity * alpha);
  gl_FragColor = filledFragColor;
}
`;

const OPACITY_STEPS_DESKTOP = [1, 0.7, 0.5, 0.2];
const OPACITY_STEPS_MOBILE = [1, 0.7, 0.5, 0];
const OPACITY_STEPS_LENGTH = OPACITY_STEPS_DESKTOP.length;
const OPACITY_LERP = 0.15;
const BLUR_STEPS = [0, 4, 8, 14];
const BLUR_LERP = 0.12;
const MOBILE_BREAKPOINT = 768;

export default class TextRing {
  constructor({
    element,
    scene,
    sizes,
    index,
    circleSpeed,
    length,
    amplitude,
    color = new THREE.Color(0x000000),
    fontSize = 0.01,
    fontSizePx = 60,
    lineHeightPx = 56,
    letterSpacingPx = -1.2,
    radiusRatio = 0.35,
    mobileRadiusRatio,
    mobileWrapWidthPx = 240,
  }) {
    this.element = element;
    this.scene = scene;
    this.sizes = sizes;
    this.index = index;
    this.length = length;
    this.circleSpeed = circleSpeed;
    this.amplitude = amplitude;
    this.color = color;
    this.fontSize = fontSize;
    this.fontSizePx = fontSizePx;
    this.lineHeightPx = lineHeightPx;
    this.letterSpacingPx = letterSpacingPx;
    this.radiusRatio = radiusRatio;
    this.mobileRadiusRatio = mobileRadiusRatio ?? radiusRatio;
    this.mobileWrapWidthPx = mobileWrapWidthPx;
    this.lastIsMobile = undefined;

    this.scale = this.fontSize;
    this.numberOfText = this.length;
    this.group = null;
    this.mesh = null;
    this.disposed = false;
    this.currentOpacity = 0;
    this.currentBlur = 0;

    this.load();
  }

  async load() {
    const atlas = await this.loadFontAtlas(atlasURL);
    if (this.disposed) return;
    const atlasFontSize = this.getAtlasFontSize();
    const { fontSizePx, lineHeightPx, letterSpacingPx } =
      this.getActiveMetrics();
    const spacingScale = atlasFontSize / fontSizePx;
    const widthPx = this.isMobile() ? this.mobileWrapWidthPx : undefined;
    const geometry = new MSDFTextGeometry({
      text: this.element.title,
      font: fontData,
      lineHeight: lineHeightPx * spacingScale,
      letterSpacing: letterSpacingPx * spacingScale,
      width: widthPx ? widthPx * spacingScale : undefined,
    });

    geometry.computeBoundingBox();
    geometry.toNonIndexed();

    const shaderUniforms = {
      uSpeed: { value: 0.0 },
      uAmplitude: { value: this.amplitude },
      ...THREE.UniformsUtils.clone(uniforms.common),
      ...THREE.UniformsUtils.clone(uniforms.rendering),
      ...THREE.UniformsUtils.clone(uniforms.strokes),
      uMapResolution: { value: new THREE.Vector2(1, 1) },
      uBlurAmount: { value: 0 },
    };

    shaderUniforms.uColor.value = new THREE.Vector3(
      this.color.r,
      this.color.g,
      this.color.b
    );

    const material = new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      transparent: true,
      defines: {
        IS_SMALL: false,
      },
      extensions: {
        derivatives: true,
      },
      uniforms: shaderUniforms,
      vertexShader: textVertexShader,
      fragmentShader: textFragmentShader,
    });

    material.uniforms.uMap.value = atlas;
    if (atlas.image && atlas.image.width) {
      material.uniforms.uMapResolution.value.set(
        atlas.image.width,
        atlas.image.height
      );
    }
    material.uniforms.uOpacity.value = 1.0;
    material.uniforms.uStrokeInsetWidth.value = 0.0;
    material.uniforms.uStrokeOutsetWidth.value = 0.0;

    this.group = new THREE.Group();
    this.mesh = new THREE.Mesh(geometry, material);
    this.group.add(this.mesh);
    this.scene.add(this.group);
    this.createBounds({ sizes: this.sizes });

    const boundsHeight =
      geometry.boundingBox.max.y - geometry.boundingBox.min.y;
    this.mesh.position.y = boundsHeight / 4;
    this.mesh.position.x = this.getRadiusLocal();
  }

  loadFontAtlas(path) {
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin("anonymous");
    return loader.loadAsync(path);
  }

  createBounds({ sizes }) {
    if (!this.mesh) return;
    this.sizes = sizes;
    this.updateScale();
    this.updateZ();
    this.updateResponsiveMetricsIfNeeded();
  }

  updateZ(z = 0) {
    if (!this.group) return;
    this.group.rotation.z = (this.index / this.numberOfText) * 2 * Math.PI - z;
  }

  updateScale() {
    if (!this.group) return;
    const worldUnitsPerPixel = this.getWorldUnitsPerPixel();
    const atlasFontSize = this.getAtlasFontSize();
    const { fontSizePx } = this.getActiveMetrics();
    const targetScale = worldUnitsPerPixel * (fontSizePx / atlasFontSize);
    this.scale = targetScale;
    this.group.scale.set(this.scale, -this.scale, this.scale);
    if (this.mesh) {
      this.mesh.position.x = this.getRadiusLocal();
    }
  }

  onResize(sizes) {
    this.sizes = sizes;
    this.createBounds({ sizes: this.sizes });
  }

  update(scroll, speed, amplitude) {
    if (!this.mesh) return;
    this.updateZ(scroll.y);
    this.mesh.material.uniforms.uSpeed.value = speed * 1.4;
    this.mesh.material.uniforms.uAmplitude.value = amplitude * 1.4;
    const stepIndex = this.getStepIndex(scroll.y);
    const targetOpacity = this.getOpacityForStep(stepIndex);
    this.currentOpacity = THREE.MathUtils.lerp(
      this.currentOpacity ?? targetOpacity,
      targetOpacity,
      OPACITY_LERP
    );
    this.mesh.material.uniforms.uOpacity.value = this.currentOpacity;
    const targetBlur = this.getBlurForStep(stepIndex);
    this.currentBlur = THREE.MathUtils.lerp(
      this.currentBlur ?? targetBlur,
      targetBlur,
      BLUR_LERP
    );
    this.mesh.material.uniforms.uBlurAmount.value = this.currentBlur;
  }

  dispose() {
    this.disposed = true;
    if (this.group && this.scene) {
      this.scene.remove(this.group);
    }

    if (this.mesh) {
      this.mesh.geometry.dispose();
      this.mesh.material.dispose();
    }

    this.group = null;
    this.mesh = null;
  }

  getAtlasFontSize() {
    return fontData?.info?.size || 42;
  }

  isMobile() {
    const width = this.sizes?.width ?? 0;
    return width > 0 && width < MOBILE_BREAKPOINT;
  }

  getActiveMetrics() {
    if (this.isMobile()) {
      return {
        fontSizePx: 32,
        lineHeightPx: 32,
        letterSpacingPx: -0.4,
      };
    }
    return {
      fontSizePx: this.fontSizePx,
      lineHeightPx: this.lineHeightPx,
      letterSpacingPx: this.letterSpacingPx,
    };
  }

  updateResponsiveMetricsIfNeeded() {
    if (!this.mesh) return;
    const currentlyMobile = this.isMobile();
    if (this.lastIsMobile === currentlyMobile) return;
    this.lastIsMobile = currentlyMobile;

    const atlasFontSize = this.getAtlasFontSize();
    const { fontSizePx, lineHeightPx, letterSpacingPx } =
      this.getActiveMetrics();
    const spacingScale = atlasFontSize / fontSizePx;
    this.mesh.geometry.update({
      text: this.element.title,
      font: fontData,
      lineHeight: lineHeightPx * spacingScale,
      letterSpacing: letterSpacingPx * spacingScale,
      width: currentlyMobile
        ? this.mobileWrapWidthPx * spacingScale
        : undefined,
    });
    this.mesh.geometry.computeBoundingBox();
    const boundsHeight =
      this.mesh.geometry.boundingBox.max.y -
      this.mesh.geometry.boundingBox.min.y;
    this.mesh.position.y = boundsHeight / 4;
    this.updateScale();
  }

  getWorldUnitsPerPixel() {
    const viewHeight = this.sizes?.viewHeight ?? 2;
    const pixelHeight = this.sizes?.height ?? 1;
    return viewHeight / Math.max(pixelHeight, 1);
  }

  getTargetWorldRadius() {
    const viewWidth = this.sizes?.viewWidth ?? 2;
    const ratio = this.isMobile() ? this.mobileRadiusRatio : this.radiusRatio;
    return viewWidth * ratio;
  }

  getRadiusLocal() {
    const targetWorldRadius = this.getTargetWorldRadius();
    const scale = this.scale || 1;
    return targetWorldRadius / scale;
  }

  getStepIndex(scrollAngle) {
    if (!this.mesh) return OPACITY_STEPS_LENGTH;
    const total = this.numberOfText || 1;
    const stepAngle = (Math.PI * 2) / total;
    const textAngle = (this.index / total) * Math.PI * 2;
    let diff = textAngle - scrollAngle;
    const fullCircle = Math.PI * 2;
    diff =
      ((((diff + Math.PI) % fullCircle) + fullCircle) % fullCircle) - Math.PI;
    return Math.round(Math.abs(diff) / stepAngle);
  }

  getOpacityForStep(stepIndex) {
    const steps = this.isMobile() ? OPACITY_STEPS_MOBILE : OPACITY_STEPS_DESKTOP;
    return stepIndex < steps.length ? steps[stepIndex] : 0;
  }

  getBlurForStep(stepIndex) {
    return stepIndex < BLUR_STEPS.length
      ? BLUR_STEPS[stepIndex]
      : BLUR_STEPS[BLUR_STEPS.length - 1];
  }
}
