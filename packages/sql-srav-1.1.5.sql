/*==============================================================*/
/* Table : UTI_STR                                              */
/*==============================================================*/
DROP TABLE IF EXISTS UTI_STR;

create table UTI_STR (
  UST_ID               SERIAL               not null,
  UTI_ID               BIGINT               not null,
  STR_ID               BIGINT               not null,
  DCO_ID               BIGINT               null,
  UTI_STRUCTURELOCALE  VARCHAR(100)         null,
  SUS_ID               BIGINT not null
);

/*==============================================================*/
/* Table : DETAIL_COLLECTIVITE                                  */
/*==============================================================*/
DROP TABLE IF EXISTS DETAIL_COLLECTIVITE;

create table DETAIL_COLLECTIVITE (
   DCO_ID               SERIAL               not null,
   TCO_ID               BIGINT          not null,
   DCO_CODEPOSTAL       VARCHAR(5)           null,
   DCO_INSEE            VARCHAR(5)           null,
   DCO_DEP              VARCHAR(3)           null,
   DCO_EPCI_CODE        VARCHAR(9)           null,
   constraint PK_DETAIL_COLLECTIVITE primary key (DCO_ID)
);


DROP TABLE IF EXISTS STATUT_UTI_STR;
/*==============================================================*/
/* Table : STATUT_UTI_STR                                   */
/*==============================================================*/
create table STATUT_UTI_STR (
   SUS_ID               BIGINT               not null,
   SUS_LIBELLE          VARCHAR(50)          not null,
   constraint PK_STATUT_UTI_STR primary key (SUS_ID)
);

/*==============================================================*/
/* Table : TYPE_COLLECTIVITE                                  */
/*==============================================================*/
DROP TABLE IF EXISTS TYPE_COLLECTIVITE;

create table TYPE_COLLECTIVITE (
   TCO_ID               BIGINT               not null,
   TCO_CODE             VARCHAR(4)           not null,
   TCO_LIBELLE          VARCHAR(50)           not null
);


alter table UTI_STR
  add constraint FK_UTISTR_REFERENCE_UTI foreign key (UTI_ID)
      references UTILISATEUR (UTI_ID);

alter table UTI_STR
  add constraint FK_UTISTR_REFERENCE_STR foreign key (STR_ID)
      references STRUCTURE (STR_ID);

alter table UTI_STR
   add constraint FK_UTILISAT_REFERENCE_SUS foreign key (SUS_ID)
      references STATUT_UTI_STR (SUS_ID)
      on delete restrict on update restrict;

CREATE INDEX "IDX_UTI_STR"
    ON uti_str USING btree
    (uti_id , str_id);


-- Ajout de l'information sur la structure d'appartenance d'un utilisateur
ALTER TABLE intervention ADD ust_id bigint;

CREATE INDEX "IDX_INT_UST"
    ON intervention USING btree
    (ust_id);

CREATE TABLE structure_sav AS SELECT * FROM structure;
CREATE TABLE utilisateur_sav AS SELECT * FROM utilisateur;
	
ALTER DEFAULT PRIVILEGES IN SCHEMA public
    GRANT INSERT, SELECT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER ON TABLES
    TO u_srv_dev;

/*==============================================================*/
/* Peuplement des tables de référence : TYPE_COLLECTIVITE       */
/*==============================================================*/
INSERT INTO TYPE_COLLECTIVITE VALUES (1,'COM', 'Commune');
INSERT INTO TYPE_COLLECTIVITE VALUES (2,'DEP', 'Conseil Départemental');
INSERT INTO TYPE_COLLECTIVITE VALUES (3,'EPCI', 'EPCI');

/*==============================================================*/
/* Peuplement des tables de référence : STATUT_UTI_STR          */
/*==============================================================*/
insert into STATUT_UTI_STR(SUS_ID, SUS_LIBELLE) VALUES(0,'Inactif');
insert into STATUT_UTI_STR(SUS_ID, SUS_LIBELLE) VALUES(1,'Actif');
insert into STATUT_UTI_STR(SUS_ID, SUS_LIBELLE) VALUES(2,'Bloqué');

/*==============================================================*/
/*                    REPRISE DE DONNEES                        */
/*==============================================================*/
INSERT INTO structure(str_libellecourt, str_libelle, str_actif, str_federation) VALUES ('Collectivité territoriale',	'Collectivité territoriale', 'true', 'false');
UPDATE structure SET str_id = 99999 WHERE  str_libelle= 'Collectivité territoriale';

/*==============================================================*/
/*           PROCEDURE STOCKEE DE REPRISE DE DONNEES            */
/*==============================================================*/
CREATE OR REPLACE FUNCTION RepriseDonnees() RETURNS integer AS $$
DECLARE 
	Sortie TEXT;
	t_uti_nom TEXT;
	cListeUti CURSOR FOR select uti.uti_id, str.str_id, str.str_libellecourt, str_libelle, str.str_typecollectivite, uti.uti_structurelocale, uti.stu_id
				from utilisateur uti
				inner join structure str on str.str_id = uti.str_id;
	Utilisateur RECORD;
	CodePostal TEXT;
	CodeInsee TEXT;
	DepNum TEXT;
	CodeEPCI TEXT;
	Str_Collectivite BIGINT;
	DCO_ID  BIGINT;
	DCO_ID_EXIST  BIGINT;
BEGIN
	--SELECT str_id into Str_Collectivite FROM  structure WHERE str_libellecourt = 'Collectivité territoriale';
	Str_Collectivite = 99999;
	-- On vide les nouvelles table pour réexecution si besoin
	truncate table UTI_STR;
	truncate table DETAIL_COLLECTIVITE;
	
	OPEN cListeUti;
	loop
		fetch cListeUti into Utilisateur;
		exit when not found;
		CodeInsee = null;
		CodePostal = null;
		DepNum  = null;
		CodeEPCI  = null;
		-- Recherche de toutes les structures de type collectivité
		if (Utilisateur.str_libellecourt = 'DEP' OR Utilisateur.str_libellecourt = 'COM' OR Utilisateur.str_libellecourt = 'EPCI') then
			Sortie := 'STR Type Collectivité : ' || Utilisateur.str_libellecourt || ' - '  || Utilisateur.str_libelle;
			if Utilisateur.str_libellecourt = 'DEP' then
				select dep_num into DepNum 
				from departement 
				where dep_libelle = Utilisateur.str_libelle;
				Sortie := 'STR Type DEP : ' || Utilisateur.str_libellecourt || ' - '  || Utilisateur.str_libelle || ' - Dép trouvé ' || DepNum;
				
			end if;
			if Utilisateur.str_libellecourt = 'COM' then
				select com.cpi_codeinsee, cpi.cpi_codepostal, com.dep_num into CodeInsee , CodePostal, DepNum
				from commune com 
				inner join codepostal_insee cpi on com.cpi_codeinsee = cpi.cpi_codeinsee
				where com.com_libellemaj = Utilisateur.str_libelle;
				Sortie := 'STR Type COM : ' || Utilisateur.str_libellecourt || ' - '  || Utilisateur.str_libelle || ' - Insee trouvé ' || CodeInsee || ' - CodePostal trouvé ' || CodePostal || ' - DepNum trouvé ' || DepNum;
				
			end if;
			if Utilisateur.str_libellecourt = 'EPCI' then
				select epci.com_codeinsee,epci_code,cpi.cpi_codepostal, com.dep_num  into CodeInsee  ,CodeEPCI   , CodePostal, DepNum
				from EPCI 
				inner join codepostal_insee cpi on epci.com_codeinsee = cpi.cpi_codeinsee
				inner join commune com on com.cpi_codeinsee = epci.com_codeinsee
				where epci_libelle = Utilisateur.str_libelle;
				Sortie := 'STR Type COM : ' || Utilisateur.str_libellecourt || ' - '  || Utilisateur.str_libelle || ' - Insee trouvé ' ||  CodeInsee   || ' - CodePostal trouvé ' || CodePostal  || ' - EPCI trouvé ' || CodeEPCI;
			end if;

			DCO_ID = null;
			DCO_ID_EXIST= null;
			-- On recherche si le type de détail de collectivité existe déjà ou pas
			SELECT DCO.DCO_ID INTO DCO_ID_EXIST FROM DETAIL_COLLECTIVITE DCO WHERE DCO.TCO_ID = Utilisateur.str_typecollectivite AND DCO.DCO_CODEPOSTAL = CodePostal AND DCO.DCO_INSEE = CodeInsee AND DCO.DCO_DEP = DepNum AND DCO.DCO_EPCI_CODE = CodeEPCI;
			if DCO_ID_EXIST = NULL then
				-- Si elle existe on récupète l'Id
				DCO_ID = DCO_ID_EXIST;
			else
				-- Si elle n'existe pas, on la créée
				INSERT INTO DETAIL_COLLECTIVITE (TCO_ID, DCO_CODEPOSTAL, DCO_INSEE, DCO_DEP, DCO_EPCI_CODE) VALUES (Utilisateur.str_typecollectivite, CodePostal,CodeInsee,DepNum,CodeEPCI);
				SELECT MAX(DCO.DCO_ID) INTO DCO_ID FROM DETAIL_COLLECTIVITE DCO;
			end if;
			-- On insère le lien entre la structure et l'utilisateur en y ajoutant le détail de collectivité 
			INSERT INTO UTI_STR (UTI_ID,  STR_ID,  DCO_ID,  UTI_STRUCTURELOCALE,SUS_ID) VALUES (Utilisateur.uti_id, Str_Collectivite, DCO_ID, Utilisateur.uti_structurelocale,Utilisateur.stu_id);
		else
			-- Cas d'une structure classique : le détail collectivité est positionné à null
			Sortie := 'STR Type autre struct : ' || Utilisateur.str_libellecourt || ' - '  || Utilisateur.str_libelle;
			INSERT INTO UTI_STR (UTI_ID,  STR_ID,  DCO_ID,  UTI_STRUCTURELOCALE,SUS_ID) VALUES (Utilisateur.uti_id, Utilisateur.str_id,null, Utilisateur.uti_structurelocale,1);
		end if; 
				
		RAISE NOTICE '%',Sortie;

	end loop;	
	-- Suppression du lien entre l'utilisateur et la structure
	update utilisateur set str_id = null;
	update uti_str set uti_structurelocale = null where str_id = 99999;
	-- Suppression des structures de type collectivité
	delete from structure where str_libellecourt in ('COM', 'DEP', 'EPCI');
	-- Affectation de la structure de l'utilisateur à l'intervention (couple utilisateur / structure désormais)
	UPDATE 
	intervention   int
	SET 
	ust_id = ust.ust_id
	FROM 
	uti_str ust
	WHERE 
	int.uti_id = ust.uti_id;

    RETURN 1;
END;
$$ LANGUAGE plpgsql;

select RepriseDonnees();
/*
select * 
from uti_str us
left join detail_collectivite dco on dco.dco_id = us.dco_id;
*/


COMMIT;

ALTER TABLE utilisateur DROP COLUMN str_id;
ALTER TABLE utilisateur DROP COLUMN uti_structurelocale;

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO u_srv_dev;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO u_srv_dev;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO u_srv_dev;