// OAM access timing tests on the core

// Assertion
const assert = require('assert');

// WasmBoy get Core
const getWasmBoyCore = require('../../dist/core/getWasmBoyWasmCore.cjs.js');

const PROGRAM_START = 0x100;
const OAM_START = 0xfe00;

function configCore(wasmboy) {
  wasmboy.config(
    0, // enableBootRom: i32,
    0, // useGbcWhenAvailable: i32,
    1, // audioBatchProcessing: i32,
    0, // graphicsBatchProcessing: i32,
    0, // timersBatchProcessing: i32,
    0, // graphicsDisableScanlineRendering: i32,
    1, // audioAccumulateSamples: i32,
    0, // tileRendering: i32,
    0, // tileCaching: i32,
    0 // enableAudioDebugging: i32
  );
}

describe('WasmBoy Core OAM Access', () => {
  it('Should allow OAM writes during vblank', async () => {
    const wasmboyCore = await getWasmBoyCore();
    const wasmboy = wasmboyCore.instance.exports;
    const wasmByteMemoryArray = new Uint8Array(wasmboy.memory.buffer);

    // NOP to enter vblank from the post-boot LY=144 state, then write A to OAM.
    wasmByteMemoryArray.set(
      [
        0x00, // NOP
        0x3e,
        0x42, // LD A,0x42
        0xea,
        0x00,
        0xfe // LD (0xFE00),A
      ],
      wasmboy.CARTRIDGE_ROM_LOCATION + PROGRAM_START
    );

    configCore(wasmboy);

    wasmboy.executeStep();
    assert.strictEqual(wasmboy.getLY(), 144);

    wasmboy.executeStep();
    wasmboy.executeStep();

    const oamStart = wasmboy.getWasmBoyOffsetFromGameBoyOffset(OAM_START);
    assert.strictEqual(wasmByteMemoryArray[oamStart], 0x42);
  });
});
