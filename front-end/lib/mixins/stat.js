import _ from 'lodash'
import { state } from '../../store';

export default {
    methods: {
        statCal: function (intervention) {
            let labelsHisto = [];
            let IntParStructure = {};
            let DataToDisplay = [];
            let SubDataToDisplay = [];
            let LabelsToDisplay = [];
            let SubLabelsToDisplay = [];
            let NbAttestations = 0;
            let nb = 0;
            let statStructure = {
                nationale: {
                    nbInt: 0,
                    nbAtt: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    nbAttCumule: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    nbIntSco: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    nbSco: 0,
                    nbScoRel: 0,
                    nbIntPer: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    nbPer: 0,
                    nbPerRel: 0,
                    nbIntExt: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    nbExt: 0,
                    nbExtRel: 0,
                    nbIntBloc1: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    nbBloc1: 0,
                    nbBloc1Rel: 0,
                    nbIntBloc2: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    nbBloc2: 0,
                    nbBloc2Rel: 0,
                    nbIntBloc3: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    nbBloc3: 0,
                    nbBloc3Rel: 0,
                    IntParBlocParCadre: [0, 0, 0, 0, 0, 0, 0, 0, 0],
                    IntParDepartement: [],
                    CouleurParDepartement: []
                }
            }

            // nb de structures affichées sur le 4eme graphique.
            // S'il y a plus de nbMaxStructureAffichees structures on affiches les nbMaxStructureAffichees premieres + "Autres"
            const nbMaxStructureAffichees = 7;
            const today = new Date();
            const moisCourant = Number(today.getMonth()) + 1;
            const anneeCourant = Number(today.getYear());
            intervention.forEach(element => {
                let mois = Number(element.dateIntervention.getMonth()) + 1;
                let annee = Number(element.dateIntervention.getYear());
                let blocId = Number(element.blocId);
                let nbEnfants = Number(element.nbEnfants);
                let departement = element.departement
                let cai = Number(element.cai);
                let structure = element.structure;
                let indice = 0;
                let indiceMensuel = 0
                let indDepartement = 0

                // Si blocid = 3 alors il y a attestation
                if (blocId === 3) {
                    this.NbAttestations = this.NbAttestations + nbEnfants;
                }

                // tous les tableaux sont indicés sur indiceMensuel qui est a 12 pour le mois courant
                // et 0 pour le même mois l'année dernière
                if ((anneeCourant - annee) === 1) {
                    // sur l'année d'avant on ne prend que les mois à venir
                    if ((mois - moisCourant) >= 0) {
                        indiceMensuel = mois - moisCourant;
                    }
                }
                else {
                    // on ne calcule pas l'indice si l'intervention a eu lieu  plus de 12 mois auparavant
                    if ((anneeCourant - annee) >= 0) {
                        indiceMensuel = (annee - anneeCourant + 1) * 12 + (mois - moisCourant);
                    }
                }

                // on ne garde que les intervention dans [dateDuJour - 12 mois; dateDuJour + 2 mois]
                if (indiceMensuel >= 0 && indiceMensuel < 15) {
                    // on ramene tous les numeros de departement a un entier entre 1 et 102
                    switch (departement) {
                        case '2A':
                            indDepartement = 20;
                            break;
                        case '2B':
                            indDepartement = 96;
                        case '971':
                            indDepartement = 97;
                            break;
                        case '972':
                            indDepartement = 98;
                            break;
                        case '973':
                            indDepartement = 99;
                            break;
                        case '974':
                            indDepartement = 100;
                            break;
                        case '976':
                            indDepartement = 101;
                            break;
                        default:
                            indDepartement = Number(departement);
                    }
                    // initialisation de l'element
                    if (!statStructure[structure]) {
                        statStructure[structure] = {
                            nbInt: 0,
                            nbAtt: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                            nbAttCumule: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                            nbIntSco: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                            nbSco: 0,
                            nbScoRel: 0,
                            nbIntPer: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                            nbPer: 0,
                            nbPerRel: 0,
                            nbIntExt: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                            nbExt: 0,
                            nbExtRel: 0,
                            nbIntBloc1: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                            nbBloc1: 0,
                            nbBloc1Rel: 0,
                            nbIntBloc2: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                            nbBloc2: 0,
                            nbBloc2Rel: 0,
                            nbIntBloc3: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                            nbBloc3: 0,
                            nbBloc3Rel: 0,
                            IntParBlocParCadre: [0, 0, 0, 0, 0, 0, 0, 0, 0],
                            IntParDepartement: [],
                            CouleurParDepartement: []
                        }
                    }
                    // MAJ Nb intervention total par structure
                    statStructure[structure].nbInt++
                    statStructure['nationale'].nbInt++

                    // calcul du nombre d'intervention par departement et par structure
                    if (!statStructure[structure].IntParDepartement[indDepartement]) {
                        statStructure[structure].IntParDepartement[indDepartement] = 0
                    }
                    if (!statStructure['nationale'].IntParDepartement[indDepartement]) {
                        statStructure['nationale'].IntParDepartement[indDepartement] = 0
                    }
                    statStructure[structure].IntParDepartement[indDepartement]++;
                    statStructure['nationale'].IntParDepartement[indDepartement]++;

                    // MAJ du tableau des attestations
                    if (blocId === 3) {
                        nb = nb + nbEnfants
                        statStructure[structure].nbAtt[indiceMensuel] += nbEnfants;
                        statStructure['nationale'].nbAtt[indiceMensuel] += nbEnfants;
                    }

                    // Mise a jour du tableau pour 1er cercle concentrique qui contient 3*3 élements 
                    indice = (blocId - 1) * 3 + cai - 1;
                    statStructure[structure].IntParBlocParCadre[indice]++;
                    statStructure['nationale'].IntParBlocParCadre[indice]++;

                    // incrementation du tableau des etiquettes d'abscisses
                    if (mois + 1 < 10) {
                        labelsHisto[indiceMensuel] =
                            Number(1900 + annee) + "-0" + Number(mois);
                    } else {
                        labelsHisto[indiceMensuel] =
                            Number(1900 + annee) + "-" + Number(mois);
                    }
                    switch (blocId) {
                        case 1:
                            statStructure[structure].nbIntBloc1[indiceMensuel]++;
                            statStructure['nationale'].nbIntBloc1[indiceMensuel]++;
                            break;
                        case 2:
                            statStructure[structure].nbIntBloc2[indiceMensuel]++;
                            statStructure['nationale'].nbIntBloc2[indiceMensuel]++;
                            break;
                        case 3:
                            statStructure[structure].nbIntBloc3[indiceMensuel]++;
                            statStructure['nationale'].nbIntBloc3[indiceMensuel]++;
                            break;
                    }
                    switch (cai) {
                        case 1:
                            statStructure[structure].nbIntPer[indiceMensuel]++;
                            statStructure['nationale'].nbIntPer[indiceMensuel]++
                            break;
                        case 2:
                            statStructure[structure].nbIntExt[indiceMensuel]++;
                            statStructure['nationale'].nbIntExt[indiceMensuel]++
                            break;
                        case 3:
                            statStructure[structure].nbIntSco[indiceMensuel]++;
                            statStructure['nationale'].nbIntSco[indiceMensuel]++;
                            break;
                    }
                }
            })

            // fin boucle sur interventions
            // on parcourt les objets créés pour compléter et faire les calculs
            var clef = Object.keys(statStructure);
            clef.forEach(element => {
                for (var i = 0; i < 15; i++) {
                    // Calcul des interventions cumulees
                    if (i == 0) {
                        statStructure[element].nbAttCumule[i] = statStructure[element].nbAtt[i];
                    } else {
                        statStructure[element].nbAttCumule[i] = statStructure[element].nbAttCumule[i - 1] + statStructure[element].nbAtt[i];
                    }
                }
                // Mise à jour des variables utilisés pour les doughnut chart
                for (var i = 0; i < 9; i++) {
                    //on passe des valeurs absolues en pourcentage
                    statStructure[element].IntParBlocParCadre[i] = Math.round(
                        (statStructure[element].IntParBlocParCadre[i] / statStructure[element].nbInt) * 10000
                    ) / 100;
                }

                // calcul des sommes nbBloc1, nbBloc2 et nbBloc3 et de leur valeur relative (%)
                statStructure[element].nbBloc1 = statStructure[element].nbIntBloc1.reduce((pv, cv) => pv + cv, 0);
                statStructure[element].nbBloc1Rel = Math.round(
                    (statStructure[element].nbBloc1 / statStructure[element].nbInt) * 10000
                ) / 100;
                statStructure[element].nbBloc2 = statStructure[element].nbIntBloc2.reduce((pv, cv) => pv + cv, 0);
                statStructure[element].nbBloc2Rel = Math.round(
                    (statStructure[element].nbBloc2 / statStructure[element].nbInt) * 10000
                ) / 100;
                statStructure[element].nbBloc3 = statStructure[element].nbIntBloc3.reduce((pv, cv) => pv + cv, 0);
                statStructure[element].nbBloc3Rel = Math.round(
                    (statStructure[element].nbBloc3 / statStructure[element].nbInt) * 10000
                ) / 100;
                statStructure[element].nbSco = statStructure[element].nbIntSco.reduce((pv, cv) => pv + cv, 0);
                statStructure[element].nbScoRel = Math.round(
                    (statStructure[element].nbSco / statStructure[element].nbInt) * 10000
                ) / 100;
                statStructure[element].nbPer = statStructure[element].nbIntPer.reduce((pv, cv) => pv + cv, 0);
                statStructure[element].nbPerRel = Math.round(
                    (statStructure[element].nbPer / statStructure[element].nbInt) * 10000
                ) / 100;
                statStructure[element].nbExt = statStructure[element].nbIntExt.reduce((pv, cv) => pv + cv, 0);
                statStructure[element].nbExtRel = Math.round(
                    (statStructure[element].nbExt / statStructure[element].nbInt) * 10000
                ) / 100;

                // initialisation du nombre d'int par département pour la choroplethe
                for (var i = 0; i < 102; i++) {
                    if (!statStructure[element].IntParDepartement[i]) {
                        statStructure[element].IntParDepartement[i] = 0
                    }

                    // choix de la couleur
                    switch (true) {
                        case ((statStructure[element].IntParDepartement[i] / statStructure[element].nbInt) * 100 > 12):
                            statStructure[element].CouleurParDepartement[i] = '#ff0000'
                            break;
                        case ((statStructure[element].IntParDepartement[i] / statStructure[element].nbInt) * 100 > 9):
                            statStructure[element].CouleurParDepartement[i] = '#ff8e8e'
                            break;
                        case ((statStructure[element].IntParDepartement[i] / statStructure[element].nbInt) * 100 > 6):
                            statStructure[element].CouleurParDepartement[i] = '#fcbaba'
                            break;
                        case ((statStructure[element].IntParDepartement[i] / statStructure[element].nbInt) * 100 > 3):
                            statStructure[element].CouleurParDepartement[i] = '#ffe5e5'
                            break;
                        case (statStructure[element].IntParDepartement[i] === 0):
                            statStructure[element].CouleurParDepartement[i] = '#3f3f3f' // =0
                            break;
                        case ((statStructure[element].IntParDepartement[i] / statStructure[element].nbInt) * 100 > 0): // +0
                            statStructure[element].CouleurParDepartement[i] = '#cccccc'
                            break;
                    }
                }
            });

            // sauvegarde du tableau des labels dans l'objet qui sera sauvegardé dans le store
            statStructure['nationale'].labelsHisto = labelsHisto

            // 4 eme graphique, que pour les admin
            // Tri par ordre decroissant et regroupement des petites structures entre elles si trop nombreuses
            var keys = Object.keys(statStructure);
            // on enleve la structure nationale
            keys.splice(0, 1)
            keys.sort(function (a, b) {
                return statStructure[b].nbInt - statStructure[a].nbInt;
            });
            if (keys.length >= nbMaxStructureAffichees) {
                let nbAutre = { nbInt: 0, nbBloc1: 0, nbBloc2: 0, nbBloc3: 0 };
                let i = 0;
                keys.forEach(function (k) {
                    i++;
                    if (i > nbMaxStructureAffichees) {
                        nbAutre.nbInt += statStructure[k].nbInt;
                        nbAutre.nbBloc1 += statStructure[k].nbBloc1;
                        nbAutre.nbBloc2 += statStructure[k].nbBloc2;
                        nbAutre.nbBloc3 += statStructure[k].nbBloc3;
                    } else {
                        DataToDisplay.push(
                            Math.round(
                                (Number(statStructure[k].nbInt) / statStructure['nationale'].nbInt) * 10000
                            ) / 100
                        );
                        SubDataToDisplay.push(
                            Math.round(
                                (Number(statStructure[k].nbBloc1) / statStructure['nationale'].nbInt) * 10000
                            ) / 100
                        );
                        SubDataToDisplay.push(
                            Math.round(
                                (Number(statStructure[k].nbBloc2) / statStructure['nationale'].nbInt) * 10000
                            ) / 100
                        );
                        SubDataToDisplay.push(
                            Math.round(
                                (Number(statStructure[k].nbBloc3) / statStructure['nationale'].nbInt) * 10000
                            ) / 100
                        );
                        LabelsToDisplay.push(k);
                        SubLabelsToDisplay.push(k + " / bloc 1");
                        SubLabelsToDisplay.push(k + " / bloc 2");
                        SubLabelsToDisplay.push(k + " / bloc 3");
                    }
                });
                DataToDisplay.push(
                    Math.round((nbAutre.nbInt / statStructure['nationale'].nbInt) * 10000) / 100
                );
                SubDataToDisplay.push(
                    Math.round((nbAutre.nbBloc1 / statStructure['nationale'].nbInt) * 10000) / 100
                );
                SubDataToDisplay.push(
                    Math.round((nbAutre.nbBloc2 / statStructure['nationale'].nbInt) * 10000) / 100
                );
                SubDataToDisplay.push(
                    Math.round((nbAutre.nbBloc3 / statStructure['nationale'].nbInt) * 10000) / 100
                );
                LabelsToDisplay.push("Autre");
                SubLabelsToDisplay.push("Autre / bloc 1");
                SubLabelsToDisplay.push("Autre / bloc 2");
                SubLabelsToDisplay.push("Autre / bloc 3");
            } else {
                keys.forEach(function (k) {
                    DataToDisplay.push(
                        Math.round(
                            (Number(IntParStructure[k].total) / NbIntervention) * 10000
                        ) / 100
                    );
                    SubDataToDisplay.push(
                        Math.round(
                            (Number(IntParStructure[k].bloc1) / NbIntervention) * 10000
                        ) / 100
                    );
                    SubDataToDisplay.push(
                        Math.round(
                            (Number(IntParStructure[k].bloc2) / NbIntervention) * 10000
                        ) / 100
                    );
                    SubDataToDisplay.push(
                        Math.round(
                            (Number(IntParStructure[k].bloc3) / NbIntervention) * 10000
                        ) / 100
                    );
                    LabelsToDisplay.push(k);
                    SubLabelsToDisplay.push(k + " / bloc 1");
                    SubLabelsToDisplay.push(k + " / bloc 2");
                    SubLabelsToDisplay.push(k + " / bloc 3");
                });
            }

            this.$store.commit('set_statStructure', statStructure)

            // Définition de l'objet Data envoyé au 4eme graphique
            this.data4 = {
                datasets: [
                    {
                        backgroundColor: [
                            "#7D94FF",
                            "#D7FFB2",
                            "#7DFF76",
                            "#10AE2C",
                            "#FCFF51",
                            "#FF7138",
                            "#EA7CEB",
                            "#0400FF"
                        ],
                        data: DataToDisplay,
                        labels: LabelsToDisplay
                    },
                    {
                        labels: SubLabelsToDisplay,
                        backgroundColor: [
                            "#FF9914",
                            "#F21B3F",
                            "#08BDBD",
                            "#FF9914",
                            "#F21B3F",
                            "#08BDBD",
                            "#FF9914",
                            "#F21B3F",
                            "#08BDBD",
                            "#FF9914",
                            "#F21B3F",
                            "#08BDBD",
                            "#FF9914",
                            "#F21B3F",
                            "#08BDBD",
                            "#FF9914",
                            "#F21B3F",
                            "#08BDBD",
                            "#FF9914",
                            "#F21B3F",
                            "#08BDBD",
                            "#FF9914",
                            "#F21B3F",
                            "#08BDBD",
                            "#FF9914",
                            "#F21B3F",
                            "#08BDBD"
                        ],
                        data: SubDataToDisplay
                    }
                ],
                labels: LabelsToDisplay
            };
        }
    }
}