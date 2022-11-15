
-- Début de la procédure de déploiement automatisé : 
-- Création de la version
DO $$
DECLARE 
	CreationVersion BOOLEAN;
BEGIN 
   SELECT SRAV_CreerVersion('1.1.9') INTO CreationVersion;
   raise notice 'CreationVersion %', CreationVersion;
END
$$ language plpgsql;

-- Mise à jour du schéma de base de données
DO $$
DECLARE
	FaireMAJSchema BOOLEAN;
	VersionDeployee BOOLEAN;
BEGIN 
	SELECT SRAV_DeployerVersion('1.1.9','schema') INTO FaireMAJSchema;
	IF FaireMAJSchema THEN
		-- Ajout corealisation autre
		alter table intervention add column int_corealiseautre varchar(150);
		-- Déploiement du Schéma effectué
    	SELECT SRAV_VersionDeployee('1.1.9','schema')  INTO VersionDeployee;
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
	SELECT SRAV_DeployerVersion('1.1.9','data') INTO FaireMAJData;
	IF FaireMAJData THEN
        INSERT INTO parametres (par_id, par_code, par_description, par_valeur) values (4,'PARTAGE_DONNEES','Active le partage de données (0/1)','0');

      	-- Déploiement du Schéma effectué
      	SELECT SRAV_VersionDeployee('1.1.9','data') INTO VersionDeployee;
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
	SELECT SRAV_DeployerVersion('1.1.9','droit') INTO FaireMAJDroit;
	IF FaireMAJDroit THEN
      	SELECT SRAV_AjouteDroitsObjets() INTO AjouteDroitsObjets;
		raise notice 'Mise à jour des droits : %',AjouteDroitsObjets;
	ELSE
		raise notice '%','Pas de mise à jour des droits à faire';
	END IF;
END
$$ language plpgsql;