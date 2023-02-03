
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

		/*==============================================================*/
		/* Table : trace                                        		*/
		/* Stockage des traces utilisateurs                       		*/
		/*==============================================================*/
		create table trace (
			tra_id 		SERIAL not null,
			tra_uti_id  BIGINT not null,
			tra_date	timestamp not null,
			tra_action  CHAR(1) not null,
			tta_id INTEGER,
			tra_objet   VARCHAR(30) not null,
			tra_objet_id  BIGINT not null,
			tra_contenu JSON,
		constraint PK_TRACE primary key (tra_id));

		/*==============================================================*/
		/* Index : IDX_TRACE_UOI                                        */
		/* Index sur utilisateur, objet et id objet                     */
		/*==============================================================*/
		create  index IDX_TRA_UOI on trace (
		tra_uti_id,tra_objet,tra_objet_id
		);

		/*==============================================================*/
		/* Index : IDX_TRACE_UTI_ID                                     */
		/* Index sur utilisateur                                        */
		/*==============================================================*/
		create  index IDX_TRA_UTI_ID on trace (tra_uti_id);

		/*==============================================================*/
		/* Table : type_trace_action                              		*/
		/* Type d'action pour la trace associée                   		*/
		/*==============================================================*/
		create table type_trace_action (
			tta_id 		INTEGER not null,
			tta_code   VARCHAR(20) not null,
			tta_categorie   VARCHAR(30) not null,
			tta_description  VARCHAR(50) not null,
		constraint PK_TYPE_TRACE_ACTION primary key (tta_id));

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
		insert into parametres (par_id,par_code,par_description,par_valeur) values (5,'CSV_FINANC', 'Profils autorisés à avoir le financement dans le CSV (1:Admin;2;Partenaire;3:Intervenant;4:Référent)','1;2');

		insert into type_trace_action (tta_id,tta_code,tta_categorie, tta_description) values (1,'UTI_CONNEXION','UTILISATEUR','Connexion d''un utilisateur');
		insert into type_trace_action (tta_id,tta_code,tta_categorie, tta_description) values (2,'UTI_DECONNEXION','UTILISATEUR','Déconnesion d''un utilisateur');
		insert into type_trace_action (tta_id,tta_code,tta_categorie, tta_description) values (3,'UTI_MAJ_COMPTE','UTILISATEUR','Mise à jour des informations utilisateur');
		insert into type_trace_action (tta_id,tta_code,tta_categorie, tta_description) values (4,'UTI_CREATION','UTILISATEUR','Création d''un nouvel utilisateur');
		insert into type_trace_action (tta_id,tta_code,tta_categorie, tta_description) values (5,'UTI_SUPPRESSION','UTILISATEUR','Suppression d''un utilisateur');
		insert into type_trace_action (tta_id,tta_code,tta_categorie, tta_description) values (6,'UTI_AJOUT_STR','UTILISATEUR','Ajout d''une structure à l''utilisateur');
		insert into type_trace_action (tta_id,tta_code,tta_categorie, tta_description) values (7,'UTI_SUP_STR','UTILISATEUR','Suppression d''une structure de l''utilisateur');
		insert into type_trace_action (tta_id,tta_code,tta_categorie, tta_description) values (8,'UTI_REACT_STR','UTILISATEUR','Réactivation d''une structure de l''utilisateur');
		insert into type_trace_action (tta_id,tta_code,tta_categorie, tta_description) values (9,'UTI_DESAC_STR','UTILISATEUR','Désactivation d''une structure de l''utilisateur');
		insert into type_trace_action (tta_id,tta_code,tta_categorie, tta_description) values (10,'UTI_BLOQ_STR','UTILISATEUR','Blocage d''une structure de l''utilisateur');
		insert into type_trace_action (tta_id,tta_code,tta_categorie, tta_description) values (11,'UTI_DEBLOQ_STR','UTILISATEUR','Déblocage d''une structure de l''utilisateur');
		insert into type_trace_action (tta_id,tta_code,tta_categorie, tta_description) values (12,'UTI_VALID_COMPTE','UTILISATEUR','Validation d''un nouveauc compte utilisateur');

		insert into type_trace_action (tta_id,tta_code,tta_categorie, tta_description) values (50,'INT_CREATION','INTERVENTION','Création d''une intervention');
		insert into type_trace_action (tta_id,tta_code,tta_categorie, tta_description) values (51,'INT_MAJ','INTERVENTION','Mise à jour d''une intervention');
		insert into type_trace_action (tta_id,tta_code,tta_categorie, tta_description) values (52,'INT_SUPPRESSION','INTERVENTION','Suppression d''une intervention');
		insert into type_trace_action (tta_id,tta_code,tta_categorie, tta_description) values (53,'INT_CSV','INTERVENTION','Export CSV des interventions');


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