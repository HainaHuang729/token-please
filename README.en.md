# Token, Please!

A Chinese-language pixel-art inspection game about model relay services. Compare orders with upstream receipts, check authorized subcontracting, catch model substitutions, truncated input and overbilling.

[Play in your browser](https://hainahuang729.github.io/token-please/) · [中文说明](README.md)

Five chapters, thirty authored orders, ten model-inspired characters and seven masked appearances. Later chapters introduce subtle discrepancies; costumes alone never determine a verdict. Income is measured in fictional token units. No real model APIs are called.

## Run locally

Serve this folder with `python3 -m http.server 8766` and open http://localhost:8766/. Runtime assets are bundled; no build is needed to play.

For development, run `npm ci`, `npx playwright install chromium`, start the local server, then `npm test`. To rebuild art and bitmap text: `pip install -r tools/requirements.txt` followed by `python tools/build_assets.py`.

## Credits and limitations

Adapted from [IP, PLEASE](https://github.com/ip-please/ip-please.github.io) by ctnyanya, reference commit `5b6337c`. Original MIT and font OFL notices are retained. Reference-inspired character art is not automatically covered by the original code license.

The campaign is currently Chinese only, uses a fixed case sequence, and has no mid-campaign save. Each character has a generated six-frame sheet, cropped and registered with frozen non-facial artwork. Characters breathe, blink and speak with actual generated eyelid and mouth frames; reduced-motion mode remains still. Refined masks use separate generated prop artwork with per-character alignment. All contracts and service records are fictional.
