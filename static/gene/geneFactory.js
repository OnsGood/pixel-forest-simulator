import { GirdDrive } from "../GridDrive.js";
import { Behaviors, Gene } from "./Gene.js";
import { GeneArray } from "./GeneArray.js";

export class GeneFactory {
    maxDate1 = 50;
    maxDate2 = 150

    createNewGeneArray(girdDrive) {
        let genes = new GeneArray();

        for (let key in Behaviors) {
            let randomData = [this.getRandomNumber(this.maxDate1), this.getRandomNumber(this.maxDate1), this.getRandomNumber(this.maxDate2)]
            genes.addGene(new Gene(Behaviors[key], randomData, girdDrive));
        }

        return genes;
    }

    createGeneArrayFromOld(geneArray) {
        let genes = new GeneArray();

        for (let oldGeneNum in geneArray.getGeneArr()) {
            let oldGene = geneArray.getGeneArr()[oldGeneNum];
            let oldData = oldGene.getData();

            let newData = this.mutateGene([oldData[0], oldData[1], oldData[2]], this.maxDate1, this.maxDate2);

            let newGene = new Gene(oldGene.getBehavior(), newData, oldGene.girdDrive);

            genes.addGene(newGene);
        }

        this.mutateGeneArray(genes, genes.getGeneArr()[0].girdDrive)

        return genes;
    }

    createRandomGene(MaxNumberInData, girdDrive) {
        let rnd = this.getRandomNumber(Object.keys(Behaviors).length);
        let randBehavior = Object.values(Behaviors)[rnd];

        let randomData = [this.getRandomNumber(MaxNumberInData), this.getRandomNumber(MaxNumberInData), this.getRandomNumber(150)]

        return new Gene(randBehavior, randomData, girdDrive);
    }

    mutateGene(data, data1SIze, data2Size) {
        let mutantiosVariant = Math.floor(Math.random() * 10);

        switch (mutantiosVariant) {
            case 1:
                data[0] = Math.floor(Math.random() * data1SIze)
                break;
            case 2:
                data[1] = Math.floor(Math.random() * data1SIze)
                break;
            case 3:
                data[2] = Math.floor(Math.random() * data2Size)
                break;
        }
        return data;
    }

    mutateGeneArray(geneArray, girdDrive) {
        let mutantiosType = Math.floor(Math.random() * 100);

        if (mutantiosType === 1) {
            let gene = this.createRandomGene(geneArray.length + 1, girdDrive)
            geneArray.addGene(gene);
        } else if (mutantiosType === 2) {
            geneArray.getGeneArr().pop();
        }
    }

    getRandomNumber(max) {
        return Math.floor(Math.random() * max);
    }
}