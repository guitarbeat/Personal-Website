
/**
 * GPGPU Helper
 */
const GPGPU = (function () {
  const { RenderTarget, Triangle, Mesh } = ogl;

  function GPGPU(gl, { width, height, type }) {
    this.gl = gl;
    this.width = width;
    this.height = height;
    this.numVertexes = this.width * this.height;

    const renderTargetOptions = {
      width: this.width,
      height: this.height,
      type:
        type ||
        gl.HALF_FLOAT ||
        gl.renderer.extensions["OES_texture_half_float"].HALF_FLOAT_OES,
      internalFormat: gl.renderer.isWebgl2
        ? type === gl.FLOAT
          ? gl.RGBA32F
          : gl.RGBA16F
        : gl.RGBA,
      depth: false,
      unpackAlignment: 1,
    };

    this.read = new RenderTarget(gl, renderTargetOptions);
    this.write = new RenderTarget(gl, renderTargetOptions);
    this.mesh = new Mesh(gl, { geometry: new Triangle(gl) });
  }

  GPGPU.prototype.renderProgram = function (program) {
    this.mesh.program = program;
    this.gl.renderer.render({
      scene: this.mesh,
      target: this.write,
      clear: false,
    });
    this.swap();
  };

  GPGPU.prototype.swap = function () {
    const temp = this.read;
    this.read = this.write;
    this.write = temp;
  };

  return GPGPU;
})();

App();
