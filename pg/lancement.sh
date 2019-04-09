#! /bin/sh
echo '01-CreationBDD :'
psql -f /docker-entrypoint-initdb.d/scripts/01-CreationBDD.sql
echo '02-SQL_CreationBase :'
psql -d srv_dev -U u_srv_dev -f /docker-entrypoint-initdb.d/scripts/02-SQL_CreationBase.sql
echo '03-SQL_PeuplementReferentielBase :'
psql -d srv_dev -U u_srv_dev -f /docker-entrypoint-initdb.d/scripts/03-SQL_PeuplementReferentielBase.sql
echo '04-SQL_CreationSession :'
psql -d srv_dev -U u_srv_dev -f /docker-entrypoint-initdb.d/scripts/04-SQL_CreationSession.sql
