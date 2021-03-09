/*==============================================================*/
/* Nom de SGBD :  PostgreSQL 8                                  */
/* Date de création :  05/02/2019 21:32:11                      */
/*==============================================================*/


drop table IF EXISTS ATTESTATION CASCADE;

drop table IF EXISTS BLOC CASCADE;

drop table IF EXISTS CADREINTERVENTION CASCADE;

drop table IF EXISTS CHECKING CASCADE;

drop index IF EXISTS IDX_CPI_CODEPOSTAL CASCADE;

drop index IF EXISTS IDX_CPI_CODEINSEE CASCADE;

drop table IF EXISTS CODEPOSTAL_INSEE CASCADE;

drop index IF EXISTS IDX_COM_DEP_NUM CASCADE;

drop table IF EXISTS COMMUNE CASCADE;

drop table IF EXISTS EPCI CASCADE;

drop table IF EXISTS IDX_EPCI_CODEINSE CASCADE;

drop index IF EXISTS DEP_REG_NUM CASCADE;

drop index IF EXISTS IDX_DEP_NUM CASCADE;

drop table IF EXISTS DEPARTEMENT CASCADE;

drop table IF EXISTS DOCUMENT CASCADE;

drop table IF EXISTS INTERVENTION CASCADE;

drop table IF EXISTS PROFIL CASCADE;

drop table IF EXISTS REGION CASCADE;

drop table IF EXISTS STATUT_INTERVENTION CASCADE;

drop table IF EXISTS STATUT_UTILISATEUR CASCADE;

drop table IF EXISTS STRUCTURE CASCADE;

drop table IF EXISTS TRANCHEAGE CASCADE;

drop table IF EXISTS TRANCHEAGEINTER CASCADE;

drop table IF EXISTS UTILISATEUR CASCADE;

drop table IF EXISTS USER_SESSIONS CASCADE;

/*==============================================================*/
/* Table : ATTESTATION                                          */
/*==============================================================*/
create table ATTESTATION (
   ATT_ID               SERIAL               not null,
   INT_ID               BIGINT               null,
   ATT_DATECREATION     DATE                 not null,
   ATT_NOMBRE           INT                  not null,
   ATT_SEQUENCEDEBUT    BIGINT               not null,
   ATT_SEQUENCEFIN      BIGINT               not null,
   constraint PK_ATTESTATION primary key (ATT_ID)
);

/*==============================================================*/
/* Table : BLOC                                                 */
/*==============================================================*/
create table BLOC (
   BLO_ID               BIGINT               not null,
   BLO_LIBELLE          VARCHAR(50)          not null,
   BLO_ORDER            INT                  not null,
   constraint PK_BLOC primary key (BLO_ID)
);

/*==============================================================*/
/* Table : CADREINTERVENTION                                    */
/*==============================================================*/
create table CADREINTERVENTION (
   CAI_ID               BIGINT               not null,
   CAI_LIBELLE          VARCHAR(50)          not null,
   CAI_ORDRE            INT                  not null,
   constraint PK_CADREINTERVENTION primary key (CAI_ID)
);

/*==============================================================*/
/* Table : CHECKING                                             */
/*==============================================================*/
create table CHECKING (
   CHK_ID               SERIAL               not null,
   CHK_DOCUMENT         BYTEA                null,
   CHK_DATE             DATE                 null,
   constraint PK_CHECKING primary key (CHK_ID)
);

/*==============================================================*/
/* Table : CODEPOSTAL_INSEE                                     */
/*==============================================================*/
create table CODEPOSTAL_INSEE (
   CPI_CODEINSEE        VARCHAR(5)           not null,
   CPI_CODEPOSTAL       VARCHAR(5)           not null
);

/*==============================================================*/
/* Index : IDX_CPI_CODEINSEE                                    */
/*==============================================================*/
create  index IDX_CPI_CODEINSEE on CODEPOSTAL_INSEE (
CPI_CODEINSEE
);

/*==============================================================*/
/* Index : IDX_CPI_CODEPOSTAL                                   */
/*==============================================================*/
create  index IDX_CPI_CODEPOSTAL on CODEPOSTAL_INSEE (
CPI_CODEPOSTAL
);

/*==============================================================*/
/* Table : COMMUNE                                              */
/*==============================================================*/
create table COMMUNE (
   COM_ID               BIGINT               not null,
   CPI_CODEINSEE        VARCHAR(5)           null,
   COM_ARTMAJ           VARCHAR(10)          null,
   COM_LIBELLEMAJ       VARCHAR(50)          null,
   COM_ART              VARCHAR(10)          null,
   COM_LIBELLE          VARCHAR(50)          null,
   DEP_NUM              VARCHAR(3)           null,
   constraint PK_COMMUNE primary key (COM_ID)
);


/*==============================================================*/
/* Index : IDX_COM_DEP_NUM                                      */
/*==============================================================*/
create  index IDX_COM_DEP_NUM on COMMUNE (
DEP_NUM
);

/*==============================================================*/
/* Table : EPCI                                              */
/*==============================================================*/
create table EPCI (
   EPCI_ID               BIGINT               not null,
   COM_CODEINSEE        VARCHAR(5)           null,
   EPCI_CODE           VARCHAR(9)          null,
   EPCI_LIBELLE       VARCHAR(90)          null,
   EPCI_DEP             VARCHAR(3)          null,
   EPCI_REG          VARCHAR(2)          null,
      constraint PK_EPCI primary key (EPCI_ID)
);

/*==============================================================*/
/* Index : IDX_EPCI_CODEINSE                                    */
/*==============================================================*/
create  index IDX_EPCI_CODEINSEE on EPCI (
COM_CODEINSEE
);

/*==============================================================*/
/* Table : DEPARTEMENT                                          */
/*==============================================================*/
create table DEPARTEMENT (
   DEP_ID               BIGINT               not null,
   DEP_LIBELLE          VARCHAR(50)          not null,
   DEP_NUM              VARCHAR(3)           not null,
   REG_NUM              VARCHAR(3)           null,
   constraint PK_DEPARTEMENT primary key (DEP_ID)
);

/*==============================================================*/
/* Index : IDX_DEP_NUM                                          */
/*==============================================================*/
create  index IDX_DEP_NUM on DEPARTEMENT (
DEP_NUM
);

/*==============================================================*/
/* Index : DEP_REG_NUM                                          */
/*==============================================================*/
create  index DEP_REG_NUM on DEPARTEMENT (
REG_NUM
);

/*==============================================================*/
/* Table : DOCUMENT                                             */
/*==============================================================*/
create table DOCUMENT (
   DOC_ID               SERIAL               not null,
   DOC_TYPE             VARCHAR(20)          not null,
   DOC_LIBELLE          VARCHAR(50)          not null,
   DOC_FILENAME         VARCHAR(50)          not null,
   DOC_CONTENU          BYTEA                null,
   constraint PK_DOCUMENT primary key (DOC_ID)
);

/*==============================================================*/
/* Table : INTERVENTION                                         */
/*==============================================================*/
create table INTERVENTION (
   INT_ID               SERIAL               not null,
   CAI_ID               BIGINT               not null,
   BLO_ID               BIGINT               not null,
   SIN_ID               BIGINT               null,
   UTI_ID               BIGINT               null,
   INT_COM_CODEINSEE    VARCHAR(5)           not null,
   INT_COM_CODEPOSTAL   VARCHAR(5)           not null,
   INT_COM_LIBELLE     VARCHAR(50)          not null,
   INT_NOMBREENFANT     INT                  null,
   INT_NOMBREFILLE      INT                  null,
   INT_NOMBREGARCON     INT                  null,
   INT_NOMBREMOINSSIX      INT                  null,
   INT_NOMBRESIXHUIT       INT                  null,
   INT_NOMBRENEUFDIX     INT                  null,
   INT_NOMBREPLUSDIX   INT                  null,
   INT_DATEINTERVENTION DATE                 not null,
   INT_DATECREATION    timestamp                 not null,
   INT_DATEMAJ          timestamp                 null,
   INT_COMMENTAIRE      TEXT                 null,
   INT_DEP_NUM          VARCHAR(3)           not null,
   INT_REG_NUM          VARCHAR(3)           not null,
   INT_SITEINTERVENTION  VARCHAR(100)		null,
   constraint PK_INTERVENTION primary key (INT_ID)
);

/*==============================================================*/
/* Table : PROFIL                                               */
/*==============================================================*/
create table PROFIL (
   PRO_ID               BIGINT               not null,
   PRO_LIBELLE          VARCHAR(50)          not null,
   PRO_ORDRE            INT                  not null,
   constraint PK_PROFIL primary key (PRO_ID)
);

/*==============================================================*/
/* Table : REGION                                               */
/*==============================================================*/
create table REGION (
   REG_ID               BIGINT               not null,
   REG_LIBELLE          VARCHAR(50)          not null,
   REG_NUM              VARCHAR(3)           null,
   constraint PK_REGION primary key (REG_ID)
);

/*==============================================================*/
/* Table : STATUT_INTERVENTION                                  */
/*==============================================================*/
create table STATUT_INTERVENTION (
   SIN_ID               BIGINT               not null,
   SIN_LIBELLE          VARCHAR(50)          not null,
   SIN_ORDRE            INT                  not null,
   constraint PK_STATUT_INTERVENTION primary key (SIN_ID)
);

/*==============================================================*/
/* Table : STATUT_UTILISATEUR                                   */
/*==============================================================*/
create table STATUT_UTILISATEUR (
   STU_ID               BIGINT               not null,
   STU_LIBELLE          VARCHAR(50)          not null,
   constraint PK_STATUT_UTILISATEUR primary key (STU_ID)
);

/*==============================================================*/
/* Table : STRUCTURE                                            */
/*==============================================================*/
create table STRUCTURE (
   STR_ID               SERIAL               not null,
   STR_LIBELLECOURT     VARCHAR(100)          null,
   STR_LIBELLE          VARCHAR(150)         not null,
   STR_ACTIF            BOOLEAN              not null,
   STR_FEDERATION       BOOLEAN              not null,
   constraint PK_STRUCTURE primary key (STR_ID)
);

/*==============================================================*/
/* Table : TRANCHEAGE                                           */
/*==============================================================*/
create table TRANCHEAGE (
   TRA_ID               BIGINT               not null,
   TRA_LIBELLE          VARCHAR(50)          not null,
   TRA_ORDRE            INT                  not null,
   constraint PK_TRANCHEAGE primary key (TRA_ID)
);

/*==============================================================*/
/* Table : TRANCHEAGEINTER                                      */
/*==============================================================*/
create table TRANCHEAGEINTER (
   TAI_ID               SERIAL               not null,
   TRA_ID               BIGINT               null,
   INT_ID               BIGINT               null,
   TAI_NOMBREENFANT     INT                  not null,
   constraint PK_TRANCHEAGEINTER primary key (TAI_ID)
);

/*==============================================================*/
/* Table : UTILISATEUR                                          */
/*==============================================================*/
create table UTILISATEUR (
   UTI_ID               SERIAL               not null,
   PRO_ID               BIGINT               not null,
   STR_ID               BIGINT               null,
   STU_ID               BIGINT               not null,
   VALIDATED            BOOLEAN              not null,
   UTI_MAIL             VARCHAR(50)          not null,
   UTI_NOM              VARCHAR(50)          not null,
   UTI_PRENOM           VARCHAR(50)          not null,
   UTI_DATENAISSANCE    DATE                 not null,
   UTI_STRUCTURELOCALE  VARCHAR(100)         null,
   UTI_TOCKENFRANCECONNECT VARCHAR(100)      null,
   constraint PK_UTILISATEUR primary key (UTI_ID)
);

/*==============================================================*/
/* Table : user_sessions                                        */
/* Stockage des sessions des utilisateurs                       */
/*==============================================================*/
CREATE TABLE "USER_SESSIONS" (
  "sid" varchar NOT NULL COLLATE "default",
	"sess" json NOT NULL,
	"expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);
ALTER TABLE "USER_SESSIONS" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE UTILISATEUR 
   ALTER COLUMN VALIDATED
   SET DEFAULT FALSE;

alter table ATTESTATION
   add constraint FK_ATTESTAT_REFERENCE_INTERVEN foreign key (INT_ID)
      references INTERVENTION (INT_ID)
      on delete restrict on update restrict;

alter table INTERVENTION
   add constraint FK_INTERVEN_REFERENCE_BLOC foreign key (BLO_ID)
      references BLOC (BLO_ID)
      on delete restrict on update restrict;

alter table INTERVENTION
   add constraint FK_INTERVEN_REFERENCE_STATUT_I foreign key (SIN_ID)
      references STATUT_INTERVENTION (SIN_ID)
      on delete restrict on update restrict;

alter table INTERVENTION
   add constraint FK_INTERVEN_REFERENCE_UTILISAT foreign key (UTI_ID)
      references UTILISATEUR (UTI_ID)
      on delete restrict on update restrict;

alter table INTERVENTION
   add constraint FK_INTERVEN_REFERENCE_CADREINT foreign key (CAI_ID)
      references CADREINTERVENTION (CAI_ID)
      on delete restrict on update restrict;

alter table TRANCHEAGEINTER
   add constraint FK_TRANCHEA_REFERENCE_TRANCHEA foreign key (TRA_ID)
      references TRANCHEAGE (TRA_ID)
      on delete restrict on update restrict;

alter table TRANCHEAGEINTER
   add constraint FK_TRANCHEA_REFERENCE_INTERVEN foreign key (INT_ID)
      references INTERVENTION (INT_ID)
      on delete restrict on update restrict;

alter table UTILISATEUR
   add constraint FK_UTILISAT_REFERENCE_PROFIL foreign key (PRO_ID)
      references PROFIL (PRO_ID)
      on delete restrict on update restrict;

alter table UTILISATEUR
   add constraint FK_UTILISAT_REFERENCE_STRUCTUR foreign key (STR_ID)
      references STRUCTURE (STR_ID)
      on delete restrict on update restrict;

alter table UTILISATEUR
   add constraint FK_UTILISAT_REFERENCE_STATUT_U foreign key (STU_ID)
      references STATUT_UTILISATEUR (STU_ID)
      on delete restrict on update restrict;

