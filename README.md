# nimbus-web
Web visualization of nimbus

# Colormaps
For 2D views, invalid pixels are displayed as followed:
- saturated pixels are displayed as BLACK pixels
- asymmetric and underexposured pixels are displayed as WHITE pixels.

The conf array contains the pixel confidence, with the following meanings:
- 0: valid pixel
- 1: underexposured
- 2: saturated
- 3: asymmetric
