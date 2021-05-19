alter table utilisateur 
add column UTI_SITEWEB varchar(200) null, 
add column UTI_ADRESSE          VARCHAR(50)     null,
add column UTI_COMPLEMENTADRESSE VARCHAR(50)     null,
add column UTI_COM_CODEINSEE    VARCHAR(5)      null,
add column UTI_COM_CODEPOSTAL   VARCHAR(5)      null,
add column UTI_MAILCONTACT    VARCHAR(50)      null,
add column UTI_TELEPHONE       VARCHAR(10)      null,
add column UTI_AUTORISEPUBLICARTE   BOOLEAN default false;


/*
update utilisateur set uti_adresse ='adresse', uti_complementadresse ='complement adresse', uti_com_codeinsee='95306', uti_com_codepostal='95220', uti_com_libelle='HERBLAY', uti_mailcontact='dkfsolds@dsjdks.fr', uti_telephone = '0123456789', uti_autorisepublicarte=true where uti_id = 12;
*/