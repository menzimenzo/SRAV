import _ from 'lodash';
import { templateStat } from '../helpers.js'

export default {
    methods: {
        statCal: function (interventions, structures) {
            let maStructureId = this.$store.state.utilisateurCourant.structureId;
            let labelsHisto = [];
            let DataToDisplay = [];
            let SubDataToDisplay = [];
            let LabelsToDisplay = [];
            let SubLabelsToDisplay = [];
            let nb = 0;
            let statStructure = {}

            Object.assign(statStructure, { 
                nationale: JSON.parse(JSON.stringify(templateStat)),
                COM: JSON.parse(JSON.stringify(templateStat)),
                DEP: JSON.parse(JSON.stringify(templateStat)),
                EPCI: JSON.parse(JSON.stringify(templateStat))
            })            
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
                }
                
            structures.forEach(structure => {
                if(structure.str_id == maStructureId) {
                    statStructure["MaStructure"] = JSON.parse(JSON.stringify(templateStat)) 
                    for (var i = 0; i < 102; i++) {
                        statStructure['MaStructure'].IntParDepartement[i] = 0
                        statStructure['MaStructure'].CouleurParDepartementAdmin[i] = '#3f3f3f'
                        statStructure['MaStructure'].CouleurParDepartement[i] = '#3f3f3f'
                    }
                               
                } 
                statStructure[structure.str_libellecourt] = JSON.parse(JSON.stringify(templateStat))
                for (var i = 0; i < 102; i++) {
                    statStructure[structure.str_libellecourt].IntParDepartement[i] = 0
                    statStructure[structure.str_libellecourt].CouleurParDepartementAdmin[i] = '#3f3f3f'
                    statStructure[structure.str_libellecourt].CouleurParDepartement[i] = '#3f3f3f'
                }
            })

            // nb de structures affichées sur le 4eme graphique.
            // S'il y a plus de nbMaxStructureAffichees structures on affiches les nbMaxStructureAffichees premieres + "Autres"
            const nbMaxStructureAffichees = 7;
            const today = new Date();
            const moisCourant = Number(today.getMonth()) + 1;
            const anneeCourant = Number(today.getYear());
            
            /* ===== INTERVENTIONS ===== */
            interventions.forEach(intervention => {
                const mois = Number(intervention.dateIntervention.getMonth()) + 1;
                const annee = Number(intervention.dateIntervention.getYear());
                const blocId = Number(intervention.blocId);
                const nbEnfants = Number(intervention.nbEnfants);
                const departement = intervention.departement
                const cai = Number(intervention.cai);
                const structure = intervention.structureCode;
                const structureId = intervention.structureId
                let indice = 0;
                let indiceMensuel = -1
                let indDepartement = 0

                /* ===  PREPARATION DES INDICES === */
                // tous les tableaux sont indicés sur indiceMensuel qui est a 12 pour le mois courant et 0 pour le même mois l'année dernière
                // sur l'année d'avant on ne prend que les mois à venir
                if ((anneeCourant - annee) === 1 && (mois - moisCourant) >= 0) {
                    indiceMensuel = mois - moisCourant;
                }
                else {
                    // on ne calcule pas l'indice si l'interventions a eu lieu  plus de 12 mois auparavant
                    indiceMensuel = (annee - anneeCourant + 1) * 12 + (mois - moisCourant);
                }
                // on ne garde que les interventions dans [dateDuJour - 12 mois; dateDuJour + 2 mois]
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

                    /* === MISE A JOUR DES DONNEES VISIBLES === */
                    // Nb interventions total par structure
                    statStructure[structure].nbInt++
                    statStructure['nationale'].nbInt++
                    // calcul du nombre d'interventions par departement et par structure
                    statStructure[structure].IntParDepartement[indDepartement]++;
                    statStructure['nationale'].IntParDepartement[indDepartement]++;
                    if (structureId == maStructureId) {
                        statStructure['MaStructure'].IntParDepartement[indDepartement]++;
                    }

                    // MAJ du tableau des attestations
                    // Si blocid = 3 alors il y a attestation
                    if (blocId === 3) {
                        nb = nb + nbEnfants
                        statStructure[structure].nbAtt[indiceMensuel] += nbEnfants;
                        statStructure['nationale'].nbAtt[indiceMensuel] += nbEnfants;
                        statStructure[structure].nbAttestations =statStructure[structure].nbAttestations + nbEnfants;
                        statStructure['nationale'].nbAttestations =statStructure['nationale'].nbAttestations + nbEnfants;
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
            /* =====  FIN DE LA BOUCLE SUR LERS INTERVENTIONS ===== */

            /* ==== PARCOURS DES OBJETS CREES ET COMPLETION DES CHIFFRES MANQUANTS ==== */
            const keys = Object.keys(statStructure);
            keys.forEach(structure => {
                // Calcul des interventions cumulees
                for (var i = 0; i < 15; i++) {
                    statStructure[structure].nbAttCumule[i] = (i == 0) ? statStructure[structure].nbAtt[i] : statStructure[structure].nbAttCumule[i - 1] + statStructure[structure].nbAtt[i];
                }
                if (statStructure[structure].nbInt === 0)  {
                    return 
                } else {
                    // Mise à jour des variables utilisés pour les doughnut chart
                    for (var i = 0; i < 9; i++) {
                        //on passe des valeurs absolues en pourcentage
                        statStructure[structure].IntParBlocParCadre[i] = Math.round(
                            (statStructure[structure].IntParBlocParCadre[i] / statStructure[structure].nbInt) * 10000
                        ) / 100;
                    }
                }

                // calcul des sommes nbBloc1, nbBloc2 et nbBloc3 et de leur valeur relative (%)
                statStructure[structure].nbBloc1 = statStructure[structure].nbIntBloc1.reduce((pv, cv) => pv + cv, 0);
                statStructure[structure].nbBloc1Rel = Math.round(
                    (statStructure[structure].nbBloc1 / statStructure[structure].nbInt) * 10000
                ) / 100;
                statStructure[structure].nbBloc2 = statStructure[structure].nbIntBloc2.reduce((pv, cv) => pv + cv, 0);
                statStructure[structure].nbBloc2Rel = Math.round(
                    (statStructure[structure].nbBloc2 / statStructure[structure].nbInt) * 10000
                ) / 100;
                statStructure[structure].nbBloc3 = statStructure[structure].nbIntBloc3.reduce((pv, cv) => pv + cv, 0);
                statStructure[structure].nbBloc3Rel = Math.round(
                    (statStructure[structure].nbBloc3 / statStructure[structure].nbInt) * 10000
                ) / 100;
                statStructure[structure].nbSco = statStructure[structure].nbIntSco.reduce((pv, cv) => pv + cv, 0);
                statStructure[structure].nbScoRel = Math.round(
                    (statStructure[structure].nbSco / statStructure[structure].nbInt) * 10000
                ) / 100;
                statStructure[structure].nbPer = statStructure[structure].nbIntPer.reduce((pv, cv) => pv + cv, 0);
                statStructure[structure].nbPerRel = Math.round(
                    (statStructure[structure].nbPer / statStructure[structure].nbInt) * 10000
                ) / 100;
                statStructure[structure].nbExt = statStructure[structure].nbIntExt.reduce((pv, cv) => pv + cv, 0);
                statStructure[structure].nbExtRel = Math.round(
                    (statStructure[structure].nbExt / statStructure[structure].nbInt) * 10000
                ) / 100;

                // initialisation du nombre d'int par département pour la choroplethe
                for (var i = 0; i < 102; i++) {
                    // choix de la couleur
                    const relative = (statStructure[structure].IntParDepartement[i] / statStructure[structure].nbInt) * 100
                    switch (true) {
                        case (relative  > 12):
                            statStructure[structure].CouleurParDepartement[i] = '#191970'
                            statStructure[structure].CouleurParDepartementAdmin[i] = '#ff0000'
                            break;
                        case (relative  > 9):
                            statStructure[structure].CouleurParDepartement[i] = '#4169E1'
                            statStructure[structure].CouleurParDepartementAdmin[i] = '#d85454'
                            break;
                        case (relative  > 6):
                            statStructure[structure].CouleurParDepartement[i] = '#318CE7'
                            statStructure[structure].CouleurParDepartementAdmin[i] = '#f69696'
                            break;
                        case (relative  > 3):
                            statStructure[structure].CouleurParDepartement[i] = '#77B5FE'
                            statStructure[structure].CouleurParDepartementAdmin[i] = '#f7c3c3'
                            break;
                        case (statStructure[structure].IntParDepartement[i] === 0):
                            statStructure[structure].CouleurParDepartement[i] = '#3f3f3f' // =0
                            statStructure[structure].CouleurParDepartementAdmin[i] = '#3f3f3f'
                            break;
                        case (relative  > 0): // +0
                            statStructure[structure].CouleurParDepartement[i] = '#B0E0E6'
                            statStructure[structure].CouleurParDepartementAdmin[i] = '#fbe5e5'
                            break;
                    }
                }
            });
            /* ===== FIN DES TRANSFORMATIONS ===== */

            /* ===== 4eme GRAPHIQUE, VISIBLE SEULEMENT POUR LES ADMIN ===== */
            // On enleve la structure nationale
            keys.splice(0, 1)
            // Tri par ordre decroissant et regroupement des petites structures entre elles si trop nombreuses
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
                                ) / 100,
                                Math.round(
                                    (Number(statStructure[k].nbBloc2) / statStructure['nationale'].nbInt) * 10000
                                ) / 100,
                                Math.round(
                                    (Number(statStructure[k].nbBloc3) / statStructure['nationale'].nbInt) * 10000
                                ) / 100
                            );
                            LabelsToDisplay.push(k);
                            SubLabelsToDisplay.push(k + " / bloc 1", k + " / bloc 2", k + " / bloc 3");
                        }
                    }
                });
                DataToDisplay.push(
                    Math.round((nbAutre.nbInt / statStructure['nationale'].nbInt) * 10000) / 100
                );
                SubDataToDisplay.push(
                    Math.round((nbAutre.nbBloc1 / statStructure['nationale'].nbInt) * 10000) / 100,
                    Math.round((nbAutre.nbBloc2 / statStructure['nationale'].nbInt) * 10000) / 100,
                    Math.round((nbAutre.nbBloc3 / statStructure['nationale'].nbInt) * 10000) / 100
                );
                LabelsToDisplay.push("Autre");
                SubLabelsToDisplay.push("Autre / bloc 1", "Autre / bloc 2", "Autre / bloc 3");
            } else {
                keys.forEach(function (k) {
                    if (k != 'MaStructure') {
                        DataToDisplay.push(
                            Math.round(
                                (Number(statStructure[structure].nbInt) / statStructure['nationale'].nbInt) * 10000
                            ) / 100
                        );
                        SubDataToDisplay.push(
                            Math.round(
                                (Number(statStructure[structure].nbBloc1) / statStructure['nationale'].nbInt) * 10000
                            ) / 100,
                            Math.round(
                                (Number(statStructure[structure].nbBloc2) / statStructure['nationale'].nbInt) * 10000
                            ) / 100,
                            Math.round(
                                (Number(statStructure[structure].nbBloc3) / statStructure['nationale'].nbInt) * 10000
                            ) / 100
                        );
                        LabelsToDisplay.push(structure);
                        SubLabelsToDisplay.push(structure + " / bloc 1", structure + " / bloc 2", structure + " / bloc 3");
                    }
                });
            }
            // Définition de l'objet Data envoyé au 4eme graphique
            const data4 = {
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
            /* ===== Fin de la génération du 4ème graphique ===== */
            // sauvegarde du tableau des labels dans l'objet qui sera sauvegardé dans le store
            statStructure['nationale'].labelsHisto = labelsHisto
            statStructure['nationale'].data4 = data4
            this.$store.commit('set_statStructure', statStructure)
        }
    }
}