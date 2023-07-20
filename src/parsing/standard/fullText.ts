import * as geometry from "../../geometry";

export type Word = {
  /**
   * Contains the relative vertices coordinates (points) of a polygon containing
   * the field in the document.
   */
  polygon: geometry.Polygon;
  text: string;
  confidence: number;
};

type Line = Word[];

function orderLines(fullText: Word[]): Line[] {
  const lines: Line[] = [];
  const indexes: number[] = [];
  let current: Word | undefined = undefined;

  fullText.forEach(() => {
    let line: Line = [];
    fullText.forEach((word, idx) => {
      if (!indexes.includes(idx)) {
        if (current === undefined) {
          current = word;
          indexes.push(idx);
          line = [current];
        } else {
          const centroid = geometry.getCentroid(word.polygon);
          if (geometry.isPointInPolygonY(centroid, current.polygon)) {
            line.push(word);
            indexes.push(idx);
          }
        }
      }
    });
    current = undefined;
    if (line.length > 0) {
      lines.push(line);
    }
  });

  const orderedLines: Array<Line> = [];
  lines.forEach((line) => {
    let sortedLine = [...line];
    sortedLine.sort((a, b) => {
      return geometry.relativeX(a.polygon) - geometry.relativeX(b.polygon);
    });
    orderedLines.push(sortedLine);
  });
  orderedLines.reverse();
  return orderedLines;
}

/**
 * OCR extraction from the entire document.
 */
export class FullText {
  words: Word[] = [];

  /**
   * Order all text on a page into lines.
   * WARNING: This feature is experimental.
   */
  toLines(): Line[] {
    return orderLines(this.words);
  }

  /**
   * WARNING: This feature is experimental.
   */
  toString(): string {
    let outStr = "";
    const lines = this.toLines();
    lines.forEach((line) => {
      const lineStr = line.map((word) => word.text).join(" ");
      outStr += `${lineStr}\n`;
    });
    return outStr;
  }
}
