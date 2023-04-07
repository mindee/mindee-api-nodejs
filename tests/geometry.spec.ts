import * as geometry from "../src/geometry";
import { expect } from "chai";

describe("Geometry functions", () => {
  // 90° rectangle, overlaps polygonB
  function polygonA(): geometry.Polygon {
    return [
      [0.123, 0.53],
      [0.175, 0.53],
      [0.175, 0.546],
      [0.123, 0.546],
    ];
  }

  // 90° rectangle, overlaps polygonA
  function polygonB(): geometry.Polygon {
    return [
      [0.124, 0.535],
      [0.19, 0.535],
      [0.19, 0.546],
      [0.124, 0.546],
    ];
  }

  // not 90° rectangle, doesn't overlap any polygons
  function polygonC(): geometry.Polygon {
    return [
      [0.205, 0.407],
      [0.379, 0.407],
      [0.381, 0.43],
      [0.207, 0.43],
    ];
  }

  it("should get a polygon's bounding box", () => {
    expect(geometry.getBbox(polygonA())).to.have.ordered.members([
      0.123, 0.53, 0.175, 0.546,
    ]);
    expect(geometry.getBbox(polygonB())).to.have.ordered.members([
      0.124, 0.535, 0.19, 0.546,
    ]);
    expect(geometry.getBbox(polygonC())).to.have.ordered.members([
      0.205, 0.407, 0.381, 0.43,
    ]);
  });

  it("should get a polygon's bounding box polygon", () => {
    expect(geometry.getBoundingBox(polygonA())).to.deep.ordered.members([
      [0.123, 0.53],
      [0.175, 0.53],
      [0.175, 0.546],
      [0.123, 0.546],
    ]);
    expect(geometry.getBoundingBox(polygonB())).to.deep.ordered.members([
      [0.124, 0.535],
      [0.19, 0.535],
      [0.19, 0.546],
      [0.124, 0.546],
    ]);
    expect(geometry.getBoundingBox(polygonC())).to.deep.ordered.members([
      [0.205, 0.407],
      [0.381, 0.407],
      [0.381, 0.43],
      [0.205, 0.43],
    ]);
  });

  it("should calculate a polygon's centroid", () => {
    expect(geometry.getCentroid(polygonA())).to.have.ordered.members([
      0.149, 0.538,
    ]);
  });

  it("should determine if two polygons are on the same line", () => {
    // Should be in polygon A & B, since polygons overlap
    const pointA: geometry.Point = [0.125, 0.535];
    // Should only be in polygon C
    const pointB: geometry.Point = [0.3, 0.42];

    expect(geometry.isPointInPolygonY(pointA, polygonA())).to.be.true;
    expect(geometry.isPointInPolygonY(pointA, polygonB())).to.be.true;
    expect(geometry.isPointInPolygonY(pointA, polygonC())).to.be.false;

    expect(geometry.isPointInPolygonY(pointB, polygonA())).to.be.false;
    expect(geometry.isPointInPolygonY(pointB, polygonB())).to.be.false;
    expect(geometry.isPointInPolygonY(pointB, polygonC())).to.be.true;
  });

  it("should determine if two polygons are on the same column", () => {
    // Should be in polygon A & B, since polygons overlap
    const pointA: geometry.Point = [0.125, 0.535];
    // Should only be in polygon C
    const pointB: geometry.Point = [0.3, 0.42];

    expect(geometry.isPointInPolygonX(pointA, polygonA())).to.be.true;
    expect(geometry.isPointInPolygonX(pointA, polygonB())).to.be.true;
    expect(geometry.isPointInPolygonX(pointA, polygonC())).to.be.false;

    expect(geometry.isPointInPolygonX(pointB, polygonA())).to.be.false;
    expect(geometry.isPointInPolygonX(pointB, polygonB())).to.be.false;
    expect(geometry.isPointInPolygonX(pointB, polygonC())).to.be.true;
  });

  it("should merge two Bbox", () => {
    const firsBBox: geometry.BBox = [0.081, 0.442, 0.15, 0.451];
    const secondBBox: geometry.BBox = [0.157, 0.442, 0.26, 0.451];

    const mergedBbox = geometry.mergeBbox(firsBBox, secondBBox);

    expect(mergedBbox[0]).to.be.eq(0.081);
    expect(mergedBbox[1]).to.be.eq(0.442);
    expect(mergedBbox[2]).to.be.eq(0.26);
    expect(mergedBbox[3]).to.be.eq(0.451);
  });
});