import * as geometry from "../../geometry";

type Word = {
  polygon: geometry.Polygon;
  text: string;
  confidence: number;
};

type Line = Word[];

function orderLines(fullText: Word[]): Array<Line> {
  const lines: Array<Line> = [];
  const idxs: Array<number> = [];
  let current: Word | undefined = undefined;

  fullText.forEach(() => {
    let line: Line = [];
    fullText.forEach((word, idx) => {
      if (!idxs.includes(idx)) {
        if (current === undefined) {
          current = word;
          idxs.push(idx);
          line = [current];
        } else {
          const yCoords = geometry.getMinMaxY(current.polygon);
          const centroid = geometry.getCentroid(word.polygon);
          if (geometry.isPointInPolygonY(centroid, yCoords.min, yCoords.max)) {
            line.push(word);
            idxs.push(idx);
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
    const sortedLine = line.sort((a, b) => {
      return geometry.relativeX(a.polygon) - geometry.relativeX(b.polygon);
    });
    orderedLines.push(sortedLine);
  });
  orderedLines.reverse();
  return orderedLines;
}

export class FullText {
  words: Word[] = [];

  /**
   * Order all text on a page into lines.
   * WARNING: This feature is experimental.
   */
  toLines(): Array<Line> {
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
