PGDMP                      
    |            oldbone_beats    15.1    15.1 !                0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            !           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            "           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            #           1262    16498    oldbone_beats    DATABASE     �   CREATE DATABASE oldbone_beats WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'Russian_Russia.1251';
    DROP DATABASE oldbone_beats;
                postgres    false            m           1247    16551    storage_object    TYPE     �   CREATE TYPE public.storage_object AS (
	id_ integer,
	name_ text,
	creation_date bigint,
	pid integer,
	type_ text,
	filename text,
	icon_ text,
	func_type text,
	func_type_id smallint
);
 !   DROP TYPE public.storage_object;
       public          postgres    false            �            1255    16564 1   create_object_type(text, text, smallint, boolean)    FUNCTION       CREATE FUNCTION public.create_object_type(type_name text, icon_ text, func_type_id smallint, publishable boolean) RETURNS smallint
    LANGUAGE plpgsql
    AS $$
declare
	current_id smallint;
	next_id smallint;
begin
	select max(ot.id_) into current_id from object_types ot;
	
	if current_id is NULL then
		current_id = 0;
	end if;
	
	next_id := current_id + 1;
	
	insert into object_types(id_, type_, icon_, func_type_id, publishable) values (next_id, type_name, icon_, func_type_id, publishable);
	
	return next_id; 
end;
$$;
 q   DROP FUNCTION public.create_object_type(type_name text, icon_ text, func_type_id smallint, publishable boolean);
       public          postgres    false            �            1255    16553 <   create_storage_object(text, bigint, smallint, text, integer)    FUNCTION     n  CREATE FUNCTION public.create_storage_object(name_ text, creation_date bigint, type_id smallint, filename text, pid integer) RETURNS integer
    LANGUAGE plpgsql
    AS $$
declare
	v_pid integer;
	current_id integer;
	next_id integer;
begin
	select max(id_) into current_id from storage_objects;
	
	if current_id is NULL then
		current_id = 0;
	end if;
	v_pid := pid;
	
	if v_pid is null then
		v_pid := 0;
	end if;
	
	next_id := current_id + 1;
	
	insert into storage_objects(id_, pid, name_, creation_date, type_id, filename) values (next_id, v_pid, name_, creation_date, type_id, filename);
	
	return next_id;
end;
$$;
 |   DROP FUNCTION public.create_storage_object(name_ text, creation_date bigint, type_id smallint, filename text, pid integer);
       public          postgres    false            �            1255    16562    delete_object_type(integer)    FUNCTION     b  CREATE FUNCTION public.delete_object_type(id_ integer) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
declare
	has_children boolean;
begin
	select distinct true into has_children from storage_objects so where so.pid = id_; 
	if has_children is true then
		return false;
	end if;
	delete from object_types ot where ot.id_ = id_; 
	
	return true;
end;
$$;
 6   DROP FUNCTION public.delete_object_type(id_ integer);
       public          postgres    false            �            1255    16602 !   delete_storage_objects(integer[])    FUNCTION       CREATE FUNCTION public.delete_storage_objects(ids integer[]) RETURNS integer
    LANGUAGE plpgsql
    AS $$
declare
	iterator int;
begin
	foreach iterator in array ids loop 
		delete from storage_objects where id_ = iterator; 
	end loop;
	
	
	return 1;
end;
$$;
 <   DROP FUNCTION public.delete_storage_objects(ids integer[]);
       public          postgres    false            �            1255    16597    get_all_storage_objects()    FUNCTION     �  CREATE FUNCTION public.get_all_storage_objects() RETURNS SETOF public.storage_object
    LANGUAGE plpgsql
    AS $$
declare
	objref refcursor;
	store_data storage_object;
begin
	open objref for
	select 
		so.id_ id_,
		so.name_ name_,
		so.creation_date creation_date,
		so.pid pid,
		st.type_ type_,
		so.filename filename,
		st.icon_ icon_,
		ft.func_type func_type,
		st.func_type_id func_type_id
	from 
		storage_objects so 
	join 
		object_types st 
	on 
		so.type_id = st.id_
	join 
		functional_types ft
	on
		st.func_type_id = ft.id;
	loop
		fetch from objref into store_data;
		exit when not found;
		return next store_data;
	end loop;
	close objref;
end;
$$;
 0   DROP FUNCTION public.get_all_storage_objects();
       public          postgres    false    877            �            1259    16544    object_types    TABLE     �   CREATE TABLE public.object_types (
    id_ smallint,
    type_ text,
    icon_ text,
    func_type_id smallint,
    publishable boolean
);
     DROP TABLE public.object_types;
       public         heap    postgres    false            $           0    0    TABLE object_types    ACL     D   GRANT SELECT,INSERT,UPDATE ON TABLE public.object_types TO oldbone;
          public          postgres    false    220            �            1255    16604    get_object_types()    FUNCTION     �  CREATE FUNCTION public.get_object_types() RETURNS SETOF public.object_types
    LANGUAGE plpgsql
    AS $$
declare
	objref refcursor;
	types_data object_types;
begin
	open objref for
	select 
		ot.id_ id_,
		ot.type_ as name_,
		ot.icon_ icon,
		ot.func_type_id func_type_id,
		ot.publishable publishable
	from 
		object_types ot;
	loop
		fetch from objref into types_data;
		exit when not found;
		return next types_data;
	end loop;
	close objref;
end;
$$;
 )   DROP FUNCTION public.get_object_types();
       public          postgres    false    220            �            1259    16513    users    TABLE     M   CREATE TABLE public.users (
    id uuid,
    username text,
    role text
);
    DROP TABLE public.users;
       public         heap    postgres    false            %           0    0    TABLE users    ACL     �   GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.users TO ext_user;
GRANT SELECT,INSERT,UPDATE ON TABLE public.users TO oldbone;
          public          postgres    false    217            �            1255    16532 6   get_user_by_cred(character varying, character varying)    FUNCTION     �  CREATE FUNCTION public.get_user_by_cred(l_hash character varying, p_hash character varying) RETURNS public.users
    LANGUAGE plpgsql
    AS $$
declare
	uid uuid;
	userref refcursor;
	usr users;
begin
	select id into uid from user_auth where uslog = l_hash and uspas = p_hash;
	
	if uid is NULL then
		return NULL;
	end if;
	
	open userref for select id, username, role from users where users.id = uid; 
	fetch userref into usr;
	close userref;
	
	return usr;
end;
$$;
 [   DROP FUNCTION public.get_user_by_cred(l_hash character varying, p_hash character varying);
       public          postgres    false    217            &           0    0 M   FUNCTION get_user_by_cred(l_hash character varying, p_hash character varying)    ACL     n   GRANT ALL ON FUNCTION public.get_user_by_cred(l_hash character varying, p_hash character varying) TO oldbone;
          public          postgres    false    223            �            1255    16535    get_user_by_uuid(uuid)    FUNCTION     �   CREATE FUNCTION public.get_user_by_uuid(uid uuid) RETURNS public.users
    LANGUAGE plpgsql
    AS $$
declare
	usr users;
begin
	select id, username, role into usr from users where id = uid;
	
	return usr;
end;
$$;
 1   DROP FUNCTION public.get_user_by_uuid(uid uuid);
       public          postgres    false    217            �            1255    16534 9   register_user(text, character varying, character varying)    FUNCTION     E  CREATE FUNCTION public.register_user(usrname text, l_hash character varying, p_hash character varying) RETURNS uuid
    LANGUAGE plpgsql
    AS $$
declare
	uid uuid;
	urole text;
begin
	select id into uid from users where users.username = usrname;
	
	if uid is not NULL then
		return NULL;
	end if;
	
	uid := gen_random_uuid();
	urole := 'user';
										  
	insert into users(id, username, role) values (uid, usrname, urole);
	
	insert into user_auth(id, uslog, uspas) values(uid, l_hash, p_hash);
	
	insert into user_tokens(id, token) values(uid, '');


	
	return uid;
end;
$$;
 f   DROP FUNCTION public.register_user(usrname text, l_hash character varying, p_hash character varying);
       public          postgres    false            �            1255    16600 +   replace_storage_objects(integer[], integer)    FUNCTION       CREATE FUNCTION public.replace_storage_objects(ids integer[], pid_ integer) RETURNS integer
    LANGUAGE plpgsql
    AS $$
declare
	iterator int;
begin
	foreach iterator in array ids loop 
		update storage_objects set pid = pid_ where id_ = iterator;
	end loop;
	
	return 1;
end;
$$;
 K   DROP FUNCTION public.replace_storage_objects(ids integer[], pid_ integer);
       public          postgres    false            �            1255    16533    update_user_token(uuid, text)    FUNCTION     �   CREATE FUNCTION public.update_user_token(uid uuid, usertoken text) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
begin
	update user_tokens set token = usertoken where id = uid;
	commit;
	
	return 1;
end;
$$;
 B   DROP FUNCTION public.update_user_token(uid uuid, usertoken text);
       public          postgres    false            �            1259    16509    albumn    TABLE     P   CREATE TABLE public.albumn (
    id uuid,
    musics_count integer DEFAULT 0
);
    DROP TABLE public.albumn;
       public         heap    postgres    false            '           0    0    TABLE albumn    ACL     �   GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.albumn TO ext_user;
GRANT SELECT,INSERT,UPDATE ON TABLE public.albumn TO oldbone;
          public          postgres    false    216            �            1259    16504    beats    TABLE     <   CREATE TABLE public.beats (
    id uuid,
    albumn uuid
);
    DROP TABLE public.beats;
       public         heap    postgres    false            (           0    0    TABLE beats    ACL     �   GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.beats TO ext_user;
GRANT SELECT,INSERT,UPDATE ON TABLE public.beats TO oldbone;
          public          postgres    false    215            �            1259    16554    functional_types    TABLE     N   CREATE TABLE public.functional_types (
    id smallint,
    func_type text
);
 $   DROP TABLE public.functional_types;
       public         heap    postgres    false            )           0    0    TABLE functional_types    ACL     H   GRANT SELECT,INSERT,UPDATE ON TABLE public.functional_types TO oldbone;
          public          postgres    false    222            �            1259    16499    storage_objects    TABLE     �   CREATE TABLE public.storage_objects (
    name_ text,
    creation_date bigint,
    filename text,
    id_ integer,
    pid integer,
    type_id smallint
);
 #   DROP TABLE public.storage_objects;
       public         heap    postgres    false            *           0    0    TABLE storage_objects    ACL     �   GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.storage_objects TO ext_user;
GRANT SELECT,INSERT,UPDATE ON TABLE public.storage_objects TO oldbone;
          public          postgres    false    214            �            1259    16518 	   user_auth    TABLE     O   CREATE TABLE public.user_auth (
    id uuid,
    uslog text,
    uspas text
);
    DROP TABLE public.user_auth;
       public         heap    postgres    false            +           0    0    TABLE user_auth    ACL     �   GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.user_auth TO ext_user;
GRANT SELECT,INSERT,UPDATE ON TABLE public.user_auth TO oldbone;
          public          postgres    false    218            �            1259    16525    user_tokens    TABLE     A   CREATE TABLE public.user_tokens (
    id uuid,
    token text
);
    DROP TABLE public.user_tokens;
       public         heap    postgres    false            ,           0    0    TABLE user_tokens    ACL     C   GRANT SELECT,INSERT,UPDATE ON TABLE public.user_tokens TO oldbone;
          public          postgres    false    219           