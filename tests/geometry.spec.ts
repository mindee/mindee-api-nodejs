import * as geometry from "../src/geometry";
import { expect } from "chai";
import {getCentroid, getMinMaxY} from "../src/geometry";

describe("Geometry functions", () => {

  // 90° rectangle, overlaps polygonB
  function polygonA(): geometry.Polygon {
   return [[0.123, 0.53], [0.175, 0.53], [0.175, 0.546], [0.123, 0.546]]
  }

  // 90° rectangle, overlaps polygonA
  function polygonB(): geometry.Polygon {
    return [[0.124, 0.535], [0.190, 0.535], [0.190, 0.546], [0.124, 0.546]]
  }

  // not 90° rectangle, doesn't overlap any polygons
  function polygonC(): geometry.Polygon {
    return [[0.205, 0.407], [0.379, 0.407], [0.381, 0.43], [0.207, 0.43]]
  }

  it("should get a polygon's bounding box", () => {
    expect(geometry.getBbox(polygonA())).to.have.ordered.members(
      [0.123, 0.53, 0.175, 0.546]
    );
    expect(geometry.getBbox(polygonB())).to.have.ordered.members(
      [0.124, 0.535, 0.19, 0.546]
    );
    expect(geometry.getBbox(polygonC())).to.have.ordered.members(
      [0.205, 0.407, 0.381, 0.43]
    );
  });

  it("should get a polygon's bounding box polygon", () => {
    expect(geometry.getBboxAsPolygon(polygonA())).to.deep.ordered.members([
      [0.123, 0.53],
      [0.175, 0.53],
      [0.175, 0.546],
      [0.123, 0.546],
    ]);
    expect(geometry.getBboxAsPolygon(polygonB())).to.deep.ordered.members([
      [0.124, 0.535],
      [0.19, 0.535],
      [0.19, 0.546],
      [0.124, 0.546],
    ]);
    expect(geometry.getBboxAsPolygon(polygonC())).to.deep.ordered.members([
      [0.205, 0.407],
      [0.381, 0.407],
      [0.381, 0.43],
      [0.205, 0.43],
    ]);
  });

  it("should calculate a polygon's centroid", () => {
    expect(geometry.getCentroid(polygonA())).to.have.ordered.members([0.149, 0.538])
  });

  it("should determine if two polygons are on the same line", () => {
    const centroidA = geometry.getCentroid(polygonA());
    const minMaxB = getMinMaxY(polygonB());
    const minMaxC = getMinMaxY(polygonC());
    expect(geometry.isPointInPolygonY(centroidA, minMaxB.min, minMaxB.max)).to.be.true;
    expect(geometry.isPointInPolygonY(centroidA, minMaxC.min, minMaxC.max)).to.be.false;
  });

});