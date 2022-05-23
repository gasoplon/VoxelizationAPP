export function createConfigurationKey(resolutionVoxel, useRemoveDisconnected) {
  return resolutionVoxel + "-" + useRemoveDisconnected;
}
