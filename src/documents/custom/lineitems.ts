import { errorHandler } from "../../errors/handler";
import { MindeeError } from "../../errors";
import {
  BBox,
  Polygon,
  getBbox,
  getBBoxForPolygons,
  getMinMaxY,
  mergeBbox,
  getBoundingBoxFromBBox,
} from "../../geometry";
import { ListField, ListFieldValue } from "./fields";
import { precisionEquals } from "../../math";

export class Line {
  /**
   * Number of the current line.
   * Starts to 1.
   */
  rowNumber!: number;
  /**
   * List of the fields associated to the current line, identified by their column name.
   */
  fields!: Map<string, ListFieldValue>;
  /**
   * The BBox of the current line.
   */
  bbox!: BBox;
  /**
   * The height tolerance used to build the line.
   * It helps when the higth of an expected line can vary.
   */
  heightTolerance: number;

  constructor(rowNumber: number, heightTolerance: number) {
    this.rowNumber = rowNumber;
    this.bbox = [1, 1, 0, 0];
    this.fields = new Map<string, ListFieldValue>();
    this.heightTolerance = heightTolerance;
  }

  /**
   * Extends the current bbox of the line with the bbox.
   */
  extendWithBbox(bbox: BBox): void {
    this.bbox = mergeBbox(this.bbox, bbox);
  }

  /**
   * Extends the current bbox of the line with the polygon.
   */
  extendWith(polygon: Polygon): void {
    this.bbox = mergeBbox(this.bbox, getBbox(polygon));
  }

  /**
   * Check if the bbox fits the current line.
   */
  contains(bbox: BBox): boolean {
    return precisionEquals(this.bbox[1], bbox[1], this.heightTolerance);
  }

  updateField(name: string, fieldValue: ListFieldValue): void {
    if (!this.fields.has(name)) {
      this.fields.set(name, fieldValue);
    } else {
      const existingField = this.fields.get(name);

      if (existingField === undefined) {
        errorHandler.throw(
          new MindeeError(`The field '${name}' should exist but was not found.`)
        );
        return;
      }

      const mergedContent =
        existingField?.content === undefined
          ? fieldValue.content
          : existingField.content + " " + fieldValue.content;

      const mergedBbox = getBBoxForPolygons([
        existingField.polygon,
        fieldValue.polygon,
      ]);

      this.fields.set(
        name,
        new ListFieldValue({
          content: mergedContent,
          confidence: existingField.confidence * fieldValue.confidence,
          polygon: getBoundingBoxFromBBox(mergedBbox),
        })
      );
    }
  }
}

export class LineItems {
  rows: Line[] = [];

  constructor(lines: Line[]) {
    this.rows = lines;
  }
}

export function getLineItems(
  anchorNames: string[],
  heigthLineTolerance: number,
  fieldNamesTargeted: string[],
  fields: Map<string, ListField>
): LineItems {
  const fieldsToTransformIntoLines = new Map(
    [...fields].filter(([k]) => fieldNamesTargeted.includes(k))
  );

  const anchorName = findBestAnchor(anchorNames, fieldsToTransformIntoLines);
  const lineItemsPrepared = prepare(
    anchorName,
    fieldsToTransformIntoLines,
    heigthLineTolerance
  );

  lineItemsPrepared.rows.forEach((currentLine) => {
    fieldsToTransformIntoLines.forEach((field, fieldName) => {
      field.values.forEach((listFieldValue) => {
        const minYCurrentValue: number = getMinMaxY(listFieldValue.polygon).min;

        if (
          minYCurrentValue < currentLine.bbox[3] &&
          minYCurrentValue >= currentLine.bbox[1]
        ) {
          currentLine.updateField(fieldName, listFieldValue);
        }
      });
    });
  });

  return lineItemsPrepared;
}

function findBestAnchor(
  possibleAnchorNames: string[],
  fields: Map<string, ListField>
): string {
  let anchorName = "";
  let anchorRows = 0;

  possibleAnchorNames.forEach((fieldName) => {
    const fieldValues = fields.get(fieldName)?.values;
    if (fieldValues !== undefined && fieldValues.length > anchorRows) {
      anchorRows = fieldValues.length;
      anchorName = fieldName;
    }
  });

  if (anchorName === "") {
    errorHandler.throw(new MindeeError("No anchor was found."));
  }

  return anchorName;
}

function prepare(
  anchorName: string,
  fields: Map<string, ListField>,
  heigthLineTolerance: number
): LineItems {
  const lineItemsPrepared: Line[] = [];

  const anchorField = fields.get(anchorName);
  if (anchorField === undefined || anchorField.values.length === 0) {
    errorHandler.throw(new MindeeError("No lines have been detected."));
  }

  let currentLineNumber: number = 1;
  let currentLine = new Line(currentLineNumber, heigthLineTolerance);
  let currentValue = anchorField!.values[0];
  currentLine.extendWith(currentValue.polygon);

  if (anchorField !== undefined) {
    for (let index = 1; index < anchorField.values.length; index++) {
      currentValue = anchorField.values[index];
      const currentFieldBbox = getBbox(currentValue.polygon);

      if (!currentLine.contains(currentFieldBbox)) {
        lineItemsPrepared.push(currentLine);
        currentLineNumber++;
        currentLine = new Line(currentLineNumber, heigthLineTolerance);
      }
      currentLine.extendWithBbox(currentFieldBbox);
    }

    if (
      lineItemsPrepared.filter((line) => line.rowNumber === currentLineNumber)
        .length === 0
    ) {
      lineItemsPrepared.push(currentLine);
    }
  }

  return new LineItems(lineItemsPrepared);
}
