import { promises as fs } from "fs";
import * as path from "path";
import { MindeeVisionV1} from "../../../src/documents";
import { expect } from "chai";
import { dataPath } from "../../apiPaths";

describe("MindeeVisionV1 Object initialization", async () => {
  it("should load a complete document prediction", async () => {
    const jsonData = await fs.readFile(
      path.resolve(dataPath.mindeeVisionV1.complete)
    );
    const response = JSON.parse(jsonData.toString());
    const pageData = response.document.inference.pages[0];
    const doc = new MindeeVisionV1({
      prediction: pageData.prediction,
      pageId: pageData.id,
      orientation: pageData.orientation,
      extras: pageData.extras,
    });
    const docString = await fs.readFile(
      path.join(dataPath.mindeeVisionV1.page0String)
    );
    expect(doc.allWords.length).to.be.equals(61);
    expect(doc.toString()).to.be.equals(docString.toString());
  });

});
