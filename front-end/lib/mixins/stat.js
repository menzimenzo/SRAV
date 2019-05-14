import _ from 'lodash'

export default {
    methods: {
        calcStat: function (intervention) {
            let NbIntBloc1 = [];
            let NbIntBloc2 = [];
            let NbIntBloc3 = [];
            let NbIntSco = [];
            let NbIntPer = [];
            let NbIntExt = [];
            let labelsHisto = [];
            let NbAtt = [];
            let NbAttCumule = [];
            let IntParBloc = [0, 0, 0];
            let IntParBlocParCadre = [0, 0, 0, 0, 0, 0, 0, 0, 0];
            let IntParStructure = {};
            let DataToDisplay = [];
            let SubDataToDisplay = [];
            let LabelsToDisplay = [];
            let SubLabelsToDisplay = [];
            let NbAttestations = 0;
            let NbIntervention = 0;
            let data1 = {};
            let data2 = {};
            let data3 = {};
            let data4 = {};
            let optionsHisto = {};
            let optionsDoughnut = {};
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
                // tous les tableaux sont indices sur indiceMensuel qui est à 12 qui est a 12 pour le mois courant
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
                    NbIntervention++
                    if (blocId === 3) {
                        if (!NbAtt[indiceMensuel]) {
                            NbAtt[indiceMensuel] = 0;
                        }
                        NbAtt[indiceMensuel] = NbAtt[indiceMensuel] + nbEnfants;
                    }
                    //G4
                    if (!IntParStructure[structure]) {
                        IntParStructure[structure] = {
                            total: 0,
                            bloc1: 0,
                            bloc2: 0,
                            bloc3: 0
                        };
                    }
                    IntParStructure[structure].total++;
                    //G2
                    IntParBloc[blocId - 1] = IntParBloc[blocId - 1] + 1;
                    indice = (blocId - 1) * 3 + cai - 1;
                    IntParBlocParCadre[indice] = IntParBlocParCadre[indice] + 1;
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
                            if (!NbIntBloc1[indiceMensuel]) {
                                NbIntBloc1[indiceMensuel] = 1;
                            } else {
                                NbIntBloc1[indiceMensuel]++;
                            }
                            IntParStructure[structure].bloc1++;
                            break;
                        case 2:
                            if (!NbIntBloc2[indiceMensuel]) {
                                NbIntBloc2[indiceMensuel] = 1;
                            } else {
                                NbIntBloc2[indiceMensuel]++;
                            }
                            IntParStructure[structure].bloc2++;
                            break;
                        case 3:
                            if (!NbIntBloc3[indiceMensuel]) {
                                NbIntBloc3[indiceMensuel] = 1;
                            } else {
                                NbIntBloc3[indiceMensuel]++;
                            }
                            IntParStructure[structure].bloc3++;
                            break;
                    }

                    switch (cai) {
                        case 1:
                            if (!NbIntSco[indiceMensuel]) {
                                NbIntSco[indiceMensuel] = 1;
                            } else {
                                NbIntSco[indiceMensuel]++;
                            }
                            break;
                        case 2:
                            if (!NbIntPer[indiceMensuel]) {
                                NbIntPer[indiceMensuel] = 1;
                            } else {
                                NbIntPer[indiceMensuel]++;
                            }
                            break;
                        case 3:
                            if (!NbIntExt[indiceMensuel]) {
                                NbIntExt[indiceMensuel] = 1;
                            } else {
                                NbIntExt[indiceMensuel]++;
                            }
                            break;
                    }
                }
            });
            for (var i = 0; i < labelsHisto.length; i++) {
                // initialisation des mois "vides"
                if (!NbAtt[i]) {
                    NbAtt[i] = 0;
                }
                if (!NbAttCumule[i]) {
                    NbAttCumule[i] = 0;
                }
                if (!NbIntBloc1[i]) {
                    NbIntBloc1[i] = 0;
                }
                if (!NbIntBloc2[i]) {
                    NbIntBloc2[i] = 0;
                }
                if (!NbIntBloc3[i]) {
                    NbIntBloc3[i] = 0;
                }
                if (!NbIntSco[i]) {
                    NbIntSco[i] = 0;
                }
                if (!NbIntExt[i]) {
                    NbIntExt[i] = 0;
                }
                if (!NbIntPer[i]) {
                    NbIntPer[i] = 0;
                }
                // Calcul des interventions cumulees
                if (i == 0) {
                    NbAttCumule[i] = NbAtt[i];
                } else {
                    NbAttCumule[i] = NbAttCumule[i - 1] + NbAtt[i];
                }
            }
            //on passe des valeurs absolues en pourcentage
            for (var i = 0; i < IntParBloc.length; i++) {
                IntParBloc[i] = Math.round((IntParBloc[i] / NbIntervention) * 100 * 100) / 100;
            }
            for (var i = 0; i < IntParBlocParCadre.length; i++) {
                IntParBlocParCadre[i] = Math.round(
                    (IntParBlocParCadre[i] / NbIntervention) * 10000
                ) / 100;
            }
            // Tri par ordre decroissant et regroupement des petites structures entre elles si trop nombreuses
            var keys = Object.keys(IntParStructure);
            keys.sort(function (a, b) {
                return IntParStructure[b].total - IntParStructure[a].total;
            });
            if (keys.length >= nbMaxStructureAffichees) {
                let nbAutre = { total: 0, bloc1: 0, bloc2: 0, bloc3: 0 };
                let i = 0;
                keys.forEach(function (k) {
                    i++;
                    if (i > nbMaxStructureAffichees) {
                        nbAutre.total = nbAutre.total + IntParStructure[k].total;
                        nbAutre.bloc1 = nbAutre.bloc1 + IntParStructure[k].bloc1;
                        nbAutre.bloc2 = nbAutre.bloc2 + IntParStructure[k].bloc2;
                        nbAutre.bloc3 = nbAutre.bloc3 + IntParStructure[k].bloc3;
                    } else {
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
                    }
                });
                DataToDisplay.push(
                    Math.round((nbAutre.total / NbIntervention) * 10000) / 100
                );
                SubDataToDisplay.push(
                    Math.round((nbAutre.bloc1 / NbIntervention) * 10000) / 100
                );
                SubDataToDisplay.push(
                    Math.round((nbAutre.bloc2 / NbIntervention) * 10000) / 100
                );
                SubDataToDisplay.push(
                    Math.round((nbAutre.bloc3 / NbIntervention) * 10000) / 100
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

            // Définition de l'objet Data envoyé au 1er graphique
            (this.data1 = {
                labels: labelsHisto,
                datasets: [
                    {
                        type: "line",
                        fill: false,
                        label: "Nb attestations",
                        pointBackgroundColor: "#444444",
                        borderColor: "#888888",
                        backgroundColor: "#888888",
                        yAxisID: "B",
                        data: NbAtt
                    },
                    {
                        label: "scolaire",
                        backgroundColor: "#E4FC2E",
                        yAxisID: "A",
                        data: NbIntSco
                    },
                    {
                        label: "péri-scolaire",
                        backgroundColor: "#29BF12",
                        yAxisID: "A",
                        data: NbIntPer
                    },
                    {
                        label: "extra scolaire",
                        backgroundColor: "#9543D8",
                        yAxisID: "A",
                        data: NbIntExt
                    }
                ]
            }),
                // Définition de l'objet Data envoyé au 2eme graphique
                (this.data2 = {
                    datasets: [
                        {
                            backgroundColor: ["#FF9914", "#F21B3F", "#08BDBD"],
                            data: [IntParBloc[0], IntParBloc[1], IntParBloc[2]],
                            labels: ["Bloc 1", "Bloc 2", "Bloc 3"]
                        },
                        {
                            backgroundColor: [
                                "#E4FC2E",
                                "#29BF12",
                                "#9543D8",
                                "#E4FC2E",
                                "#29BF12",
                                "#9543D8",
                                "#E4FC2E",
                                "#29BF12",
                                "#9543D8"
                            ],
                            labels: [
                                "Bloc 1 / scolaire",
                                "Bloc 1 / péri-scolaire",
                                "Bloc 1 / extra-scolaire",
                                "Bloc 2 / scolaire",
                                "Bloc 2 / péri-scolaire",
                                "Bloc 2 / extra-scolaire",
                                "Bloc 3 / scolaire",
                                "Bloc 3 / péri-scolaire",
                                "Bloc 3 / extra-scolaire"
                            ],
                            data: [
                                IntParBlocParCadre[0],
                                IntParBlocParCadre[1],
                                IntParBlocParCadre[2],
                                IntParBlocParCadre[3],
                                IntParBlocParCadre[4],
                                IntParBlocParCadre[5],
                                IntParBlocParCadre[6],
                                IntParBlocParCadre[7],
                                IntParBlocParCadre[8]
                            ]
                        }
                    ],
                    labels: ["Bloc 1", "Bloc 2", "Bloc 3"]
                }),
                // Définition de l'objet Data envoyé au 3eme graphique
                (this.data3 = {
                    labels: labelsHisto,
                    datasets: [
                        {
                            type: "line",
                            fill: false,
                            label: "Cumul attestations",
                            pointBackgroundColor: "#444444",
                            borderColor: "#888888",
                            backgroundColor: "#888888",
                            yAxisID: "B",
                            data: NbAttCumule
                        },
                        {
                            label: "bloc 1",
                            //backgroundColor: "#f9c34b",
                            backgroundColor: "#FF9914",
                            yAxisID: "A",
                            data: NbIntBloc1
                        },
                        {
                            label: "bloc 2",
                            backgroundColor: "#F21B3F",
                            //backgroundColor: "#d99694",
                            yAxisID: "A",
                            data: NbIntBloc2
                        },
                        {
                            label: "bloc 3",
                            //backgroundColor: "#6897cf",
                            backgroundColor: "#08BDBD",
                            yAxisID: "A",
                            data: NbIntBloc3
                        }
                    ]
                }),
                // Définition de l'objet Data envoyé au 4eme graphique
                (this.data4 = {
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
                });

            // Définition des options du 1er et 3eme grahiques
            this.optionsHisto = {
                responsive: true,
                maintainAspectRatio: true,
                legend: {
                    display: true
                },
                scales: {
                    xAxes: [
                        {
                            stacked: true,
                            categoryPercentage: 0.5,
                            barPercentage: 1
                        }
                    ],
                    yAxes: [
                        {
                            id: "A",
                            type: "linear",
                            display: true,
                            position: "left",
                            min: 0,
                            stacked: true
                        },
                        {
                            id: "B",
                            type: "linear",
                            position: "right",
                            min: 0
                        }
                    ]
                }
            };
            // Définition des options du 2eme et 4eme grahiques
            this.optionsDoughnut = {
                responsive: false,
                maintainAspectRatio: true,
                legend: {
                    position: "top",
                    onClick: function (e, legendItem) {
                        var ci = this.chart;
                        var bloc = ci.getDatasetMeta(0);
                        var cai = ci.getDatasetMeta(1);
                        if (bloc.data[legendItem.index].hidden) {
                            bloc.data[legendItem.index].hidden = false;
                            cai.data[3 * legendItem.index].hidden = false;
                            cai.data[3 * legendItem.index + 1].hidden = false;
                            cai.data[3 * legendItem.index + 2].hidden = false;
                        } else {
                            bloc.data[legendItem.index].hidden = true;
                            cai.data[3 * legendItem.index].hidden = true;
                            cai.data[3 * legendItem.index + 1].hidden = true;
                            cai.data[3 * legendItem.index + 2].hidden = true;
                        }
                        ci.update();
                    }
                },
                animation: {
                    animateScale: true,
                    animateRotate: true
                },
                tooltips: {
                    callbacks: {
                        label: function (tooltipItem, data) {
                            var dataset = data.datasets[tooltipItem.datasetIndex];
                            var index = tooltipItem.index;
                            return dataset.labels[index] + ": " + dataset.data[index] + "%";
                        }
                    }
                }
            };
        }
    }
}