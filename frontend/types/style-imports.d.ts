// Allows importing global CSS files in TypeScript (side-effect imports).
// Next.js handles bundling these at build-time; this is purely for TS tooling.

declare module '*.css';
