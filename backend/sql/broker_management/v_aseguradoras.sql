-- ? Esta vista nos permite obtener todas las aseguradoras
-- tomando especificamente su id, su nombre y su terminacion de correo esto
-- mas que todo para poder mostrar data en la pagina de sign up

create or replace view viewInformacionAseguradorasBasica as
       select
            Aseguradoras.id_aseguradora,
            Aseguradoras.nombre_aseguradora,
            Aseguradoras.dominio_correo_aseguradora
       from Aseguradoras;

-- ? Esta segunda vista nos permite obtener la informacion detallada de todas las
-- aseguradoras para el manejo interno de la aplicacion

create or replace view viewInformacionAseguradorasFull as
    select *
    from Aseguradoras;