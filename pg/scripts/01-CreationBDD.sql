/*

Fichier SQL associé à la création de la base de données et des schema de base 
Ce fichier est appelé par 01-CreationBDD.sh

Création user / BD :
prod: u_srv_prod / srv_prod
preprod : u_srv_preprod / srv_preprod
Integ: u_srv_integ / srv_integ

Dev: u_srv_dev / srv_dev

*/

create database srv_dev;

create schema data;

-- creation du user
create user u_srv_dev WITH password 'Sr4v3l0!';
-- CREATE ROLE

grant all privileges on schema data to u_srv_dev;

ALTER DEFAULT PRIVILEGES IN SCHEMA data
    GRANT INSERT, SELECT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER ON TABLES
    TO u_srv_dev;

-- Grant pour le user srav_dev
GRANT USAGE ON SCHEMA data TO u_srv_dev;
-- GRANT

 grant all privileges on schema data to u_srv_dev;
-- GRANT

set search_path = data;
