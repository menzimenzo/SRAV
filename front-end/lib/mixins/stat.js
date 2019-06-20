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
            let data1 = {};
            let newStatStructure = [];
            let data2 = {};
            let data3 = {};
            let data4 = {};
            let optionsHisto = {};
            let optionsHisto2 = {};
            let optionsDoughnut = {};
            let statStructure = {
                nationale: {
                    nbInt: 0,
                    nbAtt: [],
                    nbAttCumule: [],
                    nbIntSco: [],
                    nbSco: 0,
                    nbScoRel: 0,
                    nbIntPer: [],
                    nbPer: 0,
                    nbPerRel: 0,
                    nbIntExt: [],
                    nbExt: 0,
                    nbExtRel: 0,
                    nbIntBloc1: [],
                    nbBloc1: 0,
                    nbBloc1Rel: 0,
                    nbIntBloc2: [],
                    nbBloc2: 0,
                    nbBloc2Rel: 0,
                    nbIntBloc3: [],
                    nbBloc3: 0,
                    nbBloc3Rel: 0,
                    IntParBlocParCadre: [0, 0, 0, 0, 0, 0, 0, 0, 0]
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
                let cai = Number(element.cai);
                let structure = element.structure;
                let indice = 0;
                let indiceMensuel = -1
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
                if (
                    (indiceMensuel >= 0) &
                    (indiceMensuel <= 14)
                ) {
                    // initialisation de l'element
                    if (!statStructure[structure]) {
                        statStructure[structure] = {
                            nbInt: 0,
                            nbAtt: [],
                            nbAttCumule: [],
                            nbIntSco: [],
                            nbSco: 0,
                            nbScoRel: 0,
                            nbIntPer: [],
                            nbPer: 0,
                            nbPerRel: 0,
                            nbIntExt: [],
                            nbExt: 0,
                            nbExtRel: 0,
                            nbIntBloc1: [],
                            nbBloc1: 0,
                            nbBloc1Rel: 0,
                            nbIntBloc2: [],
                            nbBloc2: 0,
                            nbBloc2Rel: 0,
                            nbIntBloc3: [],
                            nbBloc3: 0,
                            nbBloc3Rel: 0,
                            IntParBlocParCadre: [0, 0, 0, 0, 0, 0, 0, 0, 0]
                        }
                    }
                    // MAJ Nb intervention total par structure
                    statStructure[structure].nbInt++
                    // MAJ du tableau des attestations
                    if (blocId === 3) {
                        if (!statStructure[structure].nbAtt[indiceMensuel]) {
                            statStructure[structure].nbAtt[indiceMensuel] = nbEnfants;
                        }
                        else {
                            statStructure[structure].nbAtt[indiceMensuel] = Number(nbEnfants + statStructure[structure].nbAtt[indiceMensuel]);
                        }
                    }
                    indice = (blocId - 1) * 3 + cai - 1;
                    statStructure[structure].IntParBlocParCadre[indice]++;
                    // G1 et G3
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
                            if (!statStructure[structure].nbIntBloc1[indiceMensuel]) {
                                statStructure[structure].nbIntBloc1[indiceMensuel] = 1;
                            } else {
                                statStructure[structure].nbIntBloc1[indiceMensuel]++;
                            }
                            break;
                        case 2:
                            if (!statStructure[structure].nbIntBloc2[indiceMensuel]) {
                                statStructure[structure].nbIntBloc2[indiceMensuel] = 1;
                            } else {
                                statStructure[structure].nbIntBloc2[indiceMensuel]++;
                            }
                            break;
                        case 3:
                            if (!statStructure[structure].nbIntBloc3[indiceMensuel]) {
                                statStructure[structure].nbIntBloc3[indiceMensuel] = 1;
                            } else {
                                statStructure[structure].nbIntBloc3[indiceMensuel]++;
                            }
                            break;
                    }
                    // Mantis 68934 ! Inversion case 1 => Sco  et case 3 => ExtraSco
                    switch (cai) {
                        case 1:
                            if (!statStructure[structure].nbIntPer[indiceMensuel]) {
                                statStructure[structure].nbIntPer[indiceMensuel] = 1;
                            } else {
                                statStructure[structure].nbIntPer[indiceMensuel]++;
                            }
                            break;
                        case 2:
                            if (!statStructure[structure].nbIntExt[indiceMensuel]) {
                                statStructure[structure].nbIntExt[indiceMensuel] = 1;
                            } else {
                                statStructure[structure].nbIntExt[indiceMensuel]++;
                            }
                            break;
                        case 3:
                            if (!statStructure[structure].nbIntSco[indiceMensuel]) {
                                statStructure[structure].nbIntSco[indiceMensuel] = 1;
                            } else {
                                statStructure[structure].nbIntSco[indiceMensuel]++;
                            }
                            break;
                    }
                }
            })
            // fin boucle sur interventions

            // on parcourt les objets créés pour compléter et faire les calculs
            var clef = Object.keys(statStructure);
            clef.forEach(element => {
                // initialisation des mois "vides"
                for (var i = 0; i < labelsHisto.length; i++) {
                    if (!statStructure[element].nbAtt[i]) {
                        statStructure[element].nbAtt[i] = 0;
                    }
                    if (!statStructure[element].nbAttCumule[i]) {
                        statStructure[element].nbAttCumule[i] = 0;
                    }
                    if (!statStructure[element].nbIntBloc1[i]) {
                        statStructure[element].nbIntBloc1[i] = 0;
                    }
                    if (!statStructure[element].nbIntBloc2[i]) {
                        statStructure[element].nbIntBloc2[i] = 0;
                    }
                    if (!statStructure[element].nbIntBloc3[i]) {
                        statStructure[element].nbIntBloc3[i] = 0;
                    }
                    if (!statStructure[element].nbIntSco[i]) {
                        statStructure[element].nbIntSco[i] = 0;
                    }
                    if (!statStructure[element].nbIntExt[i]) {
                        statStructure[element].nbIntExt[i] = 0;
                    }
                    if (!statStructure[element].nbIntPer[i]) {
                        statStructure[element].nbIntPer[i] = 0;
                    }
                    // Calcul des interventions cumulees
                    if (i == 0) {
                        statStructure[element].nbAttCumule[i] = statStructure[element].nbAtt[i];
                    } else {
                        statStructure[element].nbAttCumule[i] = statStructure[element].nbAttCumule[i - 1] + statStructure[element].nbAtt[i];
                    }
                    statStructure['nationale'].nbIntBloc1[i] += statStructure[element].nbIntBloc1[i]
                    statStructure['nationale'].nbIntBloc2[i] += statStructure[element].nbIntBloc2[i]
                    statStructure['nationale'].nbIntBloc3[i] += statStructure[element].nbIntBloc3[i]
                    statStructure['nationale'].nbIntSco[i] += statStructure[element].nbIntSco[i]
                    statStructure['nationale'].nbIntPer[i] += statStructure[element].nbIntPer[i]
                    statStructure['nationale'].nbIntExt[i] += statStructure[element].nbIntExt[i]
                    statStructure['nationale'].nbAtt[i] += statStructure[element].nbAtt[i]
                }
                // Mise à jour des variables utilisés pour les doughnut chart
                if (element != 'nationale') {
                    for (var i = 0; i < 9; i++) {
                        statStructure['nationale'].IntParBlocParCadre[i] += statStructure[element].IntParBlocParCadre[i]
                        //on passe des valeurs absolues en pourcentage
                        statStructure[element].IntParBlocParCadre[i] = Math.round(
                            (statStructure[element].IntParBlocParCadre[i] / statStructure[element].nbInt) * 10000
                        ) / 100;
                    }
                    // alimentation de la structure "nationale"
                    // nombre d'intervention total
                    statStructure['nationale'].nbInt += statStructure[element].nbInt
                    // calcul des sommes nbBloc1, nbBloc2 et nbBloc3 
                    statStructure[element].nbBloc1 = statStructure[element].nbIntBloc1.reduce((pv, cv) => pv + cv, 0);
                    statStructure['nationale'].nbBloc1 += statStructure[element].nbBloc1
                    statStructure[element].nbBloc1Rel = Math.round(
                        (statStructure[element].nbBloc1 / statStructure[element].nbInt) * 10000
                    ) / 100;
                    statStructure[element].nbBloc2 = statStructure[element].nbIntBloc2.reduce((pv, cv) => pv + cv, 0);
                    statStructure['nationale'].nbBloc2 += statStructure[element].nbBloc2
                    statStructure[element].nbBloc2Rel = Math.round(
                        (statStructure[element].nbBloc2 / statStructure[element].nbInt) * 10000
                    ) / 100;
                    statStructure[element].nbBloc3 = statStructure[element].nbIntBloc3.reduce((pv, cv) => pv + cv, 0);
                    statStructure['nationale'].nbBloc3 += statStructure[element].nbBloc3
                    statStructure[element].nbBloc3Rel = Math.round(
                        (statStructure[element].nbBloc3 / statStructure[element].nbInt) * 10000
                    ) / 100;
                    statStructure[element].nbSco = statStructure[element].nbIntSco.reduce((pv, cv) => pv + cv, 0);
                    statStructure['nationale'].nbSco += statStructure[element].nbSco
                    statStructure[element].nbScoRel = Math.round(
                        (statStructure[element].nbSco / statStructure[element].nbInt) * 10000
                    ) / 100; statStructure
                    statStructure[element].nbPer = statStructure[element].nbIntPer.reduce((pv, cv) => pv + cv, 0);
                    statStructure['nationale'].nbPer += statStructure[element].nbPer
                    statStructure[element].nbPerRel = Math.round(
                        (statStructure[element].nbPer / statStructure[element].nbInt) * 10000
                    ) / 100;
                    statStructure[element].nbExt = statStructure[element].nbIntExt.reduce((pv, cv) => pv + cv, 0);
                    statStructure['nationale'].nbExt += statStructure[element].nbExt
                    statStructure[element].nbExtRel = Math.round(
                        (statStructure[element].nbExt / statStructure[element].nbInt) * 10000
                    ) / 100;
                }
            });

            // Mise à jour des variables "nationales" utilisés pour les doughnut chart
            for (var i = 0; i < 9; i++) {
                statStructure['nationale'].IntParBlocParCadre[i] = Math.round(
                    (statStructure['nationale'].IntParBlocParCadre[i] / statStructure['nationale'].nbInt) * 10000
                ) / 100;

            }
            statStructure['nationale'].nbAttCumule[0]=statStructure['nationale'].nbAtt[0]
            for (var i = 1; i < statStructure['nationale'].length; i++) {
                statStructure['nationale'].nbAttCumule[i]=statStructure['nationale'].nbAtt[i]+statStructure['nationale'].nbAttCumule[i-1]
            }
            statStructure['nationale'].nbBloc1Rel = Math.round(
                (statStructure['nationale'].nbBloc1 / statStructure['nationale'].nbInt) * 10000
            ) / 100;
            statStructure['nationale'].nbBloc2Rel = Math.round(
                (statStructure['nationale'].nbBloc2 / statStructure['nationale'].nbInt) * 10000
            ) / 100;
            statStructure['nationale'].nbBloc1Re3 = Math.round(
                (statStructure['nationale'].nbBloc3 / statStructure['nationale'].nbInt) * 10000
            ) / 100;
            statStructure['nationale'].nbScoRel = Math.round(
                (statStructure['nationale'].nbSco / statStructure['nationale'].nbInt) * 10000
            ) / 100; statStructure
            statStructure['nationale'].nbPerRel = Math.round(
                (statStructure['nationale'].nbPer / statStructure['nationale'].nbInt) * 10000
            ) / 100;
            statStructure['nationale'].nbExtRel = Math.round(
                (statStructure['nationale'].nbExt / statStructure['nationale'].nbInt) * 10000
            ) / 100;

            statStructure['nationale'].labelsHisto=labelsHisto
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