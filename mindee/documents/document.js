class Document {
  constructor(inputFile = undefined) {
    this.filepath = undefined;
    this.filename = undefined;
    this.file_extension = undefined;

    if (inputFile != undefined) {
      this.filepath = inputFile.filepath;
      this.filename = inputFile.filename;
      this.file_extension = inputFile.file_extension;
    }
    this.checklist = {};
  }

  clone() {
    return JSON.parse(JSON.stringify(this));
  }

  checkAll() {
    return this.checklist.every((item) => item == true);
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
