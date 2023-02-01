
-- Début de la procédure de déploiement automatisé : 
-- Création de la version
DO $$
DECLARE 
	CreationVersion BOOLEAN;
BEGIN 
   SELECT SRAV_CreerVersion('1.1.10') INTO CreationVersion;
   raise notice 'CreationVersion %', CreationVersion;
END
$$ language plpgsql;

-- Mise à jour du schéma de base de données
DO $$
DECLARE
	FaireMAJSchema BOOLEAN;
	VersionDeployee BOOLEAN;
BEGIN 
	SELECT SRAV_DeployerVersion('1.1.10','schema') INTO FaireMAJSchema;
	IF FaireMAJSchema THEN
		/*==============================================================*/
		/* Table : financement                                          */
		/*==============================================================*/
		alter table intervention add int_fin_ans BOOLEAN;
		alter table intervention add int_fin_gene_velo BOOLEAN;
		alter table intervention add int_fin_autre BOOLEAN;
		alter table intervention add int_fin_aucun BOOLEAN;

    	SELECT SRAV_VersionDeployee('1.1.10','schema')  INTO VersionDeployee;
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
	SELECT SRAV_DeployerVersion('1.1.10','data') INTO FaireMAJData;
	IF FaireMAJData THEN
		insert into parametres (par_id,par_code,par_description,par_valeur) values (5,'CSV_FINANC', 'Profils autorisés à avoir le financement dans le CSV (1:Admin;2;Partenaire;3:Intervenant;4:Référent)','1;2')

      	-- Déploiement du Schéma effectué
      	SELECT SRAV_VersionDeployee('1.1.10','data') INTO VersionDeployee;
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
	SELECT SRAV_DeployerVersion('1.1.10','droit') INTO FaireMAJDroit;
	IF FaireMAJDroit THEN
      	SELECT SRAV_AjouteDroitsObjets() INTO AjouteDroitsObjets;
		raise notice 'Mise à jour des droits : %',AjouteDroitsObjets;
	ELSE
		raise notice '%','Pas de mise à jour des droits à faire';
	END IF;
END
$$ language plpgsql;