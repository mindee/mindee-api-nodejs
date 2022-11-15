import { expect } from "chai";
import * as wordResearch from "../src/wordResearch";

describe("Words functions", () => {
  it("should found a word in a complete sentence", () => {
    const words = ["4AHK3 B02 2444 303 4 VENT achat. prochain votre de lors ise Subpr une recevez et .cmm ssbbay www-global sur avis nous votre Donnez 01 impression: Ne di d'articles Lignes 2 44 0 3,26 0,17 3,09 5,50% A 0,00 0,00 0,00 0,00 20,00% C 0,86 0,69 7,64 6,95 10,00% B . Rabais TVA TTC HT Taux € TVA) 1,30 (incl. Total Rabais € 0,10 Rendu € 11,00 Espèces € PLACE) 10,90 (SUR TTC Total € HT Sous-total 10,04 A -Dorut 1,50 A 2,20 50c1 -Volvic - Bacon Extra 1,20 B 1,20€ -SUB30 7,30 Poulet B 1 Menu Poulet (FR) 9,70 9,70€ Qté Article Unité Prix Prix Ticket client No Ticket 155816 NO term-No 1/A-177736 Order : TVA FR09340018852 : Code 5610C NAF : Siret 00016 340 852 018 12:32:48 01/07/2022 #1 : sophie Employéle) ) France 95570, Attainville 104 9 route départementale 74 SERVICE EG 80 91 39 01 Tél Subway 68936-0 No"];
    const result = wordResearch.isMyWordFound("Espèces", words);

    expect(result).to.be.true;
  });

  it("should found through a list of fuzzy words to found the payment type in an expense receipt in a complete sentence", () => {
    const words = ["Règlement espèces"];
    const result1 = wordResearch.isMyWordFound("ESP", words);
    const result2 = wordResearch.isMyWordFound("Espèces", words);
    const result3 = wordResearch.isMyWordFound("ESPECES", words);
    const result4 = wordResearch.isMyWordFound("Espèce", words);
    const result5 = wordResearch.isMyWordFound("ESPECE", words);
    const result6 = wordResearch.isMyWordFound("En espèce", words);
    const result7 = wordResearch.isMyWordFound("Règlement espèces", words);
    const result8 = wordResearch.isMyWordFound("Règlement en espèce", words);
    const result9 = wordResearch.isMyWordFound("Réglé en espèces", words);
    const result10 = wordResearch.isMyWordFound("Réglé en espèce", words);

    expect(result1).to.be.true;
    expect(result2).to.be.true;
    expect(result3).to.be.true;
    expect(result4).to.be.true;
    expect(result5).to.be.true;
    expect(result6).to.be.true;
    expect(result7).to.be.true;
    expect(result8).to.be.true;
    expect(result9).to.be.true;
    expect(result10).to.be.true;
  });

  it("should found through a list of fuzzy words to found the payment type in an banking receipt in a complete sentence", () => {
    const words = ["Carte bancaire"];
    const result1 = wordResearch.isMyWordFound("Carte Bancaire", words);
    const result2 = wordResearch.isMyWordFound("Cartes Bancaires", words);
    const result3 = wordResearch.isMyWordFound("Carte de Crédit", words);
    const result4 = wordResearch.isMyWordFound("Carte", words);
    const result5 = wordResearch.isMyWordFound("Cartes", words);
    const result6 = wordResearch.isMyWordFound("Carte bleue", words);
    const result8 = wordResearch.isMyWordFound("CB", words);

    expect(result1).to.be.true;
    expect(result2).to.be.true;
    expect(result3).to.be.true;
    expect(result4).to.be.true;
    expect(result5).to.be.true;
    expect(result6).to.be.true;
    expect(result8).to.be.true;
  });

  it("should found through a list of fuzzy words to found the payment type in an banking receipt in a complete sentence", () => {
    const words = ["SP95-E10 PRODUIT= EUR/L 2.019 PU= L 29,84 QUANTITE= (20.00% EUR 10.04 TVA="
      + "L'ETAT PAR CONTROLEES NON INDICATIONS A CONSERVER TICKET DEBIT EUR 60.25 MONTANT REEL"
      + " C 2 904 26147 2228 BA6DBCC8DD155065 ************5866 11899 95040592800108 0197901 "
      + "26000 VALENCE ESSFLOREALYG859 le : a : 06/07/22 13:57:52 CB 1 1 ADODOD A C"];

    const result7 = wordResearch.isMyWordFound("Débit", words);
    const result8 = wordResearch.isMyWordFound("CB", words);
    const result9 = wordResearch.isMyWordFound("CB Ingenico", words);
    const result10 = wordResearch.isMyWordFound("CB Sans contact", words);

    expect(result7).to.be.true;
    expect(result8).to.be.true;
    expect(result9).to.be.true;
    expect(result10).to.be.true;
  });

  it("should not found a word in a complete sentence", () => {
    const words = ["4AHK3 B02 2444 303 4 VENT achat. 1,30 (incl. Total Rabais € 0,10 Rendu € 11,00 Espèces € PLACE) 10,90 Subway 68936-0 No"];
    const result = wordResearch.isMyWordFound("CB", words);

    expect(result).to.be.false;
  });

  it("should found one word among a list in a complete sentence", () => {
    const words = ["4AHK3 B02 2444 303 4 VENT achat. 1,30 (incl. Total Rabais € 0,10 Rendu € 11,00 Espèces € PLACE) 10,90 Subway 68936-0 No"];
    const result = wordResearch.isOneOfMyWordFound(["Espèces", "CB"], words);

    expect(result).to.be.true;
  });

  it("should not found one word among a list in a complete sentence", () => {
    const words = ["4AHK3 B02 2444 303 4 VENT achat. 1,30 (incl. Total Rabais € 0,10 Rendu € 11,00 Espèces € PLACE) 10,90 Subway 68936-0 No"];
    const result = wordResearch.isOneOfMyWordFound(["VISA", "CB"], words);

    expect(result).to.be.false;
  });

  it("should found one word", () => {
    const words = ["SP95-E10","PRODUIT=","EUR/L","2.019","PU=","L","29,84","QUANTITE=",
    "(20.00%","EUR","10.04","TVA=","L'ETAT","PAR","CONTROLEES","NON","INDICATIONS","A",
    "CONSERVER","TICKET","DEBIT","EUR","60.25","MONTANT","REEL","C","2","904","26147","2228",
    "BA6DBCC8DD155065","************5866","11899","95040592800108","0197901","26000","VALENCE",
    "ESSFLOREALYG859","le",":","a",":","06/07/22","13:57:52","CB","1","1","ADODOD","A","C"];
    const result = wordResearch.isMyWordFound("CB", words);

    expect(result).to.be.false;
  });

  it.only("should not found the payment type in an banking receipt ", () => {
    const words = ["4AHK3","B02","2444","303","4","VENT","achat.","prochain","votre","de","lors",
    "ise","Subpr","une","recevez","et",".cmm","ssbbay","www-global","sur","avis","nous","votre",
    "Donnez","01","impression:","Ne","di","d'articles","Lignes","2","44","0","3,26","0,17","3,09",
    "5,50%","A","0,00","0,00","0,00","0,00","20,00%","C","0,86","0,69","7,64","6,95","10,00%","B",".",
    "Rabais","TVA","TTC","HT","Taux","€","TVA)","1,30","(incl.","Total","Rabais","€","0,10","Rendu","€",
    "11,00","Espèces","€","PLACE)","10,90","(SUR","TTC","Total","€","HT","Sous-total","10,04","A","-Dorut",
    "1,50","A","2,20","50c1","-Volvic","-","Bacon","Extra","1,20","B","1,20€","-SUB30","7,30","Poulet","B","1",
    "Menu","Poulet","(FR)","9,70","9,70€","Qté","Article","Unité","Prix","Prix","Ticket","client","No","Ticket",
    "155816","NO","term-No","1/A-177736","Order",":","TVA","FR09340018852",":","Code","5610C","NAF",":",
    "Siret","00016","340","852","018","12:32:48","01/07/2022","#1",":","sophie","Employéle)",")","France","95570,",
    "Attainville","104","9","route","départementale","74","SERVICE","EG","80","91","39","01","Tél","Subway","68936-0","No"];
    const result = wordResearch.isMyWordFound("CB", words);

    expect(result).to.be.false;
  });
});
