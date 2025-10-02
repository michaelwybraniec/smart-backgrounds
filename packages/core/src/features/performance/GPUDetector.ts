/**
 * GPUDetector - WebGL capability detection
 * Determines device GPU tier for optimal quality settings
 */

import type { GPUCapabilities } from './types.js';

export class GPUDetector {
  /**
   * Detect GPU capabilities
   */
  static detect(): GPUCapabilities | null {
    // Try WebGL 2.0 first
    const gl2 = this.getWebGL2Context();
    if (gl2) {
      return this.detectFromContext(gl2, true);
    }

    // Fallback to WebGL 1.0
    const gl1 = this.getWebGL1Context();
    if (gl1) {
      return this.detectFromContext(gl1, false);
    }

    return null;
  }

  /**
   * Detect GPU capabilities from context
   */
  private static detectFromContext(
    gl: WebGLRenderingContext | WebGL2RenderingContext,
    webgl2Supported: boolean
  ): GPUCapabilities {
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    const renderer = debugInfo
      ? String(gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL))
      : 'Unknown';
    const vendor = debugInfo ? String(gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL)) : 'Unknown';

    const maxTextureSize = Number(gl.getParameter(gl.MAX_TEXTURE_SIZE));
    const tier = this.detectTier(renderer, maxTextureSize);
    const extensionsSupported = gl.getSupportedExtensions() ?? [];

    return {
      tier,
      renderer,
      vendor,
      maxTextureSize,
      webgl2Supported,
      extensionsSupported,
    };
  }

  /**
   * Get WebGL 2.0 context
   */
  private static getWebGL2Context(): WebGL2RenderingContext | null {
    try {
      const canvas = document.createElement('canvas');
      return canvas.getContext('webgl2');
    } catch {
      return null;
    }
  }

  /**
   * Get WebGL 1.0 context
   */
  private static getWebGL1Context(): WebGLRenderingContext | null {
    try {
      const canvas = document.createElement('canvas');
      return (canvas.getContext('webgl') ||
        canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null;
    } catch {
      return null;
    }
  }

  /**
   * Detect GPU tier based on renderer string and capabilities
   */
  private static detectTier(renderer: unknown, maxTextureSize: number): GPUCapabilities['tier'] {
    const rendererStr = String(renderer).toLowerCase();

    // High-end GPUs
    if (
      rendererStr.includes('nvidia') ||
      rendererStr.includes('geforce') ||
      rendererStr.includes('rtx') ||
      rendererStr.includes('radeon rx') ||
      rendererStr.includes('amd') ||
      (rendererStr.includes('apple') && rendererStr.includes('m1')) ||
      (rendererStr.includes('apple') && rendererStr.includes('m2')) ||
      (rendererStr.includes('apple') && rendererStr.includes('m3'))
    ) {
      if (maxTextureSize >= 16384) return 'high';
    }

    // Medium GPUs
    if (
      rendererStr.includes('intel') ||
      rendererStr.includes('iris') ||
      rendererStr.includes('uhd') ||
      rendererStr.includes('gtx') ||
      rendererStr.includes('mx')
    ) {
      if (maxTextureSize >= 8192) return 'medium';
    }

    // Low-end / integrated GPUs
    if (maxTextureSize >= 4096) {
      return 'low';
    }

    // Minimal capabilities
    return 'minimal';
  }

  /**
   * Check if WebGL is supported
   */
  static isWebGLSupported(): boolean {
    return this.detect() !== null;
  }

  /**
   * Check if WebGL 2.0 is supported
   */
  static isWebGL2Supported(): boolean {
    const capabilities = this.detect();
    return capabilities?.webgl2Supported ?? false;
  }
}
