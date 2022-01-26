
-- Données utilisateur avant reprise multistructure
select uti.uti_id, str.str_id, str.str_libellecourt, str_libelle, str.str_typecollectivite, uti.uti_structurelocale
				from utilisateur uti
				inner join structure str on str.str_id = uti.str_id 
order by uti.uti_id;

-- Données utilisateur après reprise multistructure				
select * from utilisateur uti
inner join uti_str ust on ust.uti_id = uti.uti_id
inner join structure str on str.str_id = ust.str_id
order by uti.uti_id;