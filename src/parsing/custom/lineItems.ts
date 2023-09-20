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
  MinMax,
} from "../../geometry";
import { ListField, ListFieldValue } from "./listField";

export class CustomLine {
  /**
   * Number of the current line.
   * Starts at 1.
   */
  rowNumber: number;
  /**
   * List of the fields associated to the current line, identified by their column name.
   */
  fields: Map<string, ListFieldValue>;
  /**
   * The BBox of the entire line, all fields included.
   */
  bbox: BBox;

  constructor(rowNumber: number) {
    this.rowNumber = rowNumber;
    this.bbox = new BBox(1, 1, 0, 0);
    this.fields = new Map<string, ListFieldValue>();
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

export class CustomLines extends Array<CustomLine> {}

/**
 * Get line items from fields.
 */
export function getLineItems(
  anchorNames: string[],
  fieldNames: string[],
  fields: Map<string, ListField>,
  heightLineTolerance: number,
): CustomLines {
  const fieldsToTransformIntoLines: Map<string, ListField> = new Map(
    [...fields].filter(([k]) => fieldNames.includes(k))
  );

  const anchorName: string = findBestAnchor(anchorNames, fieldsToTransformIntoLines);
  const linesPrepared: CustomLine[] = prepare(
    anchorName,
    fieldsToTransformIntoLines,
    heightLineTolerance
  );

  linesPrepared.forEach((currentLine) => {
    fieldsToTransformIntoLines.forEach((field, fieldName) => {
      field.values.forEach((listFieldValue) => {
        const minMaxY: MinMax = getMinMaxY(listFieldValue.polygon);
        if (
          Math.abs(minMaxY.max - currentLine.bbox.yMax) <= heightLineTolerance &&
          Math.abs(minMaxY.min - currentLine.bbox.yMin) <= heightLineTolerance
        ) {
          currentLine.updateField(fieldName, listFieldValue);
        }
      });
    });
  });
  return linesPrepared;
}

/**
 * Loop through the possible anchor fields and find the one with the most values.
 */
function findBestAnchor(
  possibleAnchorNames: string[],
  fields: Map<string, ListField>
): string {
  let anchorName = "";
  let anchorRows = 0;

  possibleAnchorNames.forEach((fieldName) => {
    const fieldValues: ListFieldValue[]|undefined = fields.get(fieldName)?.values;
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

/**
 * Check if the bbox fits inside the line.
 */
function isBboxInLine(line: CustomLine, bbox: BBox, heightTolerance: number): boolean {
  if (Math.abs(bbox.yMin - line.bbox.yMin) <= heightTolerance) {
    return true;
  }
  return Math.abs(line.bbox.yMin - bbox.yMin) <= heightTolerance;
}

function prepare(
  anchorName: string,
  fields: Map<string, ListField>,
  heightLineTolerance: number
): CustomLine[] {
  const linesPrepared: CustomLine[] = [];

  const anchorField = fields.get(anchorName);
  if (anchorField === undefined || anchorField.values.length === 0) {
    errorHandler.throw(new MindeeError("No lines have been detected."));
  }

  let currentLineNumber: number = 1;
  let currentLine: CustomLine = new CustomLine(currentLineNumber);

  if (anchorField !== undefined) {
    let currentValue: ListFieldValue = anchorField.values[0];
    currentLine.extendWith(currentValue.polygon);

    for (let index = 1; index < anchorField.values.length; index++) {
      currentValue = anchorField.values[index];
      const currentFieldBbox = getBbox(currentValue.polygon);

      if (!isBboxInLine(currentLine, currentFieldBbox, heightLineTolerance)) {
        linesPrepared.push(currentLine);
        currentLineNumber++;
        currentLine = new CustomLine(currentLineNumber);
      }
      currentLine.extendWithBbox(currentFieldBbox);
    }

    if (
      linesPrepared.filter((line) => line.rowNumber === currentLineNumber)
        .length === 0
    ) {
      linesPrepared.push(currentLine);
    }
  }

  return linesPrepared;
}
