-- Suppression de la colonne int_relancemail pour la recréer en INTEGER
-- Objectif : pouvoir avoir plusieurs était de relance
ALTER TABLE public.intervention DROP COLUMN int_relancemail;
ALTER TABLE public.intervention ADD int_relancemail INTEGER Default 0;
