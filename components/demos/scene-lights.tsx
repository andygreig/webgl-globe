import { GLOBE_DEFAULTS } from "@/lib/config";

interface SceneLightsProps {
  ambientIntensity?: number;
  directionalIntensity?: number;
}

export function SceneLights({
  ambientIntensity = GLOBE_DEFAULTS.ambientIntensity,
  directionalIntensity = GLOBE_DEFAULTS.directionalIntensity,
}: SceneLightsProps) {
  return (
    <>
      <ambientLight intensity={ambientIntensity} />
      <hemisphereLight color={0xffffbb} groundColor={0x080820} intensity={1.5} />
      <pointLight position={[-50, 0, 60]} decay={0} intensity={Math.PI} distance={100} color={0x081b26} />
      {directionalIntensity > 0 && (
        <directionalLight position={[5, 3, 5]} intensity={directionalIntensity} color="#ffffff" />
      )}
    </>
  );
}
