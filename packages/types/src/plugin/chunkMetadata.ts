export interface Chunk {
  type: "image";
}

export interface ChunkMetadata {
  importedAssets: Record<string, Chunk>;
  importedCss: Set<string>;
}
