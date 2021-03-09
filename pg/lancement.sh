#! /bin/sh
psql -c "DROP DATABASE srv_dev if EXISTS"

echo '01-CreationBDD :'
psql -f /docker-entrypoint-initdb.d/scripts/01-CreationBDD.sql

echo '02-SQL_CreationBase :'
psql -d srv_dev -U u_srv_dev -f /docker-entrypoint-initdb.d/scripts/02-SQL_CreationBase.sql

echo '04-SQL_CreationSession :'
psql -d srv_dev -U u_srv_dev -f /docker-entrypoint-initdb.d/scripts/04-SQL_CreationSession.sql

echo '03-SQL_PeuplementReferentielBase :'
psql -d srv_dev -U u_srv_dev -f /docker-entrypoint-initdb.d/scripts/03-SQL_PeuplementReferentielBase.sql
psql -d srv_dev -U u_srv_dev -f /docker-entrypoint-initdb.d/scripts/06-SQL_UpdateStructure.sql

echo '05-SQL_V1.0.2 :'
psql -d srv_dev -U u_srv_dev -f /docker-entrypoint-initdb.d/scripts/05-SQL_V1.0.2.sql

echo '07- SQL_enableCrypto :'
psql -d srv_dev -f /docker-entrypoint-initdb.d/scripts/07-SQL_enableCrypto.sql

