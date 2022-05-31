
-- Début de la procédure de déploiement automatisé : 
-- Création de la version
DO $$
DECLARE 
	CreationVersion BOOLEAN;
BEGIN 
   SELECT SRAV_CreerVersion('1.1.8') INTO CreationVersion;
   raise notice 'CreationVersion %', CreationVersion;
END
$$ language plpgsql;

-- Mise à jour du schéma de base de données
DO $$
DECLARE
	FaireMAJSchema BOOLEAN;
	VersionDeployee BOOLEAN;
BEGIN 
	SELECT SRAV_DeployerVersion('1.1.8','schema') INTO FaireMAJSchema;
	IF FaireMAJSchema THEN
		-- Augmentation de la largeur des colonnes pour se coller aux normes et étendre les adresses.
		alter table UTILISATEUR ALTER column uti_mail TYPE varchar(320);
		alter table UTILISATEUR ALTER column uti_siteweb TYPE varchar(2048);
		alter table UTILISATEUR ALTER column uti_adresse TYPE varchar(100);
		alter table UTILISATEUR ALTER column uti_complementadresse TYPE varchar(100);
		alter table UTILISATEUR ALTER column uti_mailcontact TYPE varchar(320);

		-- Déploiement du Schéma effectué
    	SELECT SRAV_VersionDeployee('1.1.8','schema')  INTO VersionDeployee;
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
	SELECT SRAV_DeployerVersion('1.1.8','data') INTO FaireMAJData;
	IF FaireMAJData THEN

      	-- Déploiement du Schéma effectué
      	SELECT SRAV_VersionDeployee('1.1.8','data') INTO VersionDeployee;
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
	SELECT SRAV_DeployerVersion('1.1.8','droit') INTO FaireMAJDroit;
	IF FaireMAJDroit THEN
      	SELECT SRAV_AjouteDroitsObjets() INTO AjouteDroitsObjets;
		raise notice 'Mise à jour des droits : %',AjouteDroitsObjets;
	ELSE
		raise notice '%','Pas de mise à jour des droits à faire';
	END IF;
END
$$ language plpgsql;