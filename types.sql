drop type storage_object;
create type storage_object as(
	id_ integer, 
	name_ text,
	creation_date bigint,
	pid integer,
	type_id smallint,
	type_ text,
	filename text,
	icon_ text,
	func_type_id smallint
)

select * from functional_types;