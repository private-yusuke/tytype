#!/bin/bash
echo "Start building Tytype..."
yarn run build
echo "Tytype has built."
echo "Compressing dist into dist.zip..."
zip -r dist.zip dist
echo "Done!"