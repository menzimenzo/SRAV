DROP FUNCTION IF EXISTS srav_ins_creationintervention(INTEGER, INTEGER);

CREATE OR REPLACE FUNCTION srav_ins_CreationIntervention(v_i_nb_util_creer INTEGER, v_i_nb_inter_creer INTEGER)
  RETURNS TEXT AS
$BODY$
DECLARE 


	-- Recherche de la liste de patronyme à créer
	cListePatronyme CURSOR FOR select nom
				from patronyme
				order by random()
				limit v_i_nb_util_creer + 1; 
	Patronyme RECORD;

	v_i_compteur_creation  BIGINT;
	v_i_nombre_aleatoire BIGINT;

	Sortie TEXT;
	t_uti_nom TEXT;
	t_uti_prenom TEXT;
	i_pro_id INTEGER;
	i_str_id INTEGER;
	i_stu_id INTEGER;
	t_uti_mail TEXT;
	b_validated BOOLEAN;
	t_uti_structurelocale TEXT;
	t_uti_tockenfranceconnect TEXT;

	-- Bloc d('ntevetion
	i_blo_id INTEGER;
	-- Cadre d'intervetion
	i_cai_id INTEGER;
	-- Statut dintervention 
	i_sin_id INTEGER;
	-- utilisateur
	i_uti_id INTEGER;
	-- Code Insee de la commune
	t_int_com_codeinsee TEXT;
	-- Code postal de la commune
	t_int_com_codepostal TEXT;
	-- Libellé de la commune 
	t_int_com_libelle TEXT;
	-- Nombre d'enfants
	i_int_nombreenfant INTEGER;
	-- nombre de filles
	i_int_nombrefille INTEGER;
	-- Nombre de garçons
	i_int_nombregarcon INTEGER;
	-- Nombre de moins de 6 ans
	i_int_nombremoinssix INTEGER;
	-- Nombre de moins 6-7-8
	i_int_nombresixhuit INTEGER;
	-- Nombre 9-10
	i_int_nombreneufdix INTEGER;
	-- Nombre plus de 10
	i_int_nombreplusdix INTEGER;
	-- Date d'intervention
	d_int_dateintervention DATE;
	-- Date creation 
	d_int_datecreation DATE;
	-- Date modification
	d_int_datemaj DATE;
	-- Numéro de département
	t_int_dep_num TEXT;
	-- Numéro de région
	t_int_reg_num TEXT;
	-- site d'intervnetion
	t_int_siteintervention TEXT;
	-- Relance Mail
	b_int_relancemail BOOLEAN;

	-- Nombre d'intervention pour l'utilisateur en cours
	i_nb_intervention INTEGER;
	i_nb_interventionparjour INTEGER;
	i_nb_interventiondujour INTEGER [];
	i_nbjours INTEGER;
	i_nbaleatintervention INTEGER;
	curseurUtilisateur INTEGER;
	

	i_nbtotalutilisateur INTEGER;
	i_nbtotalintervention INTEGER;
	i_nbintervention INTEGER;
	i_nbinterventionpourutilisateur INTEGER;

BEGIN
	i_nbtotalutilisateur := v_i_nb_util_creer;
	i_nbtotalintervention := v_i_nb_inter_creer;
	i_nbinterventionpourutilisateur  := random()*100;
	
	curseurUtilisateur  := 0;
	-- Création des utilisateur
	OPEN cListePatronyme;
	
	WHILE curseurUtilisateur < i_nbtotalutilisateur LOOP
		select prenom into t_uti_prenom from prenom order by random() limit 1;

		-- Optimisation
		--select nom into t_uti_nom from patronyme order by random() limit 1;
		FETCH cListePatronyme INTO Patronyme;
		t_uti_nom := Patronyme.nom;
		
		Sortie := 'Nom aléatoire : ' || t_uti_nom;
		RAISE NOTICE '%',Sortie;
		
		i_pro_id := 3;
		select str_id INTO i_str_id from structure where str_libellecourt <> 'DS' order by random();
		i_stu_id := 1; -- Actif
		t_uti_mail := t_uti_nom || '@' || t_uti_prenom || '.fr';
		b_validated := true;
		t_uti_structurelocale := null;
		t_uti_tockenfranceconnect := '';		
		INSERT INTO UTILISATEUR (pro_id,str_id,stu_id,validated,uti_mail,uti_nom,uti_prenom,uti_structurelocale,uti_tockenfranceconnect) 
		VALUES (i_pro_id,i_str_id,i_stu_id,b_validated,t_uti_mail,t_uti_nom,t_uti_prenom,t_uti_structurelocale,t_uti_tockenfranceconnect);
		curseurUtilisateur := curseurUtilisateur +1 ;
		Sortie := 'Création utilisateur : ' || curseurUtilisateur;
		RAISE NOTICE '%',Sortie;
	END LOOP ;

	CLOSE cListePatronyme;

	i_nb_intervention := 0;
	i_nbjours := 1;
	Sortie := 'Cumul i_nb_intervention : ' || i_nb_intervention;
	RAISE NOTICE '%',Sortie;

	WHILE (i_nb_intervention < v_i_nb_inter_creer) LOOP

		Sortie := 'Ajout Nb Inter sur jour : ' || i_nbjours;
		i_nbaleatintervention := round(random()*20)+1;
		Sortie := 'Nombre d''intervention pour le jour : ' || i_nbaleatintervention;
		-- RAISE NOTICE '%',Sortie;
		
		-- Par défaut la valeur est "null", il faut donc l'initialisée si ce n'est pas le cas (premier tour)
		if i_nb_interventiondujour[i_nbjours] is null then
			i_nb_interventiondujour[i_nbjours] = 0;
		end if;
		i_nb_interventiondujour[i_nbjours] := i_nb_interventiondujour[i_nbjours] + i_nbaleatintervention;

		Sortie := 'Nombre d''intervention pour le jour CUMUL Jour : ' || i_nb_interventiondujour[i_nbjours];
		-- RAISE NOTICE '%',Sortie;
		-- On cumule le nombre d'intervention total sur 2 ans
		i_nb_intervention := i_nb_intervention + i_nbaleatintervention;
		Sortie := 'Cumul i_nb_intervention : ' || i_nb_intervention;
		-- RAISE NOTICE '%',Sortie;
		-- On passe au jour suivant
		i_nbjours := i_nbjours + 1;
		-- Si on dépasse les deux ans et qu'on a pas atteind le quota de  15000 intervention on reboucle sur le premier jour
		if i_nbjours > 365 * 2 then
			i_nbjours := 1;
		end if;
		Sortie := 'Création intervention : ' || i_nb_intervention;
		RAISE NOTICE '%',Sortie;
		
	END LOOP;
	Sortie := 'Nombre d''intervention total sur 2 ans: ' || i_nb_intervention;
	--RAISE NOTICE '%',Sortie;

	-- Initialisation de la date de création
	d_int_datecreation := date '2019-04-01';
	Sortie := 'd_int_datecreation : ' || d_int_datecreation;
	RAISE NOTICE '%',Sortie;

	-- Parcours de chaque jour 
	FOR i_nbjours IN 1..365*2 LOOP
		Sortie := 'Jour ' || i_nbjours;
		RAISE NOTICE '%',Sortie;
		Sortie := 'Jour ' || i_nbjours || ' : ' || i_nb_interventiondujour[i_nbjours] || ' interventions';
		RAISE NOTICE '%',Sortie;

		FOR i_nbutilisateur IN 1..i_nb_interventiondujour[i_nbjours] LOOP
			select uti_id into i_uti_id from utilisateur where pro_id = 3 order by random() limit 1;

			select round(random()*2)+1  INTO i_blo_id;
			Sortie := 'i_blo_id : ' || i_blo_id;
			-- RAISE NOTICE '%',Sortie;

			select round(random()*2)+1  INTO i_cai_id;
			Sortie := 'i_cai_id : ' || i_cai_id;
			-- RAISE NOTICE '%',Sortie;

			i_sin_id := null;
			--i_uti_id 
			select reg_num INTO t_int_reg_num from region order by random() limit 1;
			Sortie := 't_int_reg_num  : ' || t_int_reg_num ;
			-- RAISE NOTICE '%',Sortie;

			select dep_num INTO t_int_dep_num from departement where reg_num = t_int_reg_num;
			Sortie := 't_int_dep_num  : ' || t_int_dep_num ;
			-- RAISE NOTICE '%',Sortie;

			select commune.cpi_codeinsee, codepostal_insee.cpi_codepostal, commune.com_libelle  
				INTO t_int_com_codeinsee, t_int_com_codepostal, t_int_com_libelle 
				from commune 
					inner join codepostal_insee on  commune.cpi_codeinsee = codepostal_insee.cpi_codeinsee 
				where dep_num = '' || t_int_dep_num || '' 
				order by random() limit 1;
			Sortie := 'int_com_codeinsee : ' || t_int_com_codeinsee;
			-- RAISE NOTICE '%',Sortie;
			Sortie := 'int_com_codepostal : ' || t_int_com_codepostal;
			-- RAISE NOTICE '%',Sortie;
			Sortie := 'int_com_libelle  : ' || t_int_com_libelle ;
			-- RAISE NOTICE '%',Sortie;

			i_int_nombreenfant := round(random()*100)+1;
			Sortie := 'i_int_nombreenfant  : ' || i_int_nombreenfant ;
			-- RAISE NOTICE '%',Sortie;

			i_int_nombrefille := round(random()*i_int_nombreenfant)+1;
			Sortie := 'i_int_uti_nombrefille : ' || i_int_nombrefille;
			-- RAISE NOTICE '%',Sortie;

			i_int_nombregarcon := i_int_nombreenfant- i_int_nombrefille;
			Sortie := 'i_int_uti_nombregarcon : ' || i_int_nombregarcon;
			-- RAISE NOTICE '%',Sortie;

			i_int_nombremoinssix := round(random()* i_int_nombreenfant);
			Sortie := 'i_int_uti_nombremoinssix : ' || i_int_nombremoinssix;
			-- RAISE NOTICE '%',Sortie;

			i_int_nombresixhuit := round(random()*(i_int_nombreenfant - i_int_nombremoinssix));
			Sortie := 'i_int_uti_nombresixhuit : ' || i_int_nombresixhuit;
			-- RAISE NOTICE '%',Sortie;

			i_int_nombreneufdix := round(random()*(i_int_nombreenfant - i_int_nombresixhuit - i_int_nombremoinssix));

			i_int_nombreplusdix := i_int_nombreenfant - i_int_nombremoinssix - i_int_nombresixhuit - i_int_nombreneufdix;
			Sortie := 'i_int_uti_nombreplusdix : ' || i_int_nombreplusdix;
			-- RAISE NOTICE '%',Sortie;
			
		/*
			select date '2018-01-01' + interval '10 day' into d_int_datecreation;
			Sortie := 'd_int_datecreation : ' || d_int_datecreation;
			RAISE NOTICE '%',Sortie;
		*/
			d_int_dateintervention := d_int_datecreation;
			Sortie := 'd_int_dateintervention : ' || d_int_dateintervention;
			-- RAISE NOTICE '%',Sortie;
			--select date d_int_datecreation + interval || round(random()*10) || ' day' into d_int_dateintervention;
			d_int_datemaj := d_int_dateintervention;
			Sortie := 'd_int_datemaj : ' || d_int_datemaj;
			-- RAISE NOTICE '%',Sortie;
			t_int_siteintervention := null;
			
			b_int_relancemail := round(random());
			Sortie := 'b_int_relancemail : ' || b_int_relancemail;
			-- RAISE NOTICE '%',Sortie;	

			INSERT INTO INTERVENTION (blo_id,
						cai_id ,
						sin_id ,
						uti_id ,
						int_com_codeinsee ,
						int_com_codepostal ,
						int_com_libelle ,
						int_nombreenfant ,
						int_nombrefille ,
						int_nombregarcon ,
						int_nombremoinssix ,
						int_nombresixhuit ,
						int_nombreneufdix,
						int_nombreplusdix ,
						int_dateintervention ,
						int_datecreation ,
						int_datemaj ,
						int_dep_num ,
						int_reg_num ,
						int_siteintervention ,
						int_relancemail)
					VALUES (i_blo_id,
						i_cai_id ,
						i_sin_id ,
						i_uti_id ,
						'' || t_int_com_codeinsee || '' ,
						'' || t_int_com_codepostal  || '',
						'' || t_int_com_libelle  || '',
						i_int_nombreenfant ,
						i_int_nombrefille ,
						i_int_nombregarcon ,
						i_int_nombremoinssix ,
						i_int_nombresixhuit ,
						i_int_nombreneufdix ,
						i_int_nombreplusdix ,
						d_int_dateintervention ,
						d_int_datecreation ,
						d_int_datemaj ,
						'' || t_int_dep_num  || '',
						'' || t_int_reg_num  || '',
						t_int_siteintervention ,
						b_int_relancemail::integer);
		END LOOP;

		-- On passe au jour suivant
		select d_int_datecreation + interval '1 day' into d_int_datecreation;
		Sortie := 'd_int_datecreation : ' || d_int_datecreation;
		-- RAISE NOTICE '%',Sortie;
	
	END LOOP;

	RETURN 'Opération terminée avec succès';
END;
$BODY$
  LANGUAGE plpgsql VOLATILE;

--select srav_ins_CreationIntervention(35,1500);

--drop table if exists prenom;
--drop table if exists patronyme;
--DROP FUNCTION IF EXISTS srav_ins_creationintervention(INTEGER, INTEGER);