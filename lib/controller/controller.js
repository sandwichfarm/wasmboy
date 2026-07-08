// https://github.com/torch2424/responsive-gamepad
import { ResponsiveGamepad } from 'responsive-gamepad';

import ResponsiveGamepadPluginGB from './gbplugin';

import { WORKER_MESSAGE_TYPE } from '../worker/constants';
import { getEventData } from '../worker/util';

class WasmBoyControllerService {
  constructor() {
    // Our wasm instance
    this.worker = undefined;
    this.isEnabled = false;

    // Bind Repsonsive Gamepad to this
    this.ResponsiveGamepad = ResponsiveGamepad;

    ResponsiveGamepad.addPlugin(ResponsiveGamepadPluginGB());
  }

  initialize() {
    if (!this.isEnabled) {
      this.enableDefaultJoypad();
    }

    return Promise.resolve();
  }

  setWorker(worker) {
    this.worker = worker;
  }

  updateController() {
    if (!this.isEnabled) {
      return {};
    }

    // Create an abstracted controller state
    const controllerState = ResponsiveGamepad.getState();

    // Set the new controller state on the instance
    this._setJoypadState(controllerState, false);

    // Return the controller state in case we need something from it
    return controllerState;
  }

  setJoypadState(controllerState) {
    return this._setJoypadState(controllerState, true);
  }

  _setJoypadState(controllerState, disableDefaultJoypad) {
    if (disableDefaultJoypad && this.isEnabled) {
      this.disableDefaultJoypad();
    }

    const setJoypadStateParamsAsArray = [
      controllerState.UP ? 1 : 0,
      controllerState.RIGHT ? 1 : 0,
      controllerState.DOWN ? 1 : 0,
      controllerState.LEFT ? 1 : 0,
      controllerState.A ? 1 : 0,
      controllerState.B ? 1 : 0,
      controllerState.SELECT ? 1 : 0,
      controllerState.START ? 1 : 0
    ];

    const message = {
      type: WORKER_MESSAGE_TYPE.SET_JOYPAD_STATE,
      setJoypadStateParamsAsArray
    };

    if (disableDefaultJoypad) {
      return this.worker.postMessage(message);
    }

    this.worker.postMessageIgnoreResponse(message);
    return Promise.resolve();
  }

  enableDefaultJoypad() {
    this.isEnabled = true;

    ResponsiveGamepad.enable();
  }

  disableDefaultJoypad() {
    this.isEnabled = false;

    ResponsiveGamepad.disable();
  }
}

export const WasmBoyController = new WasmBoyControllerService();
