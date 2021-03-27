export class GeneArray {

    constructor() {
        this.geneArr = []
    }

    run(cell, maxIter) {
        let geneNum = this.geneArr[0].data[0];
        for (let i = 0; i < maxIter; i++) {
            if (cell.isAlive()) {
                if (this.geneArr[geneNum]) {
                    geneNum = this.geneArr[geneNum].run(cell);
                }
            } else {
                break;
            }
        }
    }

    getGeneArr() {
        return this.geneArr;
    }

    addGene(gene) {
        this.geneArr.push(gene)
    }

    mutate() {
        // swap genes
        // change gene data
        // add gene
        // remove gene
        // multiple genes
    }

}

