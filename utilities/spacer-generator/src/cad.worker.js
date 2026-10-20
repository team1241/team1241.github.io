import init from 'replicad-opencascadejs';
import wasmUrl from 'replicad-opencascadejs/src/replicad_single.wasm?url&inline';
import { setOC, measureVolume } from 'replicad';
import { buildSpacer } from './model.mjs';
import { exportPart } from './exports.mjs';

let shape, signature;
// Supply bytes directly in production so file previews never fetch a local asset.
const wasmBinary = wasmUrl.startsWith('data:')
  ? Uint8Array.from(atob(wasmUrl.split(',')[1]), character => character.charCodeAt(0))
  : undefined;
const ready = init({ locateFile: () => wasmUrl, wasmBinary }).then(setOC);
self.onmessage = async ({data}) => {
  const {id, action, params, format, unit} = data;
  try {
    await ready;
    const nextSignature = JSON.stringify(params);
    if (!shape || signature !== nextSignature) {
      const nextShape = buildSpacer(params);
      shape?.delete(); shape = nextShape; signature = nextSignature;
    }
    if (action === 'export') {
      const blob = exportPart(shape,format,unit);
      self.postMessage({id,blob});
    } else {
      const mesh=shape.mesh({tolerance:0.06,angularTolerance:0.15});
      mesh.edges=shape.meshEdges({tolerance:0.06,angularTolerance:0.15}).lines;
      self.postMessage({id, mesh, volume:measureVolume(shape)});
    }
  } catch(error) { self.postMessage({id,error: error instanceof Error ? error.message : 'The spacer could not be generated. Reset the dimensions and try again.'}); }
};
