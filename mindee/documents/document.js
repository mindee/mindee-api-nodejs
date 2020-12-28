const fs = require("fs").promises;

class Document {
  constructor(inputFile = undefined) {
    this.filepath = undefined;
    this.filename = undefined;
    this.fileExtension = undefined;

    if (inputFile != undefined) {
      this.filepath = inputFile.filepath;
      this.filename = inputFile.filename;
      this.fileExtension = inputFile.fileExtension;
    }
    this.checklist = {};
  }

  clone() {
    return JSON.parse(JSON.stringify(this));
  }

  checkAll() {
    return this.checklist.every((item) => item == true);
  }

  async dump(path) {
    return await fs.writeFile(path, JSON.stringify(Object.entries(this)));
  }

  static async load(path) {
    const file = fs.readFile(path);
    const args = JSON.parse(file);
    return new Document({ reconsctruted: true, ...args });
  }

  /**
   * Takes a list of Documents and return one Document where
   * each field is set with the maximum probability field
   * @param {Array<Document>} documents - A list of Documents
   */
  static mergePages(documents) {
    const finalDocument = documents[0].clone();
    const attributes = Object.getOwnPropertyNames(finalDocument);
    for (const document of documents) {
      for (const attribute of attributes) {
        if (
          document?.[attribute]?.probability >
          finalDocument[attribute].probability
        )
          finalDocument[attribute] = document?.[attribute]?.probability;
      }
    }
    return finalDocument;
  }
}

module.exports = Document;
