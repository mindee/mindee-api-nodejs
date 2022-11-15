import { expect } from "chai";
import * as wordResearch from "../src/wordResearch";

describe("Words functions", () => {
  it.only("should found a word", () => {
    const words = ["4AHK3 B02 2444 303 4 VENT achat. prochain votre de lors ise Subpr une recevez et .cmm ssbbay www-global sur avis nous votre Donnez 01 impression: Ne di d'articles Lignes 2 44 0 3,26 0,17 3,09 5,50% A 0,00 0,00 0,00 0,00 20,00% C 0,86 0,69 7,64 6,95 10,00% B . Rabais TVA TTC HT Taux € TVA) 1,30 (incl. Total Rabais € 0,10 Rendu € 11,00 Espèces € PLACE) 10,90 (SUR TTC Total € HT Sous-total 10,04 A -Dorut 1,50 A 2,20 50c1 -Volvic - Bacon Extra 1,20 B 1,20€ -SUB30 7,30 Poulet B 1 Menu Poulet (FR) 9,70 9,70€ Qté Article Unité Prix Prix Ticket client No Ticket 155816 NO term-No 1/A-177736 Order : TVA FR09340018852 : Code 5610C NAF : Siret 00016 340 852 018 12:32:48 01/07/2022 #1 : sophie Employéle) ) France 95570, Attainville 104 9 route départementale 74 SERVICE EG 80 91 39 01 Tél Subway 68936-0 No"];
    const result = wordResearch.isMyWordFound("Espèces", words);

    expect(result).to.be.true;
  });

  it.only("should found a list of fuzzy words", () => {
    const words = ["ESP"];
    const result = wordResearch.isMyWordFound("Espèces", words);

    expect(result).to.be.true;
  });

  it.only("should not found a word", () => {
    const words = ["4AHK3 B02 2444 303 4 VENT achat. 1,30 (incl. Total Rabais € 0,10 Rendu € 11,00 Espèces € PLACE) 10,90 Subway 68936-0 No"];
    const result = wordResearch.isMyWordFound("CB", words);

    expect(result).to.be.false;
  });
});
