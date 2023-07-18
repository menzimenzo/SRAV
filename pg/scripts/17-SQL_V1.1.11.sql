
-- Début de la procédure de déploiement automatisé : 
-- Création de la version
DO $$
DECLARE 
	CreationVersion BOOLEAN;
BEGIN 
   SELECT SRAV_CreerVersion('1.1.11') INTO CreationVersion;
   raise notice 'CreationVersion %', CreationVersion;
END
$$ language plpgsql;

-- Mise à jour du schéma de base de données
DO $$
DECLARE
	FaireMAJSchema BOOLEAN;
	VersionDeployee BOOLEAN;
BEGIN 
	SELECT SRAV_DeployerVersion('1.1.1','schema') INTO FaireMAJSchema;
	IF FaireMAJSchema THEN
	/*
		/*==============================================================*/
		/* Table : CADREINTERVENTION                                    */
		/*==============================================================*/
		create table TYPE_ANS (
		TAN_ID               BIGINT               not null,
		TAN_LIBELLE          VARCHAR(50)          not null,
		TAN_ORDRE            INT                  not null,
		constraint PK_TYPEANS primary key (TAN_ID)
		);
*/
		alter table intervention add int_type_ans INTEGER;


    	SELECT SRAV_VersionDeployee('1.1.11','schema')  INTO VersionDeployee;
		raise notice 'Mise à jour du schéma effectué : %',VersionDeployee;
	ELSE
		raise notice '%','Pas de mise à jour schéma à faire';
	END IF;
END
$$ language plpgsql;

-- Mise à jour des données
DO $$
DECLARE
	FaireMAJData BOOLEAN;
	VersionDeployee BOOLEAN;
BEGIN 
	SELECT SRAV_DeployerVersion('1.1.11','data') INTO FaireMAJData;
	IF FaireMAJData THEN
/*
		insert into TYPE_ANS (tan_id,tan_libelle,tan_ordre) values (1,'PST', 1);
		insert into TYPE_ANS (tan_id,tan_libelle,tan_ordre) values (2,'PSF', 2);
		insert into TYPE_ANS (tan_id,tan_libelle,tan_ordre) values (3,'CIV', 3);
*/
      	-- Déploiement du Schéma effectué
      	SELECT SRAV_VersionDeployee('1.1.11','data') INTO VersionDeployee;
	   	raise notice 'Mise à jour des datas effectué : %', VersionDeployee;
	ELSE
		raise notice '%','Pas de mise à jour de datas à faire';
	END IF;
END
$$ language plpgsql;

DO $$
DECLARE
	FaireMAJDroit BOOLEAN;
	AjouteDroitsObjets BOOLEAN;
BEGIN 
	SELECT SRAV_DeployerVersion('1.1.1','droit') INTO FaireMAJDroit;
	IF FaireMAJDroit THEN
      	SELECT SRAV_AjouteDroitsObjets() INTO AjouteDroitsObjets;
		raise notice 'Mise à jour des droits : %',AjouteDroitsObjets;
	ELSE
		raise notice '%','Pas de mise à jour des droits à faire';
	END IF;
END
$$ language plpgsql;