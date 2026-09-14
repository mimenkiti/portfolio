import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

/**
 * Two build targets.
 *
 * The launch build is ordinary: the prototypes in public/artifacts and the
 * pronunciation clips in public/audio stay on disk and are fetched when a
 * visitor reaches them. Inlining them, as V2 did, would put ~3MB of base64
 * audio and four whole prototypes into the first byte of the document.
 *
 * SINGLEFILE=1 restores the old behaviour for the artifact harness, which
 * needs one self-contained document. It is not the launch path.
 */
const single = process.env.SINGLEFILE === '1'

export default defineConfig({
  plugins: [react(), ...(single ? [viteSingleFile()] : [])],
  build: {
    target: 'es2020',
    cssCodeSplit: false,
    assetsInlineLimit: single ? 100000000 : 4096,
    chunkSizeWarningLimit: 100000,
    reportCompressedSize: false,
  },
})
