import { getWasmConstant, getWasmMemorySection } from '../debug/debug';
import { GAMEBOY_CAMERA_WIDTH, GAMEBOY_CAMERA_HEIGHT } from './constants';
import { getImageDataFromGraphicsFrameBuffer } from './worker/imageData';

export const screenshot = async () => {
  const frameLocation = await getWasmConstant('FRAME_LOCATION');

  if (frameLocation === undefined) {
    throw new Error('WasmBoy must be loaded before taking a screenshot');
  }

  const frameSize = GAMEBOY_CAMERA_WIDTH * GAMEBOY_CAMERA_HEIGHT * 3;
  const frameMemory = await getWasmMemorySection(frameLocation, frameLocation + frameSize);

  return getImageDataFromGraphicsFrameBuffer(frameMemory);
};
