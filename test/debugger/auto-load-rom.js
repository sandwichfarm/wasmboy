const assert = require('assert');

const { autoLoadROMFromQueryString, getAutoLoadROMConfig } = require('../../demo/debugger/autoLoadROM');

describe('Debugger Auto Load ROM', () => {
  it('gets ROM config from the rom query parameter', () => {
    const config = getAutoLoadROMConfig('?rom=https%3A%2F%2Fexample.com%2Fgames%2Fdemo.gb');

    assert.deepStrictEqual(config, {
      fileName: 'demo.gb',
      url: 'https://example.com/games/demo.gb'
    });
  });

  it('allows romName to override the inferred file name', () => {
    const config = getAutoLoadROMConfig('?romUrl=%2Froms%2Fdemo.gbc&romName=Nightly%20Build', 'https://wasmboy.app/debugger/');

    assert.deepStrictEqual(config, {
      fileName: 'Nightly Build',
      url: '/roms/demo.gbc'
    });
  });

  it('loads and force-plays a ROM from the query string', () => {
    const calls = [];
    const response = autoLoadROMFromQueryString('?rom=https%3A%2F%2Fexample.com%2Fdemo.gb', (file, fileName, options) => {
      calls.push({ file, fileName, options });
      return 'loaded';
    });

    assert.strictEqual(response, 'loaded');
    assert.deepStrictEqual(calls, [
      {
        file: 'https://example.com/demo.gb',
        fileName: 'demo.gb',
        options: {
          forcePlay: true
        }
      }
    ]);
  });

  it('does nothing when no ROM URL was requested', () => {
    const response = autoLoadROMFromQueryString('?debug=true', () => {
      throw new Error('loadROM should not be called');
    });

    assert.strictEqual(response, false);
  });
});
