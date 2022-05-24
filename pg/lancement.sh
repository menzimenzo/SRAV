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

# Version 1.1.0
echo '07- SQL_enableCrypto :'
psql -d srv_dev -f /docker-entrypoint-initdb.d/scripts/07-SQL_enableCrypto.sql

# Version 1.1.1
echo '08-SQL_V1.1.1.sql :'
psql -d srv_dev -U u_srv_dev -f /docker-entrypoint-initdb.d/scripts/08-SQL_V1.1.1.sql

# Version 1.1.3
echo '10-SQL_V1.1.3.sql'
psql -d srv_dev -U u_srv_dev -f /docker-entrypoint-initdb.d/scripts/10-SQL_V1.1.3.sql

# Version 1.1.4
echo '11-SQL_V1.1.4.sql'
psql -d srv_dev -U u_srv_dev -f /docker-entrypoint-initdb.d/scripts/11-SQL_V1.1.4.sql

# Version 1.1.5
echo '12-SQL_V1.1.5.sql'
psql -d srv_dev -U u_srv_dev -f /docker-entrypoint-initdb.d/scripts/12-SQL_V1.1.5.sql

# Version 1.1.6
# pas de Sql

# Version 1.1.7
echo '13-SQL_V1.1.7.sql'
psql -d srv_dev -U u_srv_dev -f /docker-entrypoint-initdb.d/scripts/13-SQL_V1.1.7.sql
# hors version intégration des COM
psql -d srv_dev -U u_srv_dev -f /docker-entrypoint-initdb.d/scripts/13-SQL_v1.1.7_ComplCOM.sql

# Hors Version : Intégration de données aléatoires pour avoir un peu de matière
#psql -d srv_dev -U u_srv_dev -f /docker-entrypoint-initdb.d/scripts/99-CreationListeNomPrenom.sql
#psql -d srv_dev -U u_srv_dev -f /docker-entrypoint-initdb.d/scripts/99-PeuplementInterventions.sql