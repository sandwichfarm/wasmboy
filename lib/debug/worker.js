import { WORKER_MESSAGE_TYPE } from '../worker/constants';
import { getEventData } from '../worker/util';

export const runWasmExportFromWorker = async (worker, exportKey, parameters, timeout) => {
  if (!worker) {
    return;
  }

  const event = await worker.postMessage(
    {
      type: WORKER_MESSAGE_TYPE.RUN_WASM_EXPORT,
      export: exportKey,
      parameters
    },
    undefined,
    timeout
  );

  const eventData = getEventData(event);
  return eventData.message.response;
};

export const getWasmMemorySectionFromWorker = async (worker, start, end) => {
  if (!worker) {
    return;
  }

  const event = await worker.postMessage({
    type: WORKER_MESSAGE_TYPE.GET_WASM_MEMORY_SECTION,
    start,
    end
  });

  const eventData = getEventData(event);
  return new Uint8Array(eventData.message.response);
};

export const getWasmConstantFromWorker = async (worker, constantKey) => {
  if (!worker) {
    return;
  }

  const event = await worker.postMessage({
    type: WORKER_MESSAGE_TYPE.GET_WASM_CONSTANT,
    constant: constantKey
  });

  const eventData = getEventData(event);
  return eventData.message.response;
};
