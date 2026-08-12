import { SearchModel } from "@/v2/parsing/search/searchModel.js";
import { StringDict } from "@/parsing/index.js";

export class SearchModels extends Array<SearchModel> {

  constructor(serverResponse: StringDict) {
    super();
    this.push(...(serverResponse ?? []).map(
      (item: StringDict) => new SearchModel(item)
    ));
  }

  toString(): string {
    if (this.length === 0) {
      return "\n";
    }
    const lines: string[] = [];
    for (const model of this) {
      lines.push(`* :Name: ${model.name}`);
      lines.push(`  :ID: ${model.id}`);
      lines.push(`  :Model Type: ${model.modelType}`);
    }
    return lines.join("\n");
  }

}
