
-- A ne passer qu'une seule fois sur la base d'intégration (Passage V1.0.2)
alter table structure add  str_libellecourt_tmp varchar(100);
alter table structure add str_libelle_tmp varchar(150);
update structure set str_libellecourt_tmp  = str_libelle, str_libelle_tmp  = str_libellecourt;
update structure set str_libelle  = str_libelle_tmp, str_libellecourt  = str_libellecourt_tmp;
alter table structure drop column str_libellecourt_tmp;
alter table structure drop column str_libelle_tmp;
