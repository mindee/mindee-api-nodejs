class DataPath {
  invoice: any = {
    complete: "tests/data/invoice/response/complete.json",
    empty: "tests/data/invoice/response/empty.json",
    docString: "tests/data/invoice/response/doc_to_string.txt",
    page0String: "tests/data/invoice/response/page0_to_string.txt",
  };
  receipt: any = {
    complete: "tests/data/receipt/response/complete.json",
    empty: "tests/data/receipt/response/empty.json",
    docString: "tests/data/receipt/response/doc_to_string.txt",
    page0String: "tests/data/receipt/response/page0_to_string.txt",
  };
  passport: any = {
    complete: "tests/data/passport/response/complete.json",
    empty: "tests/data/passport/response/empty.json",
    docString: "tests/data/passport/response/doc_to_string.txt",
    page0String: "tests/data/passport/response/page0_to_string.txt",
  };
  custom: any = {
    complete: "tests/data/custom/response/complete.json",
    empty: "tests/data/custom/response/empty.json",
    docString: "tests/data/custom/response/doc_to_string.txt",
    page0String: "tests/data/custom/response/page0_to_string.txt",
    page1String: "tests/data/custom/response/page1_to_string.txt",
  };
}

export const dataPath = new DataPath();
