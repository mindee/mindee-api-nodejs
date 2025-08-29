import * as geometry from "../src/geometry";
import { expect } from "chai";

describe("Geometry functions", () => {
  // 90° rectangle, overlaps polygonB
  const polygonA = new geometry.Polygon(
    [0.123, 0.53],
    [0.175, 0.53],
    [0.175, 0.546],
    [0.123, 0.546],
  );

  // 90° rectangle, overlaps polygonA
  const polygonB = new geometry.Polygon(
    [0.124, 0.535],
    [0.19, 0.535],
    [0.19, 0.546],
    [0.124, 0.546],
  );

  // not 90° rectangle, doesn't overlap any polygons
  const polygonC = new geometry.Polygon(
    [0.205, 0.407],
    [0.379, 0.407],
    [0.381, 0.43],
    [0.207, 0.43],
  );

  it("should get a polygon's bbox", () => {
    const bboxA = geometry.getBbox(polygonA);
    expect(bboxA.xMin).to.be.eq(0.123);
    expect(bboxA.yMin).to.be.eq(0.53);
    expect(bboxA.xMax).to.be.eq(0.175);
    expect(bboxA.yMax).to.be.eq(0.546);

    const bboxB = geometry.getBbox(polygonB);
    expect(bboxB.xMin).to.be.eq(0.124);
    expect(bboxB.yMin).to.be.eq(0.535);
    expect(bboxB.xMax).to.be.eq(0.19);
    expect(bboxB.yMax).to.be.eq(0.546);

    const bboxC = geometry.getBbox(polygonC);
    expect(bboxC.xMin).to.be.eq(0.205);
    expect(bboxC.yMin).to.be.eq(0.407);
    expect(bboxC.xMax).to.be.eq(0.381);
    expect(bboxC.yMax).to.be.eq(0.43);
  });

  it("should get a polygon's bounding box", () => {
    expect(geometry.getBoundingBox(polygonA)).to.deep.ordered.members([
      [0.123, 0.53],
      [0.175, 0.53],
      [0.175, 0.546],
      [0.123, 0.546],
    ]);
    expect(geometry.getBoundingBox(polygonB)).to.deep.ordered.members([
      [0.124, 0.535],
      [0.19, 0.535],
      [0.19, 0.546],
      [0.124, 0.546],
    ]);
    expect(geometry.getBoundingBox(polygonC)).to.deep.ordered.members([
      [0.205, 0.407],
      [0.381, 0.407],
      [0.381, 0.43],
      [0.205, 0.43],
    ]);
  });

  it("should calculate a polygon's centroid", () => {
    const utilsCentroid = geometry.getCentroid(polygonA);
    const polygonCentroid = polygonA.getCentroid();
    const expectedCentroid = [0.149, 0.538];
    expect(utilsCentroid).to.deep.ordered.members(expectedCentroid);
    expect(polygonCentroid).to.deep.ordered.members(expectedCentroid);
  });

  it("should determine if two polygons are on the same line", () => {
    // Should be in polygon A & B, since polygons overlap
    const pointA: geometry.Point = [0.125, 0.535];
    // Should only be in polygon C
    const pointB: geometry.Point = [0.3, 0.42];

    expect(geometry.isPointInPolygonY(pointA, polygonA)).to.be.true;
    expect(polygonA.isPointInY(pointA)).to.be.true;
    expect(geometry.isPointInPolygonY(pointA, polygonB)).to.be.true;
    expect(polygonB.isPointInY(pointA)).to.be.true;
    expect(geometry.isPointInPolygonY(pointA, polygonC)).to.be.false;
    expect(polygonC.isPointInY(pointA)).to.be.false;

    expect(geometry.isPointInPolygonY(pointB, polygonA)).to.be.false;
    expect(polygonA.isPointInY(pointB)).to.be.false;
    expect(geometry.isPointInPolygonY(pointB, polygonB)).to.be.false;
    expect(polygonB.isPointInY(pointB)).to.be.false;
    expect(geometry.isPointInPolygonY(pointB, polygonC)).to.be.true;
    expect(polygonC.isPointInY(pointB)).to.be.true;
  });

  it("should determine if two polygons are on the same column", () => {
    // Should be in polygon A & B, since polygons overlap
    const pointA: geometry.Point = [0.125, 0.535];
    // Should only be in polygon C
    const pointB: geometry.Point = [0.3, 0.42];

    expect(geometry.isPointInPolygonX(pointA, polygonA)).to.be.true;
    expect(polygonA.isPointInX(pointA)).to.be.true;
    expect(geometry.isPointInPolygonX(pointA, polygonB)).to.be.true;
    expect(polygonB.isPointInX(pointA)).to.be.true;
    expect(geometry.isPointInPolygonX(pointA, polygonC)).to.be.false;
    expect(polygonC.isPointInX(pointA)).to.be.false;

    expect(geometry.isPointInPolygonX(pointB, polygonA)).to.be.false;
    expect(polygonA.isPointInX(pointB)).to.be.false;
    expect(geometry.isPointInPolygonX(pointB, polygonB)).to.be.false;
    expect(polygonB.isPointInX(pointB)).to.be.false;
    expect(geometry.isPointInPolygonX(pointB, polygonC)).to.be.true;
    expect(polygonC.isPointInX(pointB)).to.be.true;
  });

  it("should merge two Bbox", () => {
    const firsBBox: geometry.BBox = new geometry.BBox(0.081, 0.442, 0.15, 0.451);
    const secondBBox: geometry.BBox = new geometry.BBox(0.157, 0.442, 0.26, 0.451);

    const mergedBbox = geometry.mergeBbox(firsBBox, secondBBox);

    expect(mergedBbox.xMin).to.be.eq(0.081);
    expect(mergedBbox.yMin).to.be.eq(0.442);
    expect(mergedBbox.xMax).to.be.eq(0.26);
    expect(mergedBbox.yMax).to.be.eq(0.451);
  });
});
