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

/*
-- Données de test pour peupler la cartographie
insert into utilisateur  (PRO_ID,STR_ID,STU_ID,VALIDATED,PWD_VALIDATED,UTI_MAIL,UTI_PWD,UTI_NOM,UTI_PRENOM,UTI_TOCKENFRANCECONNECT,UTI_AUTORISEPUBLICARTE,UTI_MAILCONTACT,UTI_SITEWEB,UTI_ADRESSE,UTI_COMPLEMENTADRESSE,UTI_COM_CODEPOSTAL,UTI_COM_CODEINSEE,UTI_TELEPHONE) values (3,1,1,true::boolean,true,'cuffallurux-1126@yopmail.com','','Hugo','Jean-Michel','',true,'cuffallurux-1126@yopmail.com','https://fr.wikipedia.org/wiki/Google','4 Rue des Chauffours','','95000','95127','905073022');
insert into utilisateur  (PRO_ID,STR_ID,STU_ID,VALIDATED,PWD_VALIDATED,UTI_MAIL,UTI_PWD,UTI_NOM,UTI_PRENOM,UTI_TOCKENFRANCECONNECT,UTI_AUTORISEPUBLICARTE,UTI_MAILCONTACT,UTI_SITEWEB,UTI_ADRESSE,UTI_COMPLEMENTADRESSE,UTI_COM_CODEPOSTAL,UTI_COM_CODEINSEE,UTI_TELEPHONE) values (3,2,1,true,true,'mocaddissat-1778@yopmail.com','','Jacquard','Hugo','',true,'mocaddissat-1778@yopmail.com','https://fr.wikipedia.org/wiki/YouTube','4 Rue Avec Dodane','','84500','84019','951300225');
insert into utilisateur  (PRO_ID,STR_ID,STU_ID,VALIDATED,PWD_VALIDATED,UTI_MAIL,UTI_PWD,UTI_NOM,UTI_PRENOM,UTI_TOCKENFRANCECONNECT,UTI_AUTORISEPUBLICARTE,UTI_MAILCONTACT,UTI_SITEWEB,UTI_ADRESSE,UTI_COMPLEMENTADRESSE,UTI_COM_CODEPOSTAL,UTI_COM_CODEINSEE,UTI_TELEPHONE) values (3,3,1,true,true,'efurralenni-3927@yopmail.com','','Féret','Zacharie','',true,'efurralenni-3927@yopmail.com','https://fr.wikipedia.org/wiki/Baidu','12 route de montreuil ','','93230','93063','384754221');
insert into utilisateur  (PRO_ID,STR_ID,STU_ID,VALIDATED,PWD_VALIDATED,UTI_MAIL,UTI_PWD,UTI_NOM,UTI_PRENOM,UTI_TOCKENFRANCECONNECT,UTI_AUTORISEPUBLICARTE,UTI_MAILCONTACT,UTI_SITEWEB,UTI_ADRESSE,UTI_COMPLEMENTADRESSE,UTI_COM_CODEPOSTAL,UTI_COM_CODEINSEE,UTI_TELEPHONE) values (3,4,1,true,true,'himehavudd-4252@yopmail.com','','Philidor','Godefroy','',true,'himehavudd-4252@yopmail.com','https://fr.wikipedia.org/wiki/Facebook','150 Sentier des Vaux de Rome,','','94800','94081','114545454');
insert into utilisateur  (PRO_ID,STR_ID,STU_ID,VALIDATED,PWD_VALIDATED,UTI_MAIL,UTI_PWD,UTI_NOM,UTI_PRENOM,UTI_TOCKENFRANCECONNECT,UTI_AUTORISEPUBLICARTE,UTI_MAILCONTACT,UTI_SITEWEB,UTI_ADRESSE,UTI_COMPLEMENTADRESSE,UTI_COM_CODEPOSTAL,UTI_COM_CODEINSEE,UTI_TELEPHONE) values (3,5,1,true,true,'onnerirrass-3798@yopmail.com','','Picard','Rémy','',true,'onnerirrass-3798@yopmail.com','https://fr.wikipedia.org/wiki/Reddit','1 Impasse de Vanves','','92240','92046','414545578');
insert into utilisateur  (PRO_ID,STR_ID,STU_ID,VALIDATED,PWD_VALIDATED,UTI_MAIL,UTI_PWD,UTI_NOM,UTI_PRENOM,UTI_TOCKENFRANCECONNECT,UTI_AUTORISEPUBLICARTE,UTI_MAILCONTACT,UTI_SITEWEB,UTI_ADRESSE,UTI_COMPLEMENTADRESSE,UTI_COM_CODEPOSTAL,UTI_COM_CODEINSEE,UTI_TELEPHONE) values (3,6,1,true,true,'hemmaddepid-2906@yopmail.com','','Boulanger','Gabriel','',true,'hemmaddepid-2906@yopmail.com','https://fr.wikipedia.org/wiki/Yahoo!','12 Mail des Copistes','','95220','95306','454545484');
insert into utilisateur  (PRO_ID,STR_ID,STU_ID,VALIDATED,PWD_VALIDATED,UTI_MAIL,UTI_PWD,UTI_NOM,UTI_PRENOM,UTI_TOCKENFRANCECONNECT,UTI_AUTORISEPUBLICARTE,UTI_MAILCONTACT,UTI_SITEWEB,UTI_ADRESSE,UTI_COMPLEMENTADRESSE,UTI_COM_CODEPOSTAL,UTI_COM_CODEINSEE,UTI_TELEPHONE) values (3,7,1,true,true,'axomalliss-5675@yopmail.com','','Rossignol','Mathieu','',true,'axomalliss-5675@yopmail.com','https://fr.wikipedia.org/wiki/Google','113 Avenue de France','','75013','75113','5454165465');
insert into utilisateur  (PRO_ID,STR_ID,STU_ID,VALIDATED,PWD_VALIDATED,UTI_MAIL,UTI_PWD,UTI_NOM,UTI_PRENOM,UTI_TOCKENFRANCECONNECT,UTI_AUTORISEPUBLICARTE,UTI_MAILCONTACT,UTI_SITEWEB,UTI_ADRESSE,UTI_COMPLEMENTADRESSE,UTI_COM_CODEPOSTAL,UTI_COM_CODEINSEE,UTI_TELEPHONE) values (3,8,1,true,true,'qymavudoppe-8747@yopmail.com','','Pasquier','Kévin','',true,'qymavudoppe-8747@yopmail.com','https://fr.wikipedia.org/wiki/Tencent_QQ','Rue des Montagnards','','60740','60589','026525+65');
insert into utilisateur  (PRO_ID,STR_ID,STU_ID,VALIDATED,PWD_VALIDATED,UTI_MAIL,UTI_PWD,UTI_NOM,UTI_PRENOM,UTI_TOCKENFRANCECONNECT,UTI_AUTORISEPUBLICARTE,UTI_MAILCONTACT,UTI_SITEWEB,UTI_ADRESSE,UTI_COMPLEMENTADRESSE,UTI_COM_CODEPOSTAL,UTI_COM_CODEINSEE,UTI_TELEPHONE) values (3,8,1,true,true,'saherrojen-2708@yopmail.com','','Baudet','Jean-François','',true,'saherrojen-2708@yopmail.com','https://fr.wikipedia.org/wiki/Amazon.com','Avenue Pierre Mendès France','Centre commercial Auchan','45140','45285','1362512121');
insert into utilisateur  (PRO_ID,STR_ID,STU_ID,VALIDATED,PWD_VALIDATED,UTI_MAIL,UTI_PWD,UTI_NOM,UTI_PRENOM,UTI_TOCKENFRANCECONNECT,UTI_AUTORISEPUBLICARTE,UTI_MAILCONTACT,UTI_SITEWEB,UTI_ADRESSE,UTI_COMPLEMENTADRESSE,UTI_COM_CODEPOSTAL,UTI_COM_CODEINSEE,UTI_TELEPHONE) values (3,8,1,true,true,'wihegoppor-5441@yopmail.com','', 'Stuart','Élisabeth','',true,'wihegoppor-5441@yopmail.com','https://fr.wikipedia.org/wiki/Taobao','Za La Carbonniere','','76360','76057','65656566');
insert into utilisateur  (PRO_ID,STR_ID,STU_ID,VALIDATED,PWD_VALIDATED,UTI_MAIL,UTI_PWD,UTI_NOM,UTI_PRENOM,UTI_TOCKENFRANCECONNECT,UTI_AUTORISEPUBLICARTE,UTI_MAILCONTACT,UTI_SITEWEB,UTI_ADRESSE,UTI_COMPLEMENTADRESSE,UTI_COM_CODEPOSTAL,UTI_COM_CODEINSEE,UTI_TELEPHONE) values (3,7,1,true,true,'mitaheqyq-5294@yopmail.com','', 'Auberjonois','Annie','',true,'mitaheqyq-5294@yopmail.com','https://fr.wikipedia.org/wiki/Twitter','3 Rue du Moulin','','35135','35055','4545454');
insert into utilisateur  (PRO_ID,STR_ID,STU_ID,VALIDATED,PWD_VALIDATED,UTI_MAIL,UTI_PWD,UTI_NOM,UTI_PRENOM,UTI_TOCKENFRANCECONNECT,UTI_AUTORISEPUBLICARTE,UTI_MAILCONTACT,UTI_SITEWEB,UTI_ADRESSE,UTI_COMPLEMENTADRESSE,UTI_COM_CODEPOSTAL,UTI_COM_CODEINSEE,UTI_TELEPHONE) values (3,6,1,true,true,'foloxahi-0526@yopmail.com','', 'Devereux','Anaïs','',true,'foloxahi-0526@yopmail.com','https://fr.wikipedia.org/wiki/Tmall','','','22950','22360','026525+65');
insert into utilisateur  (PRO_ID,STR_ID,STU_ID,VALIDATED,PWD_VALIDATED,UTI_MAIL,UTI_PWD,UTI_NOM,UTI_PRENOM,UTI_TOCKENFRANCECONNECT,UTI_AUTORISEPUBLICARTE,UTI_MAILCONTACT,UTI_SITEWEB,UTI_ADRESSE,UTI_COMPLEMENTADRESSE,UTI_COM_CODEPOSTAL,UTI_COM_CODEINSEE,UTI_TELEPHONE) values (3,5,1,true,true,'evanigor-9906@yopmail.com','','Dior','Océane ','',true,'evanigor-9906@yopmail.com','https://fr.wikipedia.org/wiki/Google','Pôle D''Activités De La Galoterie, ','','14100','14366','5265256');
insert into utilisateur  (PRO_ID,STR_ID,STU_ID,VALIDATED,PWD_VALIDATED,UTI_MAIL,UTI_PWD,UTI_NOM,UTI_PRENOM,UTI_TOCKENFRANCECONNECT,UTI_AUTORISEPUBLICARTE,UTI_MAILCONTACT,UTI_SITEWEB,UTI_ADRESSE,UTI_COMPLEMENTADRESSE,UTI_COM_CODEPOSTAL,UTI_COM_CODEINSEE,UTI_TELEPHONE) values (3,4,1,true,true,'peqarehyl-4677@yopmail.com','', 'Courvoisier','Clothilde','',true,'peqarehyl-4677@yopmail.com','https://fr.wikipedia.org/wiki/VKontakte','Zone Actisud ','Route Des Gravières','57685','57039','454545');
insert into utilisateur  (PRO_ID,STR_ID,STU_ID,VALIDATED,PWD_VALIDATED,UTI_MAIL,UTI_PWD,UTI_NOM,UTI_PRENOM,UTI_TOCKENFRANCECONNECT,UTI_AUTORISEPUBLICARTE,UTI_MAILCONTACT,UTI_SITEWEB,UTI_ADRESSE,UTI_COMPLEMENTADRESSE,UTI_COM_CODEPOSTAL,UTI_COM_CODEINSEE,UTI_TELEPHONE) values (3,3,1,true,true,'oxahulidd-0582@yopmail.com','', 'Boisselot','Mégane','',true,'oxahulidd-0582@yopmail.com','https://fr.wikipedia.org/wiki/Instagram','Zac Du Pied Des Gouttes','','25200','25388','4554456465');
insert into utilisateur  (PRO_ID,STR_ID,STU_ID,VALIDATED,PWD_VALIDATED,UTI_MAIL,UTI_PWD,UTI_NOM,UTI_PRENOM,UTI_TOCKENFRANCECONNECT,UTI_AUTORISEPUBLICARTE,UTI_MAILCONTACT,UTI_SITEWEB,UTI_ADRESSE,UTI_COMPLEMENTADRESSE,UTI_COM_CODEPOSTAL,UTI_COM_CODEINSEE,UTI_TELEPHONE) values (3,2,1,true,true,'hipovaquxa-1855@yopmail.com','', 'Manaudou','Sabine','',true,'hipovaquxa-1855@yopmail.com','https://fr.wikipedia.org/wiki/Windows_Live','','','','','3215153');
insert into utilisateur  (PRO_ID,STR_ID,STU_ID,VALIDATED,PWD_VALIDATED,UTI_MAIL,UTI_PWD,UTI_NOM,UTI_PRENOM,UTI_TOCKENFRANCECONNECT,UTI_AUTORISEPUBLICARTE,UTI_MAILCONTACT,UTI_SITEWEB,UTI_ADRESSE,UTI_COMPLEMENTADRESSE,UTI_COM_CODEPOSTAL,UTI_COM_CODEINSEE,UTI_TELEPHONE) values (3,1,1,true,true,'wazeheba-9337@yopmail.com','', 'Bouthillier','Stéphanie','',true,'wazeheba-9337@yopmail.com','https://fr.wikipedia.org/wiki/Sohu','','','','','365415615');
insert into utilisateur  (PRO_ID,STR_ID,STU_ID,VALIDATED,PWD_VALIDATED,UTI_MAIL,UTI_PWD,UTI_NOM,UTI_PRENOM,UTI_TOCKENFRANCECONNECT,UTI_AUTORISEPUBLICARTE,UTI_MAILCONTACT,UTI_SITEWEB,UTI_ADRESSE,UTI_COMPLEMENTADRESSE,UTI_COM_CODEPOSTAL,UTI_COM_CODEINSEE,UTI_TELEPHONE) values (3,9,1,true,true,'qoffihedyrr-7069@yopmail.com','','Le Tonnelier','Linda ','',true,'qoffihedyrr-7069@yopmail.com','https://fr.wikipedia.org/wiki/Sohu','','','','','1515631563');
insert into utilisateur  (PRO_ID,STR_ID,STU_ID,VALIDATED,PWD_VALIDATED,UTI_MAIL,UTI_PWD,UTI_NOM,UTI_PRENOM,UTI_TOCKENFRANCECONNECT,UTI_AUTORISEPUBLICARTE,UTI_MAILCONTACT,UTI_SITEWEB,UTI_ADRESSE,UTI_COMPLEMENTADRESSE,UTI_COM_CODEPOSTAL,UTI_COM_CODEINSEE,UTI_TELEPHONE) values (3,8,1,true,true,'iherodi-8178@yopmail.com','','Philidor','Célia ','',true,'iherodi-8178@yopmail.com','https://fr.wikipedia.org/wiki/Sohu','','','','','3103561');
insert into utilisateur  (PRO_ID,STR_ID,STU_ID,VALIDATED,PWD_VALIDATED,UTI_MAIL,UTI_PWD,UTI_NOM,UTI_PRENOM,UTI_TOCKENFRANCECONNECT,UTI_AUTORISEPUBLICARTE,UTI_MAILCONTACT,UTI_SITEWEB,UTI_ADRESSE,UTI_COMPLEMENTADRESSE,UTI_COM_CODEPOSTAL,UTI_COM_CODEINSEE,UTI_TELEPHONE) values (3,7,1,true,true,'xittessennos-8301@yopmail.com','', 'Baudelaire','Julien','',true,'xittessennos-8301@yopmail.com','https://fr.wikipedia.org/wiki/Netflix','','','','','353');
insert into utilisateur  (PRO_ID,STR_ID,STU_ID,VALIDATED,PWD_VALIDATED,UTI_MAIL,UTI_PWD,UTI_NOM,UTI_PRENOM,UTI_TOCKENFRANCECONNECT,UTI_AUTORISEPUBLICARTE,UTI_MAILCONTACT,UTI_SITEWEB,UTI_ADRESSE,UTI_COMPLEMENTADRESSE,UTI_COM_CODEPOSTAL,UTI_COM_CODEINSEE,UTI_TELEPHONE) values (3,6,1,true,true,'jonupissu-9937@yopmail.com','', 'LucyLucy','Lucy','',true,'jonupissu-9937@yopmail.com','https://fr.wikipedia.org/wiki/LinkedIn','','','','','515151');
insert into utilisateur  (PRO_ID,STR_ID,STU_ID,VALIDATED,PWD_VALIDATED,UTI_MAIL,UTI_PWD,UTI_NOM,UTI_PRENOM,UTI_TOCKENFRANCECONNECT,UTI_AUTORISEPUBLICARTE,UTI_MAILCONTACT,UTI_SITEWEB,UTI_ADRESSE,UTI_COMPLEMENTADRESSE,UTI_COM_CODEPOSTAL,UTI_COM_CODEINSEE,UTI_TELEPHONE) values (3,5,1,true,true,'bixelotty-5877@yopmail.com','', 'Astier','Benjamin','',true,'bixelotty-5877@yopmail.com','https://fr.wikipedia.org/wiki/Twitch.tv','','','','','3651153615');
insert into utilisateur  (PRO_ID,STR_ID,STU_ID,VALIDATED,PWD_VALIDATED,UTI_MAIL,UTI_PWD,UTI_NOM,UTI_PRENOM,UTI_TOCKENFRANCECONNECT,UTI_AUTORISEPUBLICARTE,UTI_MAILCONTACT,UTI_SITEWEB,UTI_ADRESSE,UTI_COMPLEMENTADRESSE,UTI_COM_CODEPOSTAL,UTI_COM_CODEINSEE,UTI_TELEPHONE) values (3,4,1,true,true,'fanow84711@art2427.com','', 'Lortie','Thibaut','',true,'fanow84711@art2427.com','https://fr.wikipedia.org/wiki/EBay','','','','','155151663');
insert into utilisateur  (PRO_ID,STR_ID,STU_ID,VALIDATED,PWD_VALIDATED,UTI_MAIL,UTI_PWD,UTI_NOM,UTI_PRENOM,UTI_TOCKENFRANCECONNECT,UTI_AUTORISEPUBLICARTE,UTI_MAILCONTACT,UTI_SITEWEB,UTI_ADRESSE,UTI_COMPLEMENTADRESSE,UTI_COM_CODEPOSTAL,UTI_COM_CODEINSEE,UTI_TELEPHONE) values (3,3,1,true,true,'fanow84711@art2427.com','', 'Brunelle','Maxime','',true,'fanow84711@art2427.com','https://fr.wikipedia.org/wiki/Google','','','','','155163');

*/
