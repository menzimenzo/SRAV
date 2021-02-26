import _ from 'lodash';

export default {
    methods: {
        statCal: function (intervention, structures) {
                        let maStructureId = this.$store.state.utilisateurCourant.structureId;
            let labelsHisto = [];
            let DataToDisplay = [];
            let SubDataToDisplay = [];
            let LabelsToDisplay = [];
            let SubLabelsToDisplay = [];
            let nb = 0;
            let statStructure = {
                nationale: {
                    nbInt: 0,
                    nbAttestations: 0,
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
                    CouleurParDepartement: [],
                    CouleurParDepartementAdmin: [],
                },
                COM: {
                    nbInt: 0,
                    nbAttestations: 0,
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
                    CouleurParDepartement: [],
                    CouleurParDepartementAdmin: []
                },
                DEP: {
                    nbInt: 0,
                    nbAttestations: 0,
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
                    CouleurParDepartement: [],
                    CouleurParDepartementAdmin: []
                },
                EPCI: {
                    nbInt: 0,
                    nbAttestations: 0,
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
                    CouleurParDepartement: [],
                    CouleurParDepartementAdmin: []
                },
                MaStructure: {
                    nbInt: 0,
                    nbAttestations: 0,
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
                    CouleurParDepartement: [],
                    CouleurParDepartementAdmin: []
                }

            }
            for (var i = 0; i < 102; i++) {
                statStructure['nationale'].IntParDepartement[i] = 0
                statStructure['nationale'].CouleurParDepartementAdmin[i] = '#3f3f3f'
                statStructure['nationale'].CouleurParDepartement[i] = '#3f3f3f'
                statStructure['COM'].IntParDepartement[i] = 0
                statStructure['COM'].CouleurParDepartementAdmin[i] = '#3f3f3f'
                statStructure['COM'].CouleurParDepartement[i] = '#3f3f3f'
                statStructure['DEP'].IntParDepartement[i] = 0
                statStructure['DEP'].CouleurParDepartementAdmin[i] = '#3f3f3f'
                statStructure['DEP'].CouleurParDepartement[i] = '#3f3f3f'
                statStructure['EPCI'].IntParDepartement[i] = 0
                statStructure['EPCI'].CouleurParDepartementAdmin[i] = '#3f3f3f'
                statStructure['EPCI'].CouleurParDepartement[i] = '#3f3f3f'
                statStructure['MaStructure'].IntParDepartement[i] = 0
                statStructure['MaStructure'].CouleurParDepartementAdmin[i] = '#3f3f3f'
                statStructure['MaStructure'].CouleurParDepartement[i] = '#3f3f3f'
            }

            structures.forEach(element => {
                statStructure[element.str_libellecourt] = {
                    nbInt: 0,
                    nbAttestations: 0,
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
                    CouleurParDepartement: [],
                    CouleurParDepartementAdmin: [],
                }
                for (var i = 0; i < 102; i++) {
                    statStructure[element.str_libellecourt].IntParDepartement[i] = 0
                    statStructure[element.str_libellecourt].CouleurParDepartementAdmin[i] = '#3f3f3f'
                    statStructure[element.str_libellecourt].CouleurParDepartement[i] = '#3f3f3f'
                }
            })

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
                let structure = element.structureCode;
                let structureId = element.structureId;
                let indice = 0;
                let indiceMensuel = -1
                let indDepartement = 0

                // Si blocid = 3 alors il y a attestation
                if (blocId === 3) {
                    statStructure[structure].nbAttestations = statStructure[structure].nbAttestations + nbEnfants;
                    statStructure['nationale'].nbAttestations = statStructure['nationale'].nbAttestations + nbEnfants;
                    if (structureId == maStructureId) {
                        statStructure['MaStructure'].nbAttestations = statStructure['MaStructure'].nbAttestations + nbEnfants;
                    }
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
                            break;
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
                    // MAJ Nb intervention total par structure
                    statStructure[structure].nbInt++;
                    statStructure['nationale'].nbInt++;
                    if (structureId == maStructureId) {
                        statStructure['MaStructure'].nbInt++;
                    }

                    // calcul du nombre d'intervention par departement et par structure
                    statStructure[structure].IntParDepartement[indDepartement]++;
                    statStructure['nationale'].IntParDepartement[indDepartement]++;
                    if (structureId == maStructureId) {
                        statStructure['MaStructure'].IntParDepartement[indDepartement]++;
                    }

                    // MAJ du tableau des attestations
                    if (blocId === 3) {
                        nb = nb + nbEnfants
                        statStructure[structure].nbAtt[indiceMensuel] += nbEnfants;
                        statStructure['nationale'].nbAtt[indiceMensuel] += nbEnfants;
                        if (structureId == maStructureId) {
                            statStructure['MaStructure'].nbAtt[indiceMensuel] += nbEnfants;
                        }
                    }

                    // Mise a jour du tableau pour 1er cercle concentrique qui contient 3*3 élements 
                    indice = (blocId - 1) * 3 + cai - 1;
                    statStructure[structure].IntParBlocParCadre[indice]++;
                    statStructure['nationale'].IntParBlocParCadre[indice]++;
                    if (structureId == maStructureId) {
                        statStructure['MaStructure'].IntParBlocParCadre[indice]++;
                    }

                    // incrementation du tableau des etiquettes d'abscisses
                    if (mois < 10) {
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
                            if (structureId == maStructureId) {
                                statStructure['MaStructure'].nbIntBloc1[indiceMensuel]++;
                            }
                            break;
                        case 2:
                            statStructure[structure].nbIntBloc2[indiceMensuel]++;
                            statStructure['nationale'].nbIntBloc2[indiceMensuel]++;
                            if (structureId == maStructureId) {
                                statStructure['MaStructure'].nbIntBloc2[indiceMensuel]++;
                            }
                            break;
                        case 3:
                            statStructure[structure].nbIntBloc3[indiceMensuel]++;
                            statStructure['nationale'].nbIntBloc3[indiceMensuel]++;
                            if (structureId == maStructureId) {
                                statStructure['MaStructure'].nbIntBloc3[indiceMensuel]++;
                            }
                            break;
                    }
                    switch (cai) {
                        case 1:
                            statStructure[structure].nbIntPer[indiceMensuel]++;
                            statStructure['nationale'].nbIntPer[indiceMensuel]++
                            if (structureId == maStructureId) {
                                statStructure['MaStructure'].nbIntPer[indiceMensuel]++
                            }
                            break;
                        case 2:
                            statStructure[structure].nbIntExt[indiceMensuel]++;
                            statStructure['nationale'].nbIntExt[indiceMensuel]++
                            if (structureId == maStructureId) {
                                statStructure['MaStructure'].nbIntExt[indiceMensuel]++
                            }
                            break;
                        case 3:
                            statStructure[structure].nbIntSco[indiceMensuel]++;
                            statStructure['nationale'].nbIntSco[indiceMensuel]++;
                            if (structureId == maStructureId) {
                                statStructure['MaStructure'].nbIntSco[indiceMensuel]++
                            }
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
                if (statStructure[element].nbInt != 0) {
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
                        // choix de la couleur
                        switch (true) {
                            case ((statStructure[element].IntParDepartement[i] / statStructure[element].nbInt) * 100 > 12):
                                statStructure[element].CouleurParDepartement[i] = '#191970'
                                statStructure[element].CouleurParDepartementAdmin[i] = '#ff0000'
                                break;
                            case ((statStructure[element].IntParDepartement[i] / statStructure[element].nbInt) * 100 > 9):
                                statStructure[element].CouleurParDepartement[i] = '#4169E1'
                                statStructure[element].CouleurParDepartementAdmin[i] = '#d85454'
                                break;
                            case ((statStructure[element].IntParDepartement[i] / statStructure[element].nbInt) * 100 > 6):
                                statStructure[element].CouleurParDepartement[i] = '#318CE7'
                                statStructure[element].CouleurParDepartementAdmin[i] = '#f69696'
                                break;
                            case ((statStructure[element].IntParDepartement[i] / statStructure[element].nbInt) * 100 > 3):
                                statStructure[element].CouleurParDepartement[i] = '#77B5FE'
                                statStructure[element].CouleurParDepartementAdmin[i] = '#f7c3c3'
                                break;
                            case (statStructure[element].IntParDepartement[i] === 0):
                                statStructure[element].CouleurParDepartement[i] = '#3f3f3f' // =0
                                statStructure[element].CouleurParDepartementAdmin[i] = '#3f3f3f'
                                break;
                            case ((statStructure[element].IntParDepartement[i] / statStructure[element].nbInt) * 100 > 0): // +0
                                statStructure[element].CouleurParDepartement[i] = '#B0E0E6'
                                statStructure[element].CouleurParDepartementAdmin[i] = '#fbe5e5'
                                break;
                        }
                    }
                }
            });

            // 4 eme graphique
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
                    if (k != 'MaStructure') {
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
                    if (k != 'MaStructure') {
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
            }
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
            // sauvegarde du tableau des labels dans l'objet qui sera sauvegardé dans le store
            statStructure['nationale'].labelsHisto = labelsHisto
            statStructure['nationale'].data4 = this.data4
            this.$store.commit('set_statStructure', statStructure)
        }

    }
}