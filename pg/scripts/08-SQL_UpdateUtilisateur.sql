alter table utilisateur 
add column UTI_SITEWEB varchar(200) null, 
add column UTI_ADRESSE          VARCHAR(50)     null,
add column UTI_COMPLEMENTADRESSE VARCHAR(50)     null,
add column UTI_COM_CODEINSEE    VARCHAR(5)      null,
add column UTI_COM_CODEPOSTAL   VARCHAR(5)      null,
add column UTI_MAILCONTACT    VARCHAR(50)      null,
add column UTI_TELEPHONE       VARCHAR(10)      null,
add column UTI_AUTORISEPUBLICARTE   BOOLEAN default false;

drop table IF EXISTS etablissement CASCADE;

CREATE TABLE etablissement (
          eta_uai varchar(8) not null,
          eta_nom varchar(100) not null,
          eta_type varchar(50),
          eta_public_prive varchar(50),
          eta_adresse1 varchar(100),
          eta_adresse2 varchar(100),
          eta_codepostal varchar(5),
          eta_commune varchar(100),
          eta_codeinsee varchar(5),
          eta_nature varchar(50),
   constraint PK_ETABLISSEMENT primary key (eta_uai));

CREATE INDEX "IDX_ETAB_CP"
    ON public.etablissement USING btree
    (eta_codepostal ASC NULLS LAST)
    TABLESPACE pg_default;