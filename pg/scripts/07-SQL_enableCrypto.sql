/* Enable Encryption */
CREATE EXTENSION pgcrypto;
/* Modify utilisateur table */
ALTER TABLE UTILISATEUR alter UTI_NOM drop not null;
ALTER TABLE UTILISATEUR alter UTI_PRENOM drop not null;
ALTER TABLE UTILISATEUR drop UTI_DATENAISSANCE;
ALTER TABLE UTILISATEUR ADD UTI_PWD VARCHAR(255) NULL;