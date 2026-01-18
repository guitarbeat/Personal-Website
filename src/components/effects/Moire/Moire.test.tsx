
import { render, waitFor } from "@testing-library/react";
import React from "react";

// Mock chroma-js before importing the component
jest.mock("chroma-js", () => ({
  random: () => ({ hex: () => "#000000" }),
}));

// Mock OGL
// We need to avoid using 'document' in the factory, so we'll use a placeholder
// and swap it out or mock the appendChild method to accept our placeholder.
const mockCanvas = {
    nodeName: 'CANVAS',
    style: {},
    parentNode: null,
    width: 100,
    height: 100,
    // Add a fake nodeType to mimic a Node if needed, but appendChild checks strict type
};

jest.mock("ogl", () => {
  return {
    Renderer: class {
      gl;
      setSize;
      render;
      constructor() {
          this.gl = {
            canvas: mockCanvas,
            clearColor: jest.fn(),
            renderer: {
                extensions: { OES_texture_half_float: {} },
                isWebgl2: false,
                render: jest.fn() // Added render function here
            },
            HALF_FLOAT: 1,
            FLOAT: 2,
            RGBA32F: 3,
            RGBA16F: 4,
            RGBA: 5,
          };
          this.setSize = jest.fn();
          this.render = jest.fn();
      }
    },
    Camera: class {
        position = { set: jest.fn(), z: 50 };
        perspective = jest.fn();
        fov = 45;
        aspect = 1;
    },
    Geometry: class {},
    Program: class {
        uniforms = { tDiffuse: { value: null }, uCenter: { value: { set: jest.fn() } }, uRadius: { value: 0 }, uStrength: { value: 0 } };
    },
    Mesh: class {},
    Color: class {
        set = jest.fn();
    },
    Vec2: class {
        set = jest.fn();
    },
    RenderTarget: class {},
    Triangle: class {},
  };
});

// Import the component after mocks
import MagicComponent from "./Moire";

describe("MagicComponent (Moire)", () => {
  // Mock requestAnimationFrame and cancelAnimationFrame
  beforeAll(() => {
    jest.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
      return setTimeout(cb, 16);
    });
    jest.spyOn(window, "cancelAnimationFrame").mockImplementation((id) => {
      clearTimeout(id);
    });

    // Mock HTMLDivElement.prototype.appendChild to allow our fake canvas
    jest.spyOn(HTMLDivElement.prototype, 'appendChild').mockImplementation((node) => {
        // Just ignore the type check failure simulation or return the node
        return node as Node;
    });

    jest.spyOn(HTMLDivElement.prototype, 'removeChild').mockImplementation((node) => {
        return node as Node;
    });
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it("renders without crashing and cleans up event listeners", async () => {
    const addEventListenerSpy = jest.spyOn(window, "addEventListener");
    const removeEventListenerSpy = jest.spyOn(window, "removeEventListener");
    const docAddEventListenerSpy = jest.spyOn(document, "addEventListener");
    const docRemoveEventListenerSpy = jest.spyOn(document, "removeEventListener");

    const { unmount } = render(<MagicComponent />);

    // Wait for the setTimeout(..., 0) to initialize the component
    await waitFor(() => {
        // We expect resize listener to be added
        expect(addEventListenerSpy).toHaveBeenCalledWith("resize", expect.any(Function), false);
    });

    // Unmount the component
    unmount();

    // Verify cleanup
    // We expect removeEventListener to be called for resize
    expect(removeEventListenerSpy).toHaveBeenCalledWith("resize", expect.any(Function), false);

    // Check if scroll listener is removed
    expect(docRemoveEventListenerSpy).toHaveBeenCalledWith("scroll", expect.any(Function), { passive: true });
  });
});
