--
-- PostgreSQL database dump
--

\restrict sNeObwJ6fe6v0RuCjIgrU8IHmmviamjF5ER0JIj2eY61jzofE57L67ucIYTPCik

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.6 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: auth; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA auth;


ALTER SCHEMA auth OWNER TO supabase_admin;

--
-- Name: extensions; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA extensions;


ALTER SCHEMA extensions OWNER TO postgres;

--
-- Name: graphql; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA graphql;


ALTER SCHEMA graphql OWNER TO supabase_admin;

--
-- Name: graphql_public; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA graphql_public;


ALTER SCHEMA graphql_public OWNER TO supabase_admin;

--
-- Name: pgbouncer; Type: SCHEMA; Schema: -; Owner: pgbouncer
--

CREATE SCHEMA pgbouncer;


ALTER SCHEMA pgbouncer OWNER TO pgbouncer;

--
-- Name: realtime; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA realtime;


ALTER SCHEMA realtime OWNER TO supabase_admin;

--
-- Name: storage; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA storage;


ALTER SCHEMA storage OWNER TO supabase_admin;

--
-- Name: supabase_migrations; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA supabase_migrations;


ALTER SCHEMA supabase_migrations OWNER TO postgres;

--
-- Name: vault; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA vault;


ALTER SCHEMA vault OWNER TO supabase_admin;

--
-- Name: citext; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS citext WITH SCHEMA public;


--
-- Name: EXTENSION citext; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION citext IS 'data type for case-insensitive character strings';


--
-- Name: pg_graphql; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_graphql WITH SCHEMA graphql;


--
-- Name: EXTENSION pg_graphql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_graphql IS 'pg_graphql: GraphQL support';


--
-- Name: pg_stat_statements; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_stat_statements WITH SCHEMA extensions;


--
-- Name: EXTENSION pg_stat_statements; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_stat_statements IS 'track planning and execution statistics of all SQL statements executed';


--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: supabase_vault; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS supabase_vault WITH SCHEMA vault;


--
-- Name: EXTENSION supabase_vault; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION supabase_vault IS 'Supabase Vault Extension';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: aal_level; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.aal_level AS ENUM (
    'aal1',
    'aal2',
    'aal3'
);


ALTER TYPE auth.aal_level OWNER TO supabase_auth_admin;

--
-- Name: code_challenge_method; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.code_challenge_method AS ENUM (
    's256',
    'plain'
);


ALTER TYPE auth.code_challenge_method OWNER TO supabase_auth_admin;

--
-- Name: factor_status; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.factor_status AS ENUM (
    'unverified',
    'verified'
);


ALTER TYPE auth.factor_status OWNER TO supabase_auth_admin;

--
-- Name: factor_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.factor_type AS ENUM (
    'totp',
    'webauthn',
    'phone'
);


ALTER TYPE auth.factor_type OWNER TO supabase_auth_admin;

--
-- Name: one_time_token_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.one_time_token_type AS ENUM (
    'confirmation_token',
    'reauthentication_token',
    'recovery_token',
    'email_change_token_new',
    'email_change_token_current',
    'phone_change_token'
);


ALTER TYPE auth.one_time_token_type OWNER TO supabase_auth_admin;

--
-- Name: country_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.country_enum AS ENUM (
    'Nigeria',
    'Benin',
    'Gambia'
);


ALTER TYPE public.country_enum OWNER TO postgres;

--
-- Name: export_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.export_status_enum AS ENUM (
    'pending',
    'processing',
    'completed',
    'failed'
);


ALTER TYPE public.export_status_enum OWNER TO postgres;

--
-- Name: file_type_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.file_type_enum AS ENUM (
    'image',
    'pdf',
    'video',
    'audio',
    'document',
    'other'
);


ALTER TYPE public.file_type_enum OWNER TO postgres;

--
-- Name: language_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.language_enum AS ENUM (
    'English',
    'French'
);


ALTER TYPE public.language_enum OWNER TO postgres;

--
-- Name: milestone_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.milestone_status_enum AS ENUM (
    'planned',
    'in_progress',
    'achieved',
    'delayed',
    'cancelled'
);


ALTER TYPE public.milestone_status_enum OWNER TO postgres;

--
-- Name: organisation_affiliation_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.organisation_affiliation_status_enum AS ENUM (
    'pending',
    'approved',
    'rejected',
    'cancelled'
);


ALTER TYPE public.organisation_affiliation_status_enum OWNER TO postgres;

--
-- Name: organisation_size_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.organisation_size_enum AS ENUM (
    'Local',
    'National',
    'Regional',
    'International'
);


ALTER TYPE public.organisation_size_enum OWNER TO postgres;

--
-- Name: organisation_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.organisation_status_enum AS ENUM (
    'active',
    'pending_approval',
    'flagged',
    'inactive'
);


ALTER TYPE public.organisation_status_enum OWNER TO postgres;

--
-- Name: organisation_type_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.organisation_type_enum AS ENUM (
    'NGO',
    'CBO',
    'Network',
    'Foundation',
    'Coalition',
    'Association',
    'Cooperative',
    'Other'
);


ALTER TYPE public.organisation_type_enum OWNER TO postgres;

--
-- Name: post_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.post_status_enum AS ENUM (
    'draft',
    'published',
    'archived',
    'flagged'
);


ALTER TYPE public.post_status_enum OWNER TO postgres;

--
-- Name: project_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.project_status_enum AS ENUM (
    'planning',
    'ongoing',
    'completed',
    'cancelled',
    'on_hold'
);


ALTER TYPE public.project_status_enum OWNER TO postgres;

--
-- Name: target_population_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.target_population_enum AS ENUM (
    'youth',
    'women',
    'people_living_with_disability',
    'children',
    'adolescents',
    'men',
    'older_persons',
    'students',
    'faith_leaders',
    'traditional_leaders',
    'community_leaders',
    'policy_makers',
    'journalists_media',
    'researchers',
    'civil_society_organizations',
    'minority_groups',
    'vulnerable_groups',
    'idps_refugees',
    'prisoners',
    'consumers',
    'general_public',
    'voting_population',
    'out_of_school_children',
    'rural_populations',
    'marginalized_communities',
    'other'
);


ALTER TYPE public.target_population_enum OWNER TO postgres;

--
-- Name: TYPE target_population_enum; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TYPE public.target_population_enum IS 'Enumeration of target populations served by organizations based on survey data';


--
-- Name: user_role_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.user_role_enum AS ENUM (
    'admin',
    'cso_rep',
    'donor',
    'media',
    'policy_maker',
    'public'
);


ALTER TYPE public.user_role_enum OWNER TO postgres;

--
-- Name: work_method_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.work_method_enum AS ENUM (
    'production_reports_policies',
    'fact_checking',
    'data_collection_analysis',
    'advocacy_awareness_campaigns',
    'training_capacity_building',
    'social_dialogue_community_dialogue',
    'organizing_conferences_seminars',
    'election_monitoring_observation',
    'networking_partnerships',
    'documentation_needs_assessment',
    'consultancy_outreach_support',
    'media_content_production',
    'mobile_app_development',
    'summer_coaching_camps',
    'skill_acquisition_training',
    'deradicalization_empowerment',
    'child_protection_services',
    'other'
);


ALTER TYPE public.work_method_enum OWNER TO postgres;

--
-- Name: TYPE work_method_enum; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TYPE public.work_method_enum IS 'Enumeration of primary work methods used by organizations based on survey data';


--
-- Name: action; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.action AS ENUM (
    'INSERT',
    'UPDATE',
    'DELETE',
    'TRUNCATE',
    'ERROR'
);


ALTER TYPE realtime.action OWNER TO supabase_admin;

--
-- Name: equality_op; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.equality_op AS ENUM (
    'eq',
    'neq',
    'lt',
    'lte',
    'gt',
    'gte',
    'in'
);


ALTER TYPE realtime.equality_op OWNER TO supabase_admin;

--
-- Name: user_defined_filter; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.user_defined_filter AS (
	column_name text,
	op realtime.equality_op,
	value text
);


ALTER TYPE realtime.user_defined_filter OWNER TO supabase_admin;

--
-- Name: wal_column; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.wal_column AS (
	name text,
	type_name text,
	type_oid oid,
	value jsonb,
	is_pkey boolean,
	is_selectable boolean
);


ALTER TYPE realtime.wal_column OWNER TO supabase_admin;

--
-- Name: wal_rls; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.wal_rls AS (
	wal jsonb,
	is_rls_enabled boolean,
	subscription_ids uuid[],
	errors text[]
);


ALTER TYPE realtime.wal_rls OWNER TO supabase_admin;

--
-- Name: buckettype; Type: TYPE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TYPE storage.buckettype AS ENUM (
    'STANDARD',
    'ANALYTICS'
);


ALTER TYPE storage.buckettype OWNER TO supabase_storage_admin;

--
-- Name: email(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.email() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.email', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'email')
  )::text
$$;


ALTER FUNCTION auth.email() OWNER TO supabase_auth_admin;

--
-- Name: FUNCTION email(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION auth.email() IS 'Deprecated. Use auth.jwt() -> ''email'' instead.';


--
-- Name: jwt(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.jwt() RETURNS jsonb
    LANGUAGE sql STABLE
    AS $$
  select 
    coalesce(
        nullif(current_setting('request.jwt.claim', true), ''),
        nullif(current_setting('request.jwt.claims', true), '')
    )::jsonb
$$;


ALTER FUNCTION auth.jwt() OWNER TO supabase_auth_admin;

--
-- Name: role(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.role() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.role', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role')
  )::text
$$;


ALTER FUNCTION auth.role() OWNER TO supabase_auth_admin;

--
-- Name: FUNCTION role(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION auth.role() IS 'Deprecated. Use auth.jwt() -> ''role'' instead.';


--
-- Name: uid(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.uid() RETURNS uuid
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.sub', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
  )::uuid
$$;


ALTER FUNCTION auth.uid() OWNER TO supabase_auth_admin;

--
-- Name: FUNCTION uid(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION auth.uid() IS 'Deprecated. Use auth.jwt() -> ''sub'' instead.';


--
-- Name: grant_pg_cron_access(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.grant_pg_cron_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF EXISTS (
    SELECT
    FROM pg_event_trigger_ddl_commands() AS ev
    JOIN pg_extension AS ext
    ON ev.objid = ext.oid
    WHERE ext.extname = 'pg_cron'
  )
  THEN
    grant usage on schema cron to postgres with grant option;

    alter default privileges in schema cron grant all on tables to postgres with grant option;
    alter default privileges in schema cron grant all on functions to postgres with grant option;
    alter default privileges in schema cron grant all on sequences to postgres with grant option;

    alter default privileges for user supabase_admin in schema cron grant all
        on sequences to postgres with grant option;
    alter default privileges for user supabase_admin in schema cron grant all
        on tables to postgres with grant option;
    alter default privileges for user supabase_admin in schema cron grant all
        on functions to postgres with grant option;

    grant all privileges on all tables in schema cron to postgres with grant option;
    revoke all on table cron.job from postgres;
    grant select on table cron.job to postgres with grant option;
  END IF;
END;
$$;


ALTER FUNCTION extensions.grant_pg_cron_access() OWNER TO supabase_admin;

--
-- Name: FUNCTION grant_pg_cron_access(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.grant_pg_cron_access() IS 'Grants access to pg_cron';


--
-- Name: grant_pg_graphql_access(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.grant_pg_graphql_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $_$
DECLARE
    func_is_graphql_resolve bool;
BEGIN
    func_is_graphql_resolve = (
        SELECT n.proname = 'resolve'
        FROM pg_event_trigger_ddl_commands() AS ev
        LEFT JOIN pg_catalog.pg_proc AS n
        ON ev.objid = n.oid
    );

    IF func_is_graphql_resolve
    THEN
        -- Update public wrapper to pass all arguments through to the pg_graphql resolve func
        DROP FUNCTION IF EXISTS graphql_public.graphql;
        create or replace function graphql_public.graphql(
            "operationName" text default null,
            query text default null,
            variables jsonb default null,
            extensions jsonb default null
        )
            returns jsonb
            language sql
        as $$
            select graphql.resolve(
                query := query,
                variables := coalesce(variables, '{}'),
                "operationName" := "operationName",
                extensions := extensions
            );
        $$;

        -- This hook executes when `graphql.resolve` is created. That is not necessarily the last
        -- function in the extension so we need to grant permissions on existing entities AND
        -- update default permissions to any others that are created after `graphql.resolve`
        grant usage on schema graphql to postgres, anon, authenticated, service_role;
        grant select on all tables in schema graphql to postgres, anon, authenticated, service_role;
        grant execute on all functions in schema graphql to postgres, anon, authenticated, service_role;
        grant all on all sequences in schema graphql to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on tables to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on functions to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on sequences to postgres, anon, authenticated, service_role;

        -- Allow postgres role to allow granting usage on graphql and graphql_public schemas to custom roles
        grant usage on schema graphql_public to postgres with grant option;
        grant usage on schema graphql to postgres with grant option;
    END IF;

END;
$_$;


ALTER FUNCTION extensions.grant_pg_graphql_access() OWNER TO supabase_admin;

--
-- Name: FUNCTION grant_pg_graphql_access(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.grant_pg_graphql_access() IS 'Grants access to pg_graphql';


--
-- Name: grant_pg_net_access(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.grant_pg_net_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_event_trigger_ddl_commands() AS ev
    JOIN pg_extension AS ext
    ON ev.objid = ext.oid
    WHERE ext.extname = 'pg_net'
  )
  THEN
    IF NOT EXISTS (
      SELECT 1
      FROM pg_roles
      WHERE rolname = 'supabase_functions_admin'
    )
    THEN
      CREATE USER supabase_functions_admin NOINHERIT CREATEROLE LOGIN NOREPLICATION;
    END IF;

    GRANT USAGE ON SCHEMA net TO supabase_functions_admin, postgres, anon, authenticated, service_role;

    IF EXISTS (
      SELECT FROM pg_extension
      WHERE extname = 'pg_net'
      -- all versions in use on existing projects as of 2025-02-20
      -- version 0.12.0 onwards don't need these applied
      AND extversion IN ('0.2', '0.6', '0.7', '0.7.1', '0.8', '0.10.0', '0.11.0')
    ) THEN
      ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;
      ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;

      ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;
      ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;

      REVOKE ALL ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;
      REVOKE ALL ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;

      GRANT EXECUTE ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
      GRANT EXECUTE ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
    END IF;
  END IF;
END;
$$;


ALTER FUNCTION extensions.grant_pg_net_access() OWNER TO supabase_admin;

--
-- Name: FUNCTION grant_pg_net_access(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.grant_pg_net_access() IS 'Grants access to pg_net';


--
-- Name: pgrst_ddl_watch(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.pgrst_ddl_watch() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN SELECT * FROM pg_event_trigger_ddl_commands()
  LOOP
    IF cmd.command_tag IN (
      'CREATE SCHEMA', 'ALTER SCHEMA'
    , 'CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO', 'ALTER TABLE'
    , 'CREATE FOREIGN TABLE', 'ALTER FOREIGN TABLE'
    , 'CREATE VIEW', 'ALTER VIEW'
    , 'CREATE MATERIALIZED VIEW', 'ALTER MATERIALIZED VIEW'
    , 'CREATE FUNCTION', 'ALTER FUNCTION'
    , 'CREATE TRIGGER'
    , 'CREATE TYPE', 'ALTER TYPE'
    , 'CREATE RULE'
    , 'COMMENT'
    )
    -- don't notify in case of CREATE TEMP table or other objects created on pg_temp
    AND cmd.schema_name is distinct from 'pg_temp'
    THEN
      NOTIFY pgrst, 'reload schema';
    END IF;
  END LOOP;
END; $$;


ALTER FUNCTION extensions.pgrst_ddl_watch() OWNER TO supabase_admin;

--
-- Name: pgrst_drop_watch(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.pgrst_drop_watch() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  obj record;
BEGIN
  FOR obj IN SELECT * FROM pg_event_trigger_dropped_objects()
  LOOP
    IF obj.object_type IN (
      'schema'
    , 'table'
    , 'foreign table'
    , 'view'
    , 'materialized view'
    , 'function'
    , 'trigger'
    , 'type'
    , 'rule'
    )
    AND obj.is_temporary IS false -- no pg_temp objects
    THEN
      NOTIFY pgrst, 'reload schema';
    END IF;
  END LOOP;
END; $$;


ALTER FUNCTION extensions.pgrst_drop_watch() OWNER TO supabase_admin;

--
-- Name: set_graphql_placeholder(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.set_graphql_placeholder() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $_$
    DECLARE
    graphql_is_dropped bool;
    BEGIN
    graphql_is_dropped = (
        SELECT ev.schema_name = 'graphql_public'
        FROM pg_event_trigger_dropped_objects() AS ev
        WHERE ev.schema_name = 'graphql_public'
    );

    IF graphql_is_dropped
    THEN
        create or replace function graphql_public.graphql(
            "operationName" text default null,
            query text default null,
            variables jsonb default null,
            extensions jsonb default null
        )
            returns jsonb
            language plpgsql
        as $$
            DECLARE
                server_version float;
            BEGIN
                server_version = (SELECT (SPLIT_PART((select version()), ' ', 2))::float);

                IF server_version >= 14 THEN
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql extension is not enabled.'
                            )
                        )
                    );
                ELSE
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql is only available on projects running Postgres 14 onwards.'
                            )
                        )
                    );
                END IF;
            END;
        $$;
    END IF;

    END;
$_$;


ALTER FUNCTION extensions.set_graphql_placeholder() OWNER TO supabase_admin;

--
-- Name: FUNCTION set_graphql_placeholder(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.set_graphql_placeholder() IS 'Reintroduces placeholder function for graphql_public.graphql';


--
-- Name: get_auth(text); Type: FUNCTION; Schema: pgbouncer; Owner: supabase_admin
--

CREATE FUNCTION pgbouncer.get_auth(p_usename text) RETURNS TABLE(username text, password text)
    LANGUAGE plpgsql SECURITY DEFINER
    AS $_$
begin
    raise debug 'PgBouncer auth request: %', p_usename;

    return query
    select 
        rolname::text, 
        case when rolvaliduntil < now() 
            then null 
            else rolpassword::text 
        end 
    from pg_authid 
    where rolname=$1 and rolcanlogin;
end;
$_$;


ALTER FUNCTION pgbouncer.get_auth(p_usename text) OWNER TO supabase_admin;

--
-- Name: auto_assign_cso_rep_role(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.auto_assign_cso_rep_role() RETURNS trigger
    LANGUAGE plpgsql
    AS $$BEGIN
    -- Check if the organization status changed from pending_approval to active
    IF NEW.status = 'active' AND OLD.status = 'pending_approval' THEN
        -- Insert the creator as a cso_rep in the roles table
        INSERT INTO roles (user_id, role, assigned_at, assigned_by, created_at)
        VALUES (
            NEW.created_by,           -- The user who created the organization
            'cso_rep',                -- Role to assign
            NOW(),                    -- When the role was assigned
            auth.uid(),               -- Who approved the organization (current admin user)
            NOW()                     -- When the role record was created
        )
        ON CONFLICT (user_id) DO UPDATE SET
            assigned_at = NOW(),
            assigned_by = auth.uid();
        
        -- Update the user's profile to set their organisation_id
        UPDATE profiles 
        SET organisation_id = NEW.id,
            updated_at = NOW()
        WHERE id = NEW.created_by;
    END IF;
    
    RETURN NEW;
END;$$;


ALTER FUNCTION public.auto_assign_cso_rep_role() OWNER TO postgres;

--
-- Name: change_organisation_status(uuid, public.organisation_status_enum, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.change_organisation_status(org_id uuid, new_status public.organisation_status_enum, admin_notes text DEFAULT NULL::text) RETURNS boolean
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    current_org_status organisation_status_enum;
BEGIN
    -- Check if user is admin using the safe function
    IF NOT check_user_role('admin') THEN
        RAISE EXCEPTION 'Only admin users can change organisation status';
    END IF;
    
    -- Get current organisation status
    SELECT status INTO current_org_status
    FROM organisations
    WHERE id = org_id;
    
    -- Check if organisation exists
    IF current_org_status IS NULL THEN
        RAISE EXCEPTION 'Organisation not found';
    END IF;
    
    -- Update organisation status
    UPDATE organisations 
    SET 
        status = new_status,
        updated_at = NOW()
    WHERE id = org_id;
    
    -- Return success
    RETURN TRUE;
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Failed to change organisation status: %', SQLERRM;
END;
$$;


ALTER FUNCTION public.change_organisation_status(org_id uuid, new_status public.organisation_status_enum, admin_notes text) OWNER TO postgres;

--
-- Name: check_user_role(public.user_role_enum); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.check_user_role(target_role public.user_role_enum DEFAULT 'admin'::public.user_role_enum) RETURNS boolean
    LANGUAGE plpgsql STABLE SECURITY DEFINER
    AS $$
BEGIN
    -- Use a direct query without triggering RLS policies
    RETURN EXISTS (
        SELECT 1 FROM public.roles 
        WHERE user_id = auth.uid() 
        AND role = target_role
    );
END;
$$;


ALTER FUNCTION public.check_user_role(target_role public.user_role_enum) OWNER TO postgres;

--
-- Name: create_audit_log(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.create_audit_log() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
    INSERT INTO audit_logs (
        table_name,
        record_id,
        action,
        old_values,
        new_values,
        changed_fields,
        user_id,
        user_email
    ) VALUES (
        TG_TABLE_NAME,
        COALESCE(NEW.id, OLD.id),
        TG_OP,
        CASE WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD) ELSE NULL END,
        CASE WHEN TG_OP = 'INSERT' THEN to_jsonb(NEW) ELSE to_jsonb(NEW) END,
        CASE 
            WHEN TG_OP = 'UPDATE' THEN 
                ARRAY(SELECT key FROM jsonb_each(to_jsonb(NEW)) WHERE to_jsonb(NEW) ->> key IS DISTINCT FROM to_jsonb(OLD) ->> key)
            ELSE NULL 
        END,
        COALESCE(NEW.created_by, auth.uid()),
        auth.email()
    );
    RETURN COALESCE(NEW, OLD);
END;
$$;


ALTER FUNCTION public.create_audit_log() OWNER TO postgres;

--
-- Name: create_forum_reply(uuid, text, uuid); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.create_forum_reply(thread_id_param uuid, content_param text, parent_reply_id_param uuid DEFAULT NULL::uuid) RETURNS json
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    new_reply_id uuid;
    result json;
BEGIN
    -- Check if user is authenticated
    IF auth.uid() IS NULL THEN
        RETURN json_build_object('success', false, 'message', 'User not authenticated');
    END IF;
    
    -- Check if thread exists
    IF NOT EXISTS (SELECT 1 FROM forum_threads WHERE id = thread_id_param) THEN
        RETURN json_build_object('success', false, 'message', 'Thread not found');
    END IF;
    
    -- If this is a reply to another reply, check if parent reply exists
    IF parent_reply_id_param IS NOT NULL THEN
        IF NOT EXISTS (SELECT 1 FROM forum_replies WHERE id = parent_reply_id_param) THEN
            RETURN json_build_object('success', false, 'message', 'Parent reply not found');
        END IF;
    END IF;
    
    -- Create the reply
    INSERT INTO forum_replies (thread_id, parent_reply_id, content, author_id)
    VALUES (thread_id_param, parent_reply_id_param, content_param, auth.uid())
    RETURNING id INTO new_reply_id;
    
    -- Update reply count on the thread
    UPDATE forum_threads 
    SET reply_count = reply_count + 1,
        last_reply_at = now(),
        last_reply_by = auth.uid()
    WHERE id = thread_id_param;
    
    -- Get the created reply with author info
    SELECT json_build_object(
        'success', true,
        'message', 'Reply created successfully',
        'reply', json_build_object(
            'id', fr.id,
            'thread_id', fr.thread_id,
            'parent_reply_id', fr.parent_reply_id,
            'content', fr.content,
            'author_id', fr.author_id,
            'author_name', p.name,
            'author_avatar_url', p.avatar_url,
            'is_solution', fr.is_solution,
            'like_count', fr.like_count,
            'created_at', fr.created_at,
            'updated_at', fr.updated_at,
            'child_replies_count', 0,
            'user_has_liked', false
        )
    ) INTO result
    FROM forum_replies fr
    LEFT JOIN profiles p ON fr.author_id = p.id
    WHERE fr.id = new_reply_id;
    
    RETURN result;
END;
$$;


ALTER FUNCTION public.create_forum_reply(thread_id_param uuid, content_param text, parent_reply_id_param uuid) OWNER TO postgres;

--
-- Name: custom_access_token_hook(jsonb); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.custom_access_token_hook(event jsonb) RETURNS jsonb
    LANGUAGE plpgsql STABLE
    AS $$declare
    claims jsonb;
    user_role public.user_role_enum;
  begin
    -- Fetch the user role from the profiles table
    select role into user_role from public.roles where user_id = (event->>'user_id')::uuid;
    RAISE LOG 'user eventid %',(event->>'user_id')::uuid;
    RAISE LOG 'Role %', user_role;
    claims := event->'claims';

    if user_role is not null then
      -- Set the claim
      claims := jsonb_set(claims, '{user_role}', to_jsonb(user_role));
    else
      claims := jsonb_set(claims, '{user_role}', 'null');
    end if;

    -- Update the 'claims' object in the original event
    event := jsonb_set(event, '{claims}', claims);

    -- Return the modified or original event
    return event;
  end;$$;


ALTER FUNCTION public.custom_access_token_hook(event jsonb) OWNER TO postgres;

--
-- Name: get_forum_categories_with_counts(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_forum_categories_with_counts() RETURNS TABLE(id uuid, name_en text, name_fr text, name_es text, description_en text, description_fr text, description_es text, color_hex text, icon text, sort_order integer, is_active boolean, organization_count bigint, post_count bigint)
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  RETURN QUERY
  SELECT 
    fc.id,
    fc.name_en,
    fc.name_fr,
    fc.name_es,
    fc.description_en,
    fc.description_fr,
    fc.description_es,
    fc.color_hex,
    fc.icon,
    fc.sort_order,
    fc.is_active,
    COALESCE(org_stats.org_count, 0)::bigint as organization_count,
    COALESCE(post_stats.post_count, 0)::bigint as post_count
  FROM forum_categories fc
  LEFT JOIN (
    SELECT 
      ft.category_id,
      COUNT(DISTINCT ft.organisation_id) as org_count
    FROM forum_threads ft
    WHERE ft.organisation_id IS NOT NULL
    GROUP BY ft.category_id
  ) org_stats ON fc.id = org_stats.category_id
  LEFT JOIN (
    SELECT 
      ft.category_id,
      COUNT(*) as post_count
    FROM forum_threads ft
    GROUP BY ft.category_id
  ) post_stats ON fc.id = post_stats.category_id
  WHERE fc.is_active = true
  ORDER BY fc.sort_order ASC, fc.name_en ASC;
END;
$$;


ALTER FUNCTION public.get_forum_categories_with_counts() OWNER TO postgres;

--
-- Name: get_forum_reply_children(uuid, integer, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_forum_reply_children(parent_reply_id_param uuid, limit_param integer DEFAULT 50, offset_param integer DEFAULT 0) RETURNS TABLE(id uuid, thread_id uuid, parent_reply_id uuid, content text, author_id uuid, author_name text, author_avatar_url text, is_solution boolean, like_count integer, created_at timestamp with time zone, updated_at timestamp with time zone, user_has_liked boolean)
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  RETURN QUERY
  SELECT 
    fr.id,
    fr.thread_id,
    fr.parent_reply_id,
    fr.content,
    fr.author_id,
    p.name as author_name,
    p.avatar_url as author_avatar_url,
    fr.is_solution,
    fr.like_count,
    fr.created_at,
    fr.updated_at,
    COALESCE(frl.user_has_liked, false) as user_has_liked
  FROM forum_replies fr
  LEFT JOIN profiles p ON fr.author_id = p.id
  LEFT JOIN (
    SELECT 
      reply_id,
      true as user_has_liked
    FROM forum_reply_likes 
    WHERE user_id = auth.uid()
  ) frl ON fr.id = frl.reply_id
  WHERE fr.parent_reply_id = parent_reply_id_param
  ORDER BY fr.created_at ASC
  LIMIT limit_param
  OFFSET offset_param;
END;
$$;


ALTER FUNCTION public.get_forum_reply_children(parent_reply_id_param uuid, limit_param integer, offset_param integer) OWNER TO postgres;

--
-- Name: get_forum_thread_replies(uuid, integer, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_forum_thread_replies(thread_id_param uuid, limit_param integer DEFAULT 50, offset_param integer DEFAULT 0) RETURNS TABLE(id uuid, thread_id uuid, parent_reply_id uuid, content text, author_id uuid, author_name text, author_avatar_url text, is_solution boolean, like_count integer, created_at timestamp with time zone, updated_at timestamp with time zone, child_replies_count integer, user_has_liked boolean)
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  RETURN QUERY
  SELECT 
    fr.id,
    fr.thread_id,
    fr.parent_reply_id,
    fr.content,
    fr.author_id,
    p.name,
    p.avatar_url,
    fr.is_solution,
    fr.like_count,
    fr.created_at,
    fr.updated_at,
    COALESCE(child_counts.count, 0)::integer,  -- Cast bigint to integer
    COALESCE(frl.user_has_liked, false)
  FROM forum_replies fr
  LEFT JOIN profiles p ON fr.author_id = p.id
  LEFT JOIN (
    SELECT 
      cfr.parent_reply_id as reply_id,
      COUNT(*) as count
    FROM forum_replies cfr
    WHERE cfr.parent_reply_id IS NOT NULL
    GROUP BY cfr.parent_reply_id
  ) child_counts ON fr.id = child_counts.reply_id
  LEFT JOIN (
    SELECT 
      reply_id,
      true as user_has_liked
    FROM forum_reply_likes 
    WHERE user_id = auth.uid()
  ) frl ON fr.id = frl.reply_id
  WHERE fr.thread_id = thread_id_param
    AND fr.parent_reply_id IS NULL  -- Only top-level replies
  ORDER BY fr.is_solution DESC, fr.created_at ASC
  LIMIT limit_param
  OFFSET offset_param;
END;
$$;


ALTER FUNCTION public.get_forum_thread_replies(thread_id_param uuid, limit_param integer, offset_param integer) OWNER TO postgres;

--
-- Name: get_forum_threads_with_likes(uuid, integer, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_forum_threads_with_likes(category_id_param uuid DEFAULT NULL::uuid, limit_param integer DEFAULT 50, offset_param integer DEFAULT 0) RETURNS TABLE(id uuid, title text, content text, created_at timestamp with time zone, updated_at timestamp with time zone, view_count integer, reply_count integer, like_count integer, category_id uuid, tags text[], language text, author_id uuid, organisation_id uuid, author_name text, author_avatar_url text, organisation_name text, organisation_logo_url text, category_name_en text, category_name_fr text, category_name_es text, category_color_hex text, category_icon text, user_has_liked boolean, media jsonb)
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ft.id,
    ft.title,
    ft.content,
    ft.created_at,
    ft.updated_at,
    ft.view_count,
    ft.reply_count,
    ft.like_count,
    ft.category_id,
    ft.tags,
    ft.language::text,
    ft.author_id,
    ft.organisation_id,
    p.name as author_name,
    p.avatar_url as author_avatar_url,
    o.name as organisation_name,
    o.logo_url as organisation_logo_url,
    fc.name_en as category_name_en,
    fc.name_fr as category_name_fr,
    fc.name_es as category_name_es,
    fc.color_hex as category_color_hex,
    fc.icon as category_icon,
    COALESCE(ftl.user_has_liked, false) as user_has_liked,
    COALESCE(
      (
        SELECT jsonb_agg(
          jsonb_build_object(
            'id', fm.id,
            'file_url', fm.file_url,
            'file_name', fm.file_name,
            'file_size', fm.file_size,
            'mime_type', fm.mime_type,
            'file_type', fm.file_type,
            'alt_text', fm.alt_text,
            'is_featured', fm.is_featured,
            'sort_order', fm.sort_order,
            'uploaded_at', fm.uploaded_at
          ) ORDER BY fm.sort_order ASC, fm.is_featured DESC
        )
        FROM forum_media fm
        WHERE fm.thread_id = ft.id
      ),
      '[]'::jsonb
    ) as media
  FROM forum_threads ft
  LEFT JOIN profiles p ON ft.author_id = p.id
  LEFT JOIN organisations o ON ft.organisation_id = o.id
  LEFT JOIN forum_categories fc ON ft.category_id = fc.id
  LEFT JOIN (
    SELECT 
      thread_id,
      true as user_has_liked
    FROM forum_thread_likes 
    WHERE user_id = auth.uid()
  ) ftl ON ft.id = ftl.thread_id
  WHERE (category_id_param IS NULL OR ft.category_id = category_id_param)
    AND ft.is_locked = false
  ORDER BY ft.created_at DESC
  LIMIT limit_param
  OFFSET offset_param;
END;
$$;


ALTER FUNCTION public.get_forum_threads_with_likes(category_id_param uuid, limit_param integer, offset_param integer) OWNER TO postgres;

--
-- Name: get_user_organisation_id(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_user_organisation_id() RETURNS uuid
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
    RETURN (
        SELECT organisation_id 
        FROM profiles 
        WHERE id = auth.uid()
    );
END;
$$;


ALTER FUNCTION public.get_user_organisation_id() OWNER TO postgres;

--
-- Name: get_user_role(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_user_role() RETURNS public.user_role_enum
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$BEGIN
    RETURN (
        SELECT role 
        FROM roles 
        WHERE id = auth.uid()
    );
END;$$;


ALTER FUNCTION public.get_user_role() OWNER TO postgres;

--
-- Name: handle_approved_affiliation_request(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.handle_approved_affiliation_request() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- If request is approved, update the user's profile organisation_id
    IF NEW.request_status = 'approved' AND OLD.request_status = 'pending' THEN
        UPDATE profiles 
        SET organisation_id = NEW.organisation_id,
            updated_at = NOW()
        WHERE id = NEW.user_id;
        
        -- Set responded_at and responded_by if not already set
        IF NEW.responded_at IS NULL THEN
            NEW.responded_at = NOW();
        END IF;
        
        IF NEW.responded_by IS NULL THEN
            NEW.responded_by = auth.uid();
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.handle_approved_affiliation_request() OWNER TO postgres;

--
-- Name: handle_new_user(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.handle_new_user() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
    -- Insert a new profile record for the newly created user
    INSERT INTO public.profiles (
        id,
        name,
        created_at,
        updated_at
    ) VALUES (
        NEW.id,                    -- User ID from auth.users
        COALESCE(NEW.raw_user_meta_data->>'displayName', NEW.email), -- Use name from metadata or fallback to email
        NOW(),                     -- Created timestamp
        NOW()                      -- Updated timestamp
    );
    
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.handle_new_user() OWNER TO postgres;

--
-- Name: has_user_liked_thread(uuid); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.has_user_liked_thread(thread_id_param uuid) RETURNS boolean
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
    IF auth.uid() IS NULL THEN
        RETURN false;
    END IF;
    
    RETURN EXISTS(
        SELECT 1 FROM forum_thread_likes 
        WHERE thread_id = thread_id_param AND user_id = auth.uid()
    );
END;
$$;


ALTER FUNCTION public.has_user_liked_thread(thread_id_param uuid) OWNER TO postgres;

--
-- Name: is_admin(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.is_admin() RETURNS boolean
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
    RETURN get_user_role() = 'admin';
END;
$$;


ALTER FUNCTION public.is_admin() OWNER TO postgres;

--
-- Name: is_cso_rep(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.is_cso_rep() RETURNS boolean
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
    RETURN get_user_role() = 'cso_rep';
END;
$$;


ALTER FUNCTION public.is_cso_rep() OWNER TO postgres;

--
-- Name: like_forum_thread(uuid); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.like_forum_thread(thread_id_param uuid) RETURNS json
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    like_exists boolean;
    result json;
BEGIN
    -- Check if user is authenticated
    IF auth.uid() IS NULL THEN
        RETURN json_build_object('success', false, 'message', 'User not authenticated');
    END IF;
    
    -- Check if thread exists
    IF NOT EXISTS (SELECT 1 FROM forum_threads WHERE id = thread_id_param) THEN
        RETURN json_build_object('success', false, 'message', 'Thread not found');
    END IF;
    
    -- Check if user already liked this thread
    SELECT EXISTS(
        SELECT 1 FROM forum_thread_likes 
        WHERE thread_id = thread_id_param AND user_id = auth.uid()
    ) INTO like_exists;
    
    IF like_exists THEN
        -- Unlike the thread
        DELETE FROM forum_thread_likes 
        WHERE thread_id = thread_id_param AND user_id = auth.uid();
        
        -- Decrease like count
        UPDATE forum_threads 
        SET like_count = GREATEST(like_count - 1, 0)
        WHERE id = thread_id_param;
        
        SELECT json_build_object(
            'success', true, 
            'message', 'Thread unliked', 
            'liked', false,
            'like_count', like_count
        ) INTO result
        FROM forum_threads 
        WHERE id = thread_id_param;
        
        RETURN result;
    ELSE
        -- Like the thread
        INSERT INTO forum_thread_likes (thread_id, user_id)
        VALUES (thread_id_param, auth.uid());
        
        -- Increase like count
        UPDATE forum_threads 
        SET like_count = like_count + 1
        WHERE id = thread_id_param;
        
        SELECT json_build_object(
            'success', true, 
            'message', 'Thread liked', 
            'liked', true,
            'like_count', like_count
        ) INTO result
        FROM forum_threads 
        WHERE id = thread_id_param;
        
        RETURN result;
    END IF;
END;
$$;


ALTER FUNCTION public.like_forum_thread(thread_id_param uuid) OWNER TO postgres;

--
-- Name: owns_organisation(uuid); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.owns_organisation(org_id uuid) RETURNS boolean
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
    RETURN get_user_organisation_id() = org_id AND is_cso_rep();
END;
$$;


ALTER FUNCTION public.owns_organisation(org_id uuid) OWNER TO postgres;

--
-- Name: update_thread_stats(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_thread_stats() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE forum_threads 
        SET 
            reply_count = reply_count + 1,
            last_reply_at = NEW.created_at,
            last_reply_by = NEW.author_id
        WHERE id = NEW.thread_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE forum_threads 
        SET reply_count = reply_count - 1
        WHERE id = OLD.thread_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$;


ALTER FUNCTION public.update_thread_stats() OWNER TO postgres;

--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_updated_at_column() OWNER TO postgres;

--
-- Name: apply_rls(jsonb, integer); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer DEFAULT (1024 * 1024)) RETURNS SETOF realtime.wal_rls
    LANGUAGE plpgsql
    AS $$
declare
-- Regclass of the table e.g. public.notes
entity_ regclass = (quote_ident(wal ->> 'schema') || '.' || quote_ident(wal ->> 'table'))::regclass;

-- I, U, D, T: insert, update ...
action realtime.action = (
    case wal ->> 'action'
        when 'I' then 'INSERT'
        when 'U' then 'UPDATE'
        when 'D' then 'DELETE'
        else 'ERROR'
    end
);

-- Is row level security enabled for the table
is_rls_enabled bool = relrowsecurity from pg_class where oid = entity_;

subscriptions realtime.subscription[] = array_agg(subs)
    from
        realtime.subscription subs
    where
        subs.entity = entity_;

-- Subscription vars
roles regrole[] = array_agg(distinct us.claims_role::text)
    from
        unnest(subscriptions) us;

working_role regrole;
claimed_role regrole;
claims jsonb;

subscription_id uuid;
subscription_has_access bool;
visible_to_subscription_ids uuid[] = '{}';

-- structured info for wal's columns
columns realtime.wal_column[];
-- previous identity values for update/delete
old_columns realtime.wal_column[];

error_record_exceeds_max_size boolean = octet_length(wal::text) > max_record_bytes;

-- Primary jsonb output for record
output jsonb;

begin
perform set_config('role', null, true);

columns =
    array_agg(
        (
            x->>'name',
            x->>'type',
            x->>'typeoid',
            realtime.cast(
                (x->'value') #>> '{}',
                coalesce(
                    (x->>'typeoid')::regtype, -- null when wal2json version <= 2.4
                    (x->>'type')::regtype
                )
            ),
            (pks ->> 'name') is not null,
            true
        )::realtime.wal_column
    )
    from
        jsonb_array_elements(wal -> 'columns') x
        left join jsonb_array_elements(wal -> 'pk') pks
            on (x ->> 'name') = (pks ->> 'name');

old_columns =
    array_agg(
        (
            x->>'name',
            x->>'type',
            x->>'typeoid',
            realtime.cast(
                (x->'value') #>> '{}',
                coalesce(
                    (x->>'typeoid')::regtype, -- null when wal2json version <= 2.4
                    (x->>'type')::regtype
                )
            ),
            (pks ->> 'name') is not null,
            true
        )::realtime.wal_column
    )
    from
        jsonb_array_elements(wal -> 'identity') x
        left join jsonb_array_elements(wal -> 'pk') pks
            on (x ->> 'name') = (pks ->> 'name');

for working_role in select * from unnest(roles) loop

    -- Update `is_selectable` for columns and old_columns
    columns =
        array_agg(
            (
                c.name,
                c.type_name,
                c.type_oid,
                c.value,
                c.is_pkey,
                pg_catalog.has_column_privilege(working_role, entity_, c.name, 'SELECT')
            )::realtime.wal_column
        )
        from
            unnest(columns) c;

    old_columns =
            array_agg(
                (
                    c.name,
                    c.type_name,
                    c.type_oid,
                    c.value,
                    c.is_pkey,
                    pg_catalog.has_column_privilege(working_role, entity_, c.name, 'SELECT')
                )::realtime.wal_column
            )
            from
                unnest(old_columns) c;

    if action <> 'DELETE' and count(1) = 0 from unnest(columns) c where c.is_pkey then
        return next (
            jsonb_build_object(
                'schema', wal ->> 'schema',
                'table', wal ->> 'table',
                'type', action
            ),
            is_rls_enabled,
            -- subscriptions is already filtered by entity
            (select array_agg(s.subscription_id) from unnest(subscriptions) as s where claims_role = working_role),
            array['Error 400: Bad Request, no primary key']
        )::realtime.wal_rls;

    -- The claims role does not have SELECT permission to the primary key of entity
    elsif action <> 'DELETE' and sum(c.is_selectable::int) <> count(1) from unnest(columns) c where c.is_pkey then
        return next (
            jsonb_build_object(
                'schema', wal ->> 'schema',
                'table', wal ->> 'table',
                'type', action
            ),
            is_rls_enabled,
            (select array_agg(s.subscription_id) from unnest(subscriptions) as s where claims_role = working_role),
            array['Error 401: Unauthorized']
        )::realtime.wal_rls;

    else
        output = jsonb_build_object(
            'schema', wal ->> 'schema',
            'table', wal ->> 'table',
            'type', action,
            'commit_timestamp', to_char(
                ((wal ->> 'timestamp')::timestamptz at time zone 'utc'),
                'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'
            ),
            'columns', (
                select
                    jsonb_agg(
                        jsonb_build_object(
                            'name', pa.attname,
                            'type', pt.typname
                        )
                        order by pa.attnum asc
                    )
                from
                    pg_attribute pa
                    join pg_type pt
                        on pa.atttypid = pt.oid
                where
                    attrelid = entity_
                    and attnum > 0
                    and pg_catalog.has_column_privilege(working_role, entity_, pa.attname, 'SELECT')
            )
        )
        -- Add "record" key for insert and update
        || case
            when action in ('INSERT', 'UPDATE') then
                jsonb_build_object(
                    'record',
                    (
                        select
                            jsonb_object_agg(
                                -- if unchanged toast, get column name and value from old record
                                coalesce((c).name, (oc).name),
                                case
                                    when (c).name is null then (oc).value
                                    else (c).value
                                end
                            )
                        from
                            unnest(columns) c
                            full outer join unnest(old_columns) oc
                                on (c).name = (oc).name
                        where
                            coalesce((c).is_selectable, (oc).is_selectable)
                            and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                    )
                )
            else '{}'::jsonb
        end
        -- Add "old_record" key for update and delete
        || case
            when action = 'UPDATE' then
                jsonb_build_object(
                        'old_record',
                        (
                            select jsonb_object_agg((c).name, (c).value)
                            from unnest(old_columns) c
                            where
                                (c).is_selectable
                                and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                        )
                    )
            when action = 'DELETE' then
                jsonb_build_object(
                    'old_record',
                    (
                        select jsonb_object_agg((c).name, (c).value)
                        from unnest(old_columns) c
                        where
                            (c).is_selectable
                            and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                            and ( not is_rls_enabled or (c).is_pkey ) -- if RLS enabled, we can't secure deletes so filter to pkey
                    )
                )
            else '{}'::jsonb
        end;

        -- Create the prepared statement
        if is_rls_enabled and action <> 'DELETE' then
            if (select 1 from pg_prepared_statements where name = 'walrus_rls_stmt' limit 1) > 0 then
                deallocate walrus_rls_stmt;
            end if;
            execute realtime.build_prepared_statement_sql('walrus_rls_stmt', entity_, columns);
        end if;

        visible_to_subscription_ids = '{}';

        for subscription_id, claims in (
                select
                    subs.subscription_id,
                    subs.claims
                from
                    unnest(subscriptions) subs
                where
                    subs.entity = entity_
                    and subs.claims_role = working_role
                    and (
                        realtime.is_visible_through_filters(columns, subs.filters)
                        or (
                          action = 'DELETE'
                          and realtime.is_visible_through_filters(old_columns, subs.filters)
                        )
                    )
        ) loop

            if not is_rls_enabled or action = 'DELETE' then
                visible_to_subscription_ids = visible_to_subscription_ids || subscription_id;
            else
                -- Check if RLS allows the role to see the record
                perform
                    -- Trim leading and trailing quotes from working_role because set_config
                    -- doesn't recognize the role as valid if they are included
                    set_config('role', trim(both '"' from working_role::text), true),
                    set_config('request.jwt.claims', claims::text, true);

                execute 'execute walrus_rls_stmt' into subscription_has_access;

                if subscription_has_access then
                    visible_to_subscription_ids = visible_to_subscription_ids || subscription_id;
                end if;
            end if;
        end loop;

        perform set_config('role', null, true);

        return next (
            output,
            is_rls_enabled,
            visible_to_subscription_ids,
            case
                when error_record_exceeds_max_size then array['Error 413: Payload Too Large']
                else '{}'
            end
        )::realtime.wal_rls;

    end if;
end loop;

perform set_config('role', null, true);
end;
$$;


ALTER FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) OWNER TO supabase_admin;

--
-- Name: broadcast_changes(text, text, text, text, text, record, record, text); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text DEFAULT 'ROW'::text) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
    -- Declare a variable to hold the JSONB representation of the row
    row_data jsonb := '{}'::jsonb;
BEGIN
    IF level = 'STATEMENT' THEN
        RAISE EXCEPTION 'function can only be triggered for each row, not for each statement';
    END IF;
    -- Check the operation type and handle accordingly
    IF operation = 'INSERT' OR operation = 'UPDATE' OR operation = 'DELETE' THEN
        row_data := jsonb_build_object('old_record', OLD, 'record', NEW, 'operation', operation, 'table', table_name, 'schema', table_schema);
        PERFORM realtime.send (row_data, event_name, topic_name);
    ELSE
        RAISE EXCEPTION 'Unexpected operation type: %', operation;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Failed to process the row: %', SQLERRM;
END;

$$;


ALTER FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text) OWNER TO supabase_admin;

--
-- Name: build_prepared_statement_sql(text, regclass, realtime.wal_column[]); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) RETURNS text
    LANGUAGE sql
    AS $$
      /*
      Builds a sql string that, if executed, creates a prepared statement to
      tests retrive a row from *entity* by its primary key columns.
      Example
          select realtime.build_prepared_statement_sql('public.notes', '{"id"}'::text[], '{"bigint"}'::text[])
      */
          select
      'prepare ' || prepared_statement_name || ' as
          select
              exists(
                  select
                      1
                  from
                      ' || entity || '
                  where
                      ' || string_agg(quote_ident(pkc.name) || '=' || quote_nullable(pkc.value #>> '{}') , ' and ') || '
              )'
          from
              unnest(columns) pkc
          where
              pkc.is_pkey
          group by
              entity
      $$;


ALTER FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) OWNER TO supabase_admin;

--
-- Name: cast(text, regtype); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime."cast"(val text, type_ regtype) RETURNS jsonb
    LANGUAGE plpgsql IMMUTABLE
    AS $$
    declare
      res jsonb;
    begin
      execute format('select to_jsonb(%L::'|| type_::text || ')', val)  into res;
      return res;
    end
    $$;


ALTER FUNCTION realtime."cast"(val text, type_ regtype) OWNER TO supabase_admin;

--
-- Name: check_equality_op(realtime.equality_op, regtype, text, text); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) RETURNS boolean
    LANGUAGE plpgsql IMMUTABLE
    AS $$
      /*
      Casts *val_1* and *val_2* as type *type_* and check the *op* condition for truthiness
      */
      declare
          op_symbol text = (
              case
                  when op = 'eq' then '='
                  when op = 'neq' then '!='
                  when op = 'lt' then '<'
                  when op = 'lte' then '<='
                  when op = 'gt' then '>'
                  when op = 'gte' then '>='
                  when op = 'in' then '= any'
                  else 'UNKNOWN OP'
              end
          );
          res boolean;
      begin
          execute format(
              'select %L::'|| type_::text || ' ' || op_symbol
              || ' ( %L::'
              || (
                  case
                      when op = 'in' then type_::text || '[]'
                      else type_::text end
              )
              || ')', val_1, val_2) into res;
          return res;
      end;
      $$;


ALTER FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) OWNER TO supabase_admin;

--
-- Name: is_visible_through_filters(realtime.wal_column[], realtime.user_defined_filter[]); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) RETURNS boolean
    LANGUAGE sql IMMUTABLE
    AS $_$
    /*
    Should the record be visible (true) or filtered out (false) after *filters* are applied
    */
        select
            -- Default to allowed when no filters present
            $2 is null -- no filters. this should not happen because subscriptions has a default
            or array_length($2, 1) is null -- array length of an empty array is null
            or bool_and(
                coalesce(
                    realtime.check_equality_op(
                        op:=f.op,
                        type_:=coalesce(
                            col.type_oid::regtype, -- null when wal2json version <= 2.4
                            col.type_name::regtype
                        ),
                        -- cast jsonb to text
                        val_1:=col.value #>> '{}',
                        val_2:=f.value
                    ),
                    false -- if null, filter does not match
                )
            )
        from
            unnest(filters) f
            join unnest(columns) col
                on f.column_name = col.name;
    $_$;


ALTER FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) OWNER TO supabase_admin;

--
-- Name: list_changes(name, name, integer, integer); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) RETURNS SETOF realtime.wal_rls
    LANGUAGE sql
    SET log_min_messages TO 'fatal'
    AS $$
      with pub as (
        select
          concat_ws(
            ',',
            case when bool_or(pubinsert) then 'insert' else null end,
            case when bool_or(pubupdate) then 'update' else null end,
            case when bool_or(pubdelete) then 'delete' else null end
          ) as w2j_actions,
          coalesce(
            string_agg(
              realtime.quote_wal2json(format('%I.%I', schemaname, tablename)::regclass),
              ','
            ) filter (where ppt.tablename is not null and ppt.tablename not like '% %'),
            ''
          ) w2j_add_tables
        from
          pg_publication pp
          left join pg_publication_tables ppt
            on pp.pubname = ppt.pubname
        where
          pp.pubname = publication
        group by
          pp.pubname
        limit 1
      ),
      w2j as (
        select
          x.*, pub.w2j_add_tables
        from
          pub,
          pg_logical_slot_get_changes(
            slot_name, null, max_changes,
            'include-pk', 'true',
            'include-transaction', 'false',
            'include-timestamp', 'true',
            'include-type-oids', 'true',
            'format-version', '2',
            'actions', pub.w2j_actions,
            'add-tables', pub.w2j_add_tables
          ) x
      )
      select
        xyz.wal,
        xyz.is_rls_enabled,
        xyz.subscription_ids,
        xyz.errors
      from
        w2j,
        realtime.apply_rls(
          wal := w2j.data::jsonb,
          max_record_bytes := max_record_bytes
        ) xyz(wal, is_rls_enabled, subscription_ids, errors)
      where
        w2j.w2j_add_tables <> ''
        and xyz.subscription_ids[1] is not null
    $$;


ALTER FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) OWNER TO supabase_admin;

--
-- Name: quote_wal2json(regclass); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.quote_wal2json(entity regclass) RETURNS text
    LANGUAGE sql IMMUTABLE STRICT
    AS $$
      select
        (
          select string_agg('' || ch,'')
          from unnest(string_to_array(nsp.nspname::text, null)) with ordinality x(ch, idx)
          where
            not (x.idx = 1 and x.ch = '"')
            and not (
              x.idx = array_length(string_to_array(nsp.nspname::text, null), 1)
              and x.ch = '"'
            )
        )
        || '.'
        || (
          select string_agg('' || ch,'')
          from unnest(string_to_array(pc.relname::text, null)) with ordinality x(ch, idx)
          where
            not (x.idx = 1 and x.ch = '"')
            and not (
              x.idx = array_length(string_to_array(nsp.nspname::text, null), 1)
              and x.ch = '"'
            )
          )
      from
        pg_class pc
        join pg_namespace nsp
          on pc.relnamespace = nsp.oid
      where
        pc.oid = entity
    $$;


ALTER FUNCTION realtime.quote_wal2json(entity regclass) OWNER TO supabase_admin;

--
-- Name: send(jsonb, text, text, boolean); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean DEFAULT true) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  BEGIN
    -- Set the topic configuration
    EXECUTE format('SET LOCAL realtime.topic TO %L', topic);

    -- Attempt to insert the message
    INSERT INTO realtime.messages (payload, event, topic, private, extension)
    VALUES (payload, event, topic, private, 'broadcast');
  EXCEPTION
    WHEN OTHERS THEN
      -- Capture and notify the error
      RAISE WARNING 'ErrorSendingBroadcastMessage: %', SQLERRM;
  END;
END;
$$;


ALTER FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean) OWNER TO supabase_admin;

--
-- Name: subscription_check_filters(); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.subscription_check_filters() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
    /*
    Validates that the user defined filters for a subscription:
    - refer to valid columns that the claimed role may access
    - values are coercable to the correct column type
    */
    declare
        col_names text[] = coalesce(
                array_agg(c.column_name order by c.ordinal_position),
                '{}'::text[]
            )
            from
                information_schema.columns c
            where
                format('%I.%I', c.table_schema, c.table_name)::regclass = new.entity
                and pg_catalog.has_column_privilege(
                    (new.claims ->> 'role'),
                    format('%I.%I', c.table_schema, c.table_name)::regclass,
                    c.column_name,
                    'SELECT'
                );
        filter realtime.user_defined_filter;
        col_type regtype;

        in_val jsonb;
    begin
        for filter in select * from unnest(new.filters) loop
            -- Filtered column is valid
            if not filter.column_name = any(col_names) then
                raise exception 'invalid column for filter %', filter.column_name;
            end if;

            -- Type is sanitized and safe for string interpolation
            col_type = (
                select atttypid::regtype
                from pg_catalog.pg_attribute
                where attrelid = new.entity
                      and attname = filter.column_name
            );
            if col_type is null then
                raise exception 'failed to lookup type for column %', filter.column_name;
            end if;

            -- Set maximum number of entries for in filter
            if filter.op = 'in'::realtime.equality_op then
                in_val = realtime.cast(filter.value, (col_type::text || '[]')::regtype);
                if coalesce(jsonb_array_length(in_val), 0) > 100 then
                    raise exception 'too many values for `in` filter. Maximum 100';
                end if;
            else
                -- raises an exception if value is not coercable to type
                perform realtime.cast(filter.value, col_type);
            end if;

        end loop;

        -- Apply consistent order to filters so the unique constraint on
        -- (subscription_id, entity, filters) can't be tricked by a different filter order
        new.filters = coalesce(
            array_agg(f order by f.column_name, f.op, f.value),
            '{}'
        ) from unnest(new.filters) f;

        return new;
    end;
    $$;


ALTER FUNCTION realtime.subscription_check_filters() OWNER TO supabase_admin;

--
-- Name: to_regrole(text); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.to_regrole(role_name text) RETURNS regrole
    LANGUAGE sql IMMUTABLE
    AS $$ select role_name::regrole $$;


ALTER FUNCTION realtime.to_regrole(role_name text) OWNER TO supabase_admin;

--
-- Name: topic(); Type: FUNCTION; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE FUNCTION realtime.topic() RETURNS text
    LANGUAGE sql STABLE
    AS $$
select nullif(current_setting('realtime.topic', true), '')::text;
$$;


ALTER FUNCTION realtime.topic() OWNER TO supabase_realtime_admin;

--
-- Name: add_prefixes(text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.add_prefixes(_bucket_id text, _name text) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    prefixes text[];
BEGIN
    prefixes := "storage"."get_prefixes"("_name");

    IF array_length(prefixes, 1) > 0 THEN
        INSERT INTO storage.prefixes (name, bucket_id)
        SELECT UNNEST(prefixes) as name, "_bucket_id" ON CONFLICT DO NOTHING;
    END IF;
END;
$$;


ALTER FUNCTION storage.add_prefixes(_bucket_id text, _name text) OWNER TO supabase_storage_admin;

--
-- Name: can_insert_object(text, text, uuid, jsonb); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.can_insert_object(bucketid text, name text, owner uuid, metadata jsonb) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  INSERT INTO "storage"."objects" ("bucket_id", "name", "owner", "metadata") VALUES (bucketid, name, owner, metadata);
  -- hack to rollback the successful insert
  RAISE sqlstate 'PT200' using
  message = 'ROLLBACK',
  detail = 'rollback successful insert';
END
$$;


ALTER FUNCTION storage.can_insert_object(bucketid text, name text, owner uuid, metadata jsonb) OWNER TO supabase_storage_admin;

--
-- Name: delete_prefix(text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.delete_prefix(_bucket_id text, _name text) RETURNS boolean
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
    -- Check if we can delete the prefix
    IF EXISTS(
        SELECT FROM "storage"."prefixes"
        WHERE "prefixes"."bucket_id" = "_bucket_id"
          AND level = "storage"."get_level"("_name") + 1
          AND "prefixes"."name" COLLATE "C" LIKE "_name" || '/%'
        LIMIT 1
    )
    OR EXISTS(
        SELECT FROM "storage"."objects"
        WHERE "objects"."bucket_id" = "_bucket_id"
          AND "storage"."get_level"("objects"."name") = "storage"."get_level"("_name") + 1
          AND "objects"."name" COLLATE "C" LIKE "_name" || '/%'
        LIMIT 1
    ) THEN
    -- There are sub-objects, skip deletion
    RETURN false;
    ELSE
        DELETE FROM "storage"."prefixes"
        WHERE "prefixes"."bucket_id" = "_bucket_id"
          AND level = "storage"."get_level"("_name")
          AND "prefixes"."name" = "_name";
        RETURN true;
    END IF;
END;
$$;


ALTER FUNCTION storage.delete_prefix(_bucket_id text, _name text) OWNER TO supabase_storage_admin;

--
-- Name: delete_prefix_hierarchy_trigger(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.delete_prefix_hierarchy_trigger() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    prefix text;
BEGIN
    prefix := "storage"."get_prefix"(OLD."name");

    IF coalesce(prefix, '') != '' THEN
        PERFORM "storage"."delete_prefix"(OLD."bucket_id", prefix);
    END IF;

    RETURN OLD;
END;
$$;


ALTER FUNCTION storage.delete_prefix_hierarchy_trigger() OWNER TO supabase_storage_admin;

--
-- Name: enforce_bucket_name_length(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.enforce_bucket_name_length() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
begin
    if length(new.name) > 100 then
        raise exception 'bucket name "%" is too long (% characters). Max is 100.', new.name, length(new.name);
    end if;
    return new;
end;
$$;


ALTER FUNCTION storage.enforce_bucket_name_length() OWNER TO supabase_storage_admin;

--
-- Name: extension(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.extension(name text) RETURNS text
    LANGUAGE plpgsql IMMUTABLE
    AS $$
DECLARE
    _parts text[];
    _filename text;
BEGIN
    SELECT string_to_array(name, '/') INTO _parts;
    SELECT _parts[array_length(_parts,1)] INTO _filename;
    RETURN reverse(split_part(reverse(_filename), '.', 1));
END
$$;


ALTER FUNCTION storage.extension(name text) OWNER TO supabase_storage_admin;

--
-- Name: filename(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.filename(name text) RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
_parts text[];
BEGIN
	select string_to_array(name, '/') into _parts;
	return _parts[array_length(_parts,1)];
END
$$;


ALTER FUNCTION storage.filename(name text) OWNER TO supabase_storage_admin;

--
-- Name: foldername(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.foldername(name text) RETURNS text[]
    LANGUAGE plpgsql IMMUTABLE
    AS $$
DECLARE
    _parts text[];
BEGIN
    -- Split on "/" to get path segments
    SELECT string_to_array(name, '/') INTO _parts;
    -- Return everything except the last segment
    RETURN _parts[1 : array_length(_parts,1) - 1];
END
$$;


ALTER FUNCTION storage.foldername(name text) OWNER TO supabase_storage_admin;

--
-- Name: get_level(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.get_level(name text) RETURNS integer
    LANGUAGE sql IMMUTABLE STRICT
    AS $$
SELECT array_length(string_to_array("name", '/'), 1);
$$;


ALTER FUNCTION storage.get_level(name text) OWNER TO supabase_storage_admin;

--
-- Name: get_prefix(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.get_prefix(name text) RETURNS text
    LANGUAGE sql IMMUTABLE STRICT
    AS $_$
SELECT
    CASE WHEN strpos("name", '/') > 0 THEN
             regexp_replace("name", '[\/]{1}[^\/]+\/?$', '')
         ELSE
             ''
        END;
$_$;


ALTER FUNCTION storage.get_prefix(name text) OWNER TO supabase_storage_admin;

--
-- Name: get_prefixes(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.get_prefixes(name text) RETURNS text[]
    LANGUAGE plpgsql IMMUTABLE STRICT
    AS $$
DECLARE
    parts text[];
    prefixes text[];
    prefix text;
BEGIN
    -- Split the name into parts by '/'
    parts := string_to_array("name", '/');
    prefixes := '{}';

    -- Construct the prefixes, stopping one level below the last part
    FOR i IN 1..array_length(parts, 1) - 1 LOOP
            prefix := array_to_string(parts[1:i], '/');
            prefixes := array_append(prefixes, prefix);
    END LOOP;

    RETURN prefixes;
END;
$$;


ALTER FUNCTION storage.get_prefixes(name text) OWNER TO supabase_storage_admin;

--
-- Name: get_size_by_bucket(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.get_size_by_bucket() RETURNS TABLE(size bigint, bucket_id text)
    LANGUAGE plpgsql STABLE
    AS $$
BEGIN
    return query
        select sum((metadata->>'size')::bigint) as size, obj.bucket_id
        from "storage".objects as obj
        group by obj.bucket_id;
END
$$;


ALTER FUNCTION storage.get_size_by_bucket() OWNER TO supabase_storage_admin;

--
-- Name: list_multipart_uploads_with_delimiter(text, text, text, integer, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.list_multipart_uploads_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer DEFAULT 100, next_key_token text DEFAULT ''::text, next_upload_token text DEFAULT ''::text) RETURNS TABLE(key text, id text, created_at timestamp with time zone)
    LANGUAGE plpgsql
    AS $_$
BEGIN
    RETURN QUERY EXECUTE
        'SELECT DISTINCT ON(key COLLATE "C") * from (
            SELECT
                CASE
                    WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                        substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1)))
                    ELSE
                        key
                END AS key, id, created_at
            FROM
                storage.s3_multipart_uploads
            WHERE
                bucket_id = $5 AND
                key ILIKE $1 || ''%'' AND
                CASE
                    WHEN $4 != '''' AND $6 = '''' THEN
                        CASE
                            WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                                substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1))) COLLATE "C" > $4
                            ELSE
                                key COLLATE "C" > $4
                            END
                    ELSE
                        true
                END AND
                CASE
                    WHEN $6 != '''' THEN
                        id COLLATE "C" > $6
                    ELSE
                        true
                    END
            ORDER BY
                key COLLATE "C" ASC, created_at ASC) as e order by key COLLATE "C" LIMIT $3'
        USING prefix_param, delimiter_param, max_keys, next_key_token, bucket_id, next_upload_token;
END;
$_$;


ALTER FUNCTION storage.list_multipart_uploads_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer, next_key_token text, next_upload_token text) OWNER TO supabase_storage_admin;

--
-- Name: list_objects_with_delimiter(text, text, text, integer, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.list_objects_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer DEFAULT 100, start_after text DEFAULT ''::text, next_token text DEFAULT ''::text) RETURNS TABLE(name text, id uuid, metadata jsonb, updated_at timestamp with time zone)
    LANGUAGE plpgsql
    AS $_$
BEGIN
    RETURN QUERY EXECUTE
        'SELECT DISTINCT ON(name COLLATE "C") * from (
            SELECT
                CASE
                    WHEN position($2 IN substring(name from length($1) + 1)) > 0 THEN
                        substring(name from 1 for length($1) + position($2 IN substring(name from length($1) + 1)))
                    ELSE
                        name
                END AS name, id, metadata, updated_at
            FROM
                storage.objects
            WHERE
                bucket_id = $5 AND
                name ILIKE $1 || ''%'' AND
                CASE
                    WHEN $6 != '''' THEN
                    name COLLATE "C" > $6
                ELSE true END
                AND CASE
                    WHEN $4 != '''' THEN
                        CASE
                            WHEN position($2 IN substring(name from length($1) + 1)) > 0 THEN
                                substring(name from 1 for length($1) + position($2 IN substring(name from length($1) + 1))) COLLATE "C" > $4
                            ELSE
                                name COLLATE "C" > $4
                            END
                    ELSE
                        true
                END
            ORDER BY
                name COLLATE "C" ASC) as e order by name COLLATE "C" LIMIT $3'
        USING prefix_param, delimiter_param, max_keys, next_token, bucket_id, start_after;
END;
$_$;


ALTER FUNCTION storage.list_objects_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer, start_after text, next_token text) OWNER TO supabase_storage_admin;

--
-- Name: objects_insert_prefix_trigger(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.objects_insert_prefix_trigger() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    PERFORM "storage"."add_prefixes"(NEW."bucket_id", NEW."name");
    NEW.level := "storage"."get_level"(NEW."name");

    RETURN NEW;
END;
$$;


ALTER FUNCTION storage.objects_insert_prefix_trigger() OWNER TO supabase_storage_admin;

--
-- Name: objects_update_prefix_trigger(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.objects_update_prefix_trigger() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    old_prefixes TEXT[];
BEGIN
    -- Ensure this is an update operation and the name has changed
    IF TG_OP = 'UPDATE' AND (NEW."name" <> OLD."name" OR NEW."bucket_id" <> OLD."bucket_id") THEN
        -- Retrieve old prefixes
        old_prefixes := "storage"."get_prefixes"(OLD."name");

        -- Remove old prefixes that are only used by this object
        WITH all_prefixes as (
            SELECT unnest(old_prefixes) as prefix
        ),
        can_delete_prefixes as (
             SELECT prefix
             FROM all_prefixes
             WHERE NOT EXISTS (
                 SELECT 1 FROM "storage"."objects"
                 WHERE "bucket_id" = OLD."bucket_id"
                   AND "name" <> OLD."name"
                   AND "name" LIKE (prefix || '%')
             )
         )
        DELETE FROM "storage"."prefixes" WHERE name IN (SELECT prefix FROM can_delete_prefixes);

        -- Add new prefixes
        PERFORM "storage"."add_prefixes"(NEW."bucket_id", NEW."name");
    END IF;
    -- Set the new level
    NEW."level" := "storage"."get_level"(NEW."name");

    RETURN NEW;
END;
$$;


ALTER FUNCTION storage.objects_update_prefix_trigger() OWNER TO supabase_storage_admin;

--
-- Name: operation(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.operation() RETURNS text
    LANGUAGE plpgsql STABLE
    AS $$
BEGIN
    RETURN current_setting('storage.operation', true);
END;
$$;


ALTER FUNCTION storage.operation() OWNER TO supabase_storage_admin;

--
-- Name: prefixes_insert_trigger(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.prefixes_insert_trigger() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    PERFORM "storage"."add_prefixes"(NEW."bucket_id", NEW."name");
    RETURN NEW;
END;
$$;


ALTER FUNCTION storage.prefixes_insert_trigger() OWNER TO supabase_storage_admin;

--
-- Name: search(text, text, integer, integer, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.search(prefix text, bucketname text, limits integer DEFAULT 100, levels integer DEFAULT 1, offsets integer DEFAULT 0, search text DEFAULT ''::text, sortcolumn text DEFAULT 'name'::text, sortorder text DEFAULT 'asc'::text) RETURNS TABLE(name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql
    AS $$
declare
    can_bypass_rls BOOLEAN;
begin
    SELECT rolbypassrls
    INTO can_bypass_rls
    FROM pg_roles
    WHERE rolname = coalesce(nullif(current_setting('role', true), 'none'), current_user);

    IF can_bypass_rls THEN
        RETURN QUERY SELECT * FROM storage.search_v1_optimised(prefix, bucketname, limits, levels, offsets, search, sortcolumn, sortorder);
    ELSE
        RETURN QUERY SELECT * FROM storage.search_legacy_v1(prefix, bucketname, limits, levels, offsets, search, sortcolumn, sortorder);
    END IF;
end;
$$;


ALTER FUNCTION storage.search(prefix text, bucketname text, limits integer, levels integer, offsets integer, search text, sortcolumn text, sortorder text) OWNER TO supabase_storage_admin;

--
-- Name: search_legacy_v1(text, text, integer, integer, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.search_legacy_v1(prefix text, bucketname text, limits integer DEFAULT 100, levels integer DEFAULT 1, offsets integer DEFAULT 0, search text DEFAULT ''::text, sortcolumn text DEFAULT 'name'::text, sortorder text DEFAULT 'asc'::text) RETURNS TABLE(name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $_$
declare
    v_order_by text;
    v_sort_order text;
begin
    case
        when sortcolumn = 'name' then
            v_order_by = 'name';
        when sortcolumn = 'updated_at' then
            v_order_by = 'updated_at';
        when sortcolumn = 'created_at' then
            v_order_by = 'created_at';
        when sortcolumn = 'last_accessed_at' then
            v_order_by = 'last_accessed_at';
        else
            v_order_by = 'name';
        end case;

    case
        when sortorder = 'asc' then
            v_sort_order = 'asc';
        when sortorder = 'desc' then
            v_sort_order = 'desc';
        else
            v_sort_order = 'asc';
        end case;

    v_order_by = v_order_by || ' ' || v_sort_order;

    return query execute
        'with folders as (
           select path_tokens[$1] as folder
           from storage.objects
             where objects.name ilike $2 || $3 || ''%''
               and bucket_id = $4
               and array_length(objects.path_tokens, 1) <> $1
           group by folder
           order by folder ' || v_sort_order || '
     )
     (select folder as "name",
            null as id,
            null as updated_at,
            null as created_at,
            null as last_accessed_at,
            null as metadata from folders)
     union all
     (select path_tokens[$1] as "name",
            id,
            updated_at,
            created_at,
            last_accessed_at,
            metadata
     from storage.objects
     where objects.name ilike $2 || $3 || ''%''
       and bucket_id = $4
       and array_length(objects.path_tokens, 1) = $1
     order by ' || v_order_by || ')
     limit $5
     offset $6' using levels, prefix, search, bucketname, limits, offsets;
end;
$_$;


ALTER FUNCTION storage.search_legacy_v1(prefix text, bucketname text, limits integer, levels integer, offsets integer, search text, sortcolumn text, sortorder text) OWNER TO supabase_storage_admin;

--
-- Name: search_v1_optimised(text, text, integer, integer, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.search_v1_optimised(prefix text, bucketname text, limits integer DEFAULT 100, levels integer DEFAULT 1, offsets integer DEFAULT 0, search text DEFAULT ''::text, sortcolumn text DEFAULT 'name'::text, sortorder text DEFAULT 'asc'::text) RETURNS TABLE(name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $_$
declare
    v_order_by text;
    v_sort_order text;
begin
    case
        when sortcolumn = 'name' then
            v_order_by = 'name';
        when sortcolumn = 'updated_at' then
            v_order_by = 'updated_at';
        when sortcolumn = 'created_at' then
            v_order_by = 'created_at';
        when sortcolumn = 'last_accessed_at' then
            v_order_by = 'last_accessed_at';
        else
            v_order_by = 'name';
        end case;

    case
        when sortorder = 'asc' then
            v_sort_order = 'asc';
        when sortorder = 'desc' then
            v_sort_order = 'desc';
        else
            v_sort_order = 'asc';
        end case;

    v_order_by = v_order_by || ' ' || v_sort_order;

    return query execute
        'with folders as (
           select (string_to_array(name, ''/''))[level] as name
           from storage.prefixes
             where lower(prefixes.name) like lower($2 || $3) || ''%''
               and bucket_id = $4
               and level = $1
           order by name ' || v_sort_order || '
     )
     (select name,
            null as id,
            null as updated_at,
            null as created_at,
            null as last_accessed_at,
            null as metadata from folders)
     union all
     (select path_tokens[level] as "name",
            id,
            updated_at,
            created_at,
            last_accessed_at,
            metadata
     from storage.objects
     where lower(objects.name) like lower($2 || $3) || ''%''
       and bucket_id = $4
       and level = $1
     order by ' || v_order_by || ')
     limit $5
     offset $6' using levels, prefix, search, bucketname, limits, offsets;
end;
$_$;


ALTER FUNCTION storage.search_v1_optimised(prefix text, bucketname text, limits integer, levels integer, offsets integer, search text, sortcolumn text, sortorder text) OWNER TO supabase_storage_admin;

--
-- Name: search_v2(text, text, integer, integer, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.search_v2(prefix text, bucket_name text, limits integer DEFAULT 100, levels integer DEFAULT 1, start_after text DEFAULT ''::text) RETURNS TABLE(key text, name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $_$
BEGIN
    RETURN query EXECUTE
        $sql$
        SELECT * FROM (
            (
                SELECT
                    split_part(name, '/', $4) AS key,
                    name || '/' AS name,
                    NULL::uuid AS id,
                    NULL::timestamptz AS updated_at,
                    NULL::timestamptz AS created_at,
                    NULL::jsonb AS metadata
                FROM storage.prefixes
                WHERE name COLLATE "C" LIKE $1 || '%'
                AND bucket_id = $2
                AND level = $4
                AND name COLLATE "C" > $5
                ORDER BY prefixes.name COLLATE "C" LIMIT $3
            )
            UNION ALL
            (SELECT split_part(name, '/', $4) AS key,
                name,
                id,
                updated_at,
                created_at,
                metadata
            FROM storage.objects
            WHERE name COLLATE "C" LIKE $1 || '%'
                AND bucket_id = $2
                AND level = $4
                AND name COLLATE "C" > $5
            ORDER BY name COLLATE "C" LIMIT $3)
        ) obj
        ORDER BY name COLLATE "C" LIMIT $3;
        $sql$
        USING prefix, bucket_name, limits, levels, start_after;
END;
$_$;


ALTER FUNCTION storage.search_v2(prefix text, bucket_name text, limits integer, levels integer, start_after text) OWNER TO supabase_storage_admin;

--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW; 
END;
$$;


ALTER FUNCTION storage.update_updated_at_column() OWNER TO supabase_storage_admin;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: audit_log_entries; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.audit_log_entries (
    instance_id uuid,
    id uuid NOT NULL,
    payload json,
    created_at timestamp with time zone,
    ip_address character varying(64) DEFAULT ''::character varying NOT NULL
);


ALTER TABLE auth.audit_log_entries OWNER TO supabase_auth_admin;

--
-- Name: TABLE audit_log_entries; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.audit_log_entries IS 'Auth: Audit trail for user actions.';


--
-- Name: flow_state; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.flow_state (
    id uuid NOT NULL,
    user_id uuid,
    auth_code text NOT NULL,
    code_challenge_method auth.code_challenge_method NOT NULL,
    code_challenge text NOT NULL,
    provider_type text NOT NULL,
    provider_access_token text,
    provider_refresh_token text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    authentication_method text NOT NULL,
    auth_code_issued_at timestamp with time zone
);


ALTER TABLE auth.flow_state OWNER TO supabase_auth_admin;

--
-- Name: TABLE flow_state; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.flow_state IS 'stores metadata for pkce logins';


--
-- Name: identities; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.identities (
    provider_id text NOT NULL,
    user_id uuid NOT NULL,
    identity_data jsonb NOT NULL,
    provider text NOT NULL,
    last_sign_in_at timestamp with time zone,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    email text GENERATED ALWAYS AS (lower((identity_data ->> 'email'::text))) STORED,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


ALTER TABLE auth.identities OWNER TO supabase_auth_admin;

--
-- Name: TABLE identities; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.identities IS 'Auth: Stores identities associated to a user.';


--
-- Name: COLUMN identities.email; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.identities.email IS 'Auth: Email is a generated column that references the optional email property in the identity_data';


--
-- Name: instances; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.instances (
    id uuid NOT NULL,
    uuid uuid,
    raw_base_config text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE auth.instances OWNER TO supabase_auth_admin;

--
-- Name: TABLE instances; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.instances IS 'Auth: Manages users across multiple sites.';


--
-- Name: mfa_amr_claims; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.mfa_amr_claims (
    session_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    authentication_method text NOT NULL,
    id uuid NOT NULL
);


ALTER TABLE auth.mfa_amr_claims OWNER TO supabase_auth_admin;

--
-- Name: TABLE mfa_amr_claims; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.mfa_amr_claims IS 'auth: stores authenticator method reference claims for multi factor authentication';


--
-- Name: mfa_challenges; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.mfa_challenges (
    id uuid NOT NULL,
    factor_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    verified_at timestamp with time zone,
    ip_address inet NOT NULL,
    otp_code text,
    web_authn_session_data jsonb
);


ALTER TABLE auth.mfa_challenges OWNER TO supabase_auth_admin;

--
-- Name: TABLE mfa_challenges; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.mfa_challenges IS 'auth: stores metadata about challenge requests made';


--
-- Name: mfa_factors; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.mfa_factors (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    friendly_name text,
    factor_type auth.factor_type NOT NULL,
    status auth.factor_status NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    secret text,
    phone text,
    last_challenged_at timestamp with time zone,
    web_authn_credential jsonb,
    web_authn_aaguid uuid
);


ALTER TABLE auth.mfa_factors OWNER TO supabase_auth_admin;

--
-- Name: TABLE mfa_factors; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.mfa_factors IS 'auth: stores metadata about factors';


--
-- Name: one_time_tokens; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.one_time_tokens (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    token_type auth.one_time_token_type NOT NULL,
    token_hash text NOT NULL,
    relates_to text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    CONSTRAINT one_time_tokens_token_hash_check CHECK ((char_length(token_hash) > 0))
);


ALTER TABLE auth.one_time_tokens OWNER TO supabase_auth_admin;

--
-- Name: refresh_tokens; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.refresh_tokens (
    instance_id uuid,
    id bigint NOT NULL,
    token character varying(255),
    user_id character varying(255),
    revoked boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    parent character varying(255),
    session_id uuid
);


ALTER TABLE auth.refresh_tokens OWNER TO supabase_auth_admin;

--
-- Name: TABLE refresh_tokens; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.refresh_tokens IS 'Auth: Store of tokens used to refresh JWT tokens once they expire.';


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE; Schema: auth; Owner: supabase_auth_admin
--

CREATE SEQUENCE auth.refresh_tokens_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE auth.refresh_tokens_id_seq OWNER TO supabase_auth_admin;

--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: auth; Owner: supabase_auth_admin
--

ALTER SEQUENCE auth.refresh_tokens_id_seq OWNED BY auth.refresh_tokens.id;


--
-- Name: saml_providers; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.saml_providers (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    entity_id text NOT NULL,
    metadata_xml text NOT NULL,
    metadata_url text,
    attribute_mapping jsonb,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    name_id_format text,
    CONSTRAINT "entity_id not empty" CHECK ((char_length(entity_id) > 0)),
    CONSTRAINT "metadata_url not empty" CHECK (((metadata_url = NULL::text) OR (char_length(metadata_url) > 0))),
    CONSTRAINT "metadata_xml not empty" CHECK ((char_length(metadata_xml) > 0))
);


ALTER TABLE auth.saml_providers OWNER TO supabase_auth_admin;

--
-- Name: TABLE saml_providers; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.saml_providers IS 'Auth: Manages SAML Identity Provider connections.';


--
-- Name: saml_relay_states; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.saml_relay_states (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    request_id text NOT NULL,
    for_email text,
    redirect_to text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    flow_state_id uuid,
    CONSTRAINT "request_id not empty" CHECK ((char_length(request_id) > 0))
);


ALTER TABLE auth.saml_relay_states OWNER TO supabase_auth_admin;

--
-- Name: TABLE saml_relay_states; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.saml_relay_states IS 'Auth: Contains SAML Relay State information for each Service Provider initiated login.';


--
-- Name: schema_migrations; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.schema_migrations (
    version character varying(255) NOT NULL
);


ALTER TABLE auth.schema_migrations OWNER TO supabase_auth_admin;

--
-- Name: TABLE schema_migrations; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.schema_migrations IS 'Auth: Manages updates to the auth system.';


--
-- Name: sessions; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.sessions (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    factor_id uuid,
    aal auth.aal_level,
    not_after timestamp with time zone,
    refreshed_at timestamp without time zone,
    user_agent text,
    ip inet,
    tag text
);


ALTER TABLE auth.sessions OWNER TO supabase_auth_admin;

--
-- Name: TABLE sessions; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.sessions IS 'Auth: Stores session data associated to a user.';


--
-- Name: COLUMN sessions.not_after; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.sessions.not_after IS 'Auth: Not after is a nullable column that contains a timestamp after which the session should be regarded as expired.';


--
-- Name: sso_domains; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.sso_domains (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    domain text NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    CONSTRAINT "domain not empty" CHECK ((char_length(domain) > 0))
);


ALTER TABLE auth.sso_domains OWNER TO supabase_auth_admin;

--
-- Name: TABLE sso_domains; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.sso_domains IS 'Auth: Manages SSO email address domain mapping to an SSO Identity Provider.';


--
-- Name: sso_providers; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.sso_providers (
    id uuid NOT NULL,
    resource_id text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    disabled boolean,
    CONSTRAINT "resource_id not empty" CHECK (((resource_id = NULL::text) OR (char_length(resource_id) > 0)))
);


ALTER TABLE auth.sso_providers OWNER TO supabase_auth_admin;

--
-- Name: TABLE sso_providers; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.sso_providers IS 'Auth: Manages SSO identity provider information; see saml_providers for SAML.';


--
-- Name: COLUMN sso_providers.resource_id; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.sso_providers.resource_id IS 'Auth: Uniquely identifies a SSO provider according to a user-chosen resource ID (case insensitive), useful in infrastructure as code.';


--
-- Name: users; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.users (
    instance_id uuid,
    id uuid NOT NULL,
    aud character varying(255),
    role character varying(255),
    email character varying(255),
    encrypted_password character varying(255),
    email_confirmed_at timestamp with time zone,
    invited_at timestamp with time zone,
    confirmation_token character varying(255),
    confirmation_sent_at timestamp with time zone,
    recovery_token character varying(255),
    recovery_sent_at timestamp with time zone,
    email_change_token_new character varying(255),
    email_change character varying(255),
    email_change_sent_at timestamp with time zone,
    last_sign_in_at timestamp with time zone,
    raw_app_meta_data jsonb,
    raw_user_meta_data jsonb,
    is_super_admin boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    phone text DEFAULT NULL::character varying,
    phone_confirmed_at timestamp with time zone,
    phone_change text DEFAULT ''::character varying,
    phone_change_token character varying(255) DEFAULT ''::character varying,
    phone_change_sent_at timestamp with time zone,
    confirmed_at timestamp with time zone GENERATED ALWAYS AS (LEAST(email_confirmed_at, phone_confirmed_at)) STORED,
    email_change_token_current character varying(255) DEFAULT ''::character varying,
    email_change_confirm_status smallint DEFAULT 0,
    banned_until timestamp with time zone,
    reauthentication_token character varying(255) DEFAULT ''::character varying,
    reauthentication_sent_at timestamp with time zone,
    is_sso_user boolean DEFAULT false NOT NULL,
    deleted_at timestamp with time zone,
    is_anonymous boolean DEFAULT false NOT NULL,
    CONSTRAINT users_email_change_confirm_status_check CHECK (((email_change_confirm_status >= 0) AND (email_change_confirm_status <= 2)))
);


ALTER TABLE auth.users OWNER TO supabase_auth_admin;

--
-- Name: TABLE users; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.users IS 'Auth: Stores user login data within a secure schema.';


--
-- Name: COLUMN users.is_sso_user; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.users.is_sso_user IS 'Auth: Set this column to true when the account comes from SSO. These accounts can have duplicate emails.';


--
-- Name: organisations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.organisations (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    name text NOT NULL,
    registration_number text,
    mission text,
    vision text,
    thematic_focus text[],
    country public.country_enum NOT NULL,
    region text,
    state_province text,
    city text,
    address text,
    type public.organisation_type_enum NOT NULL,
    size public.organisation_size_enum NOT NULL,
    contact_email public.citext,
    contact_phone text,
    website_url text,
    social_links jsonb DEFAULT '{}'::jsonb,
    languages_spoken public.language_enum[] DEFAULT ARRAY['English'::public.language_enum],
    logo_url text,
    cover_image_url text,
    media_uploads jsonb DEFAULT '[]'::jsonb,
    establishment_year integer,
    staff_count integer,
    volunteer_count integer,
    annual_budget numeric,
    legal_status text,
    tax_exemption_status boolean DEFAULT false,
    certifications text[],
    partnerships text[],
    awards_recognition text[],
    status public.organisation_status_enum DEFAULT 'pending_approval'::public.organisation_status_enum,
    featured boolean DEFAULT false,
    verified boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    created_by uuid,
    search_vector tsvector GENERATED ALWAYS AS (to_tsvector('english'::regconfig, ((((COALESCE(name, ''::text) || ' '::text) || COALESCE(mission, ''::text)) || ' '::text) || COALESCE(vision, ''::text)))) STORED,
    primary_work_methods public.work_method_enum[],
    target_populations public.target_population_enum[],
    operational_levels text[],
    geographic_coverage text,
    other_countries text[],
    digital_tools jsonb DEFAULT '[]'::jsonb,
    has_digital_tools boolean DEFAULT false,
    network_memberships text[],
    media_work_types text[],
    media_platforms text[]
);


ALTER TABLE public.organisations OWNER TO postgres;

--
-- Name: TABLE organisations; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.organisations IS 'Main table storing Civil Society Organisation information';


--
-- Name: profiles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.profiles (
    id uuid NOT NULL,
    name text NOT NULL,
    organisation_id uuid,
    language_preference public.language_enum DEFAULT 'English'::public.language_enum,
    avatar_url text,
    bio text,
    phone text,
    title text,
    department text,
    social_links jsonb DEFAULT '{}'::jsonb,
    notification_preferences jsonb DEFAULT '{"push": false, "email": true}'::jsonb,
    timezone text DEFAULT 'UTC'::text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.profiles OWNER TO postgres;

--
-- Name: TABLE profiles; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.profiles IS 'User profiles extending Supabase Auth users';


--
-- Name: admin_organisations; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.admin_organisations AS
 SELECT o.id,
    o.name,
    o.registration_number,
    o.mission,
    o.vision,
    o.thematic_focus,
    o.country,
    o.region,
    o.state_province,
    o.city,
    o.address,
    o.type,
    o.size,
    o.contact_email,
    o.contact_phone,
    o.website_url,
    o.social_links,
    o.languages_spoken,
    o.logo_url,
    o.cover_image_url,
    o.media_uploads,
    o.establishment_year,
    o.staff_count,
    o.volunteer_count,
    o.annual_budget,
    o.legal_status,
    o.tax_exemption_status,
    o.certifications,
    o.partnerships,
    o.awards_recognition,
    o.status,
    o.featured,
    o.verified,
    o.created_at,
    o.updated_at,
    o.created_by,
    o.search_vector,
    o.primary_work_methods,
    o.target_populations,
    o.operational_levels,
    o.geographic_coverage,
    o.other_countries,
    o.digital_tools,
    o.has_digital_tools,
    o.network_memberships,
    o.media_work_types,
    o.media_platforms,
    p.name AS creator_name
   FROM (public.organisations o
     LEFT JOIN public.profiles p ON ((o.created_by = p.id)));


ALTER VIEW public.admin_organisations OWNER TO postgres;

--
-- Name: analytics_events; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.analytics_events (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    user_id uuid,
    session_id text,
    event_type text NOT NULL,
    event_data jsonb DEFAULT '{}'::jsonb,
    page_url text,
    referrer text,
    user_agent text,
    ip_address inet,
    country text,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.analytics_events OWNER TO postgres;

--
-- Name: audit_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.audit_logs (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    table_name text NOT NULL,
    record_id uuid NOT NULL,
    action text NOT NULL,
    old_values jsonb,
    new_values jsonb,
    changed_fields text[],
    user_id uuid,
    user_email text,
    ip_address inet,
    user_agent text,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.audit_logs OWNER TO postgres;

--
-- Name: TABLE audit_logs; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.audit_logs IS 'Audit trail for tracking changes to important records';


--
-- Name: export_jobs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.export_jobs (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    export_type text NOT NULL,
    parameters jsonb DEFAULT '{}'::jsonb,
    status public.export_status_enum DEFAULT 'pending'::public.export_status_enum,
    file_url text,
    error_message text,
    created_at timestamp with time zone DEFAULT now(),
    completed_at timestamp with time zone
);


ALTER TABLE public.export_jobs OWNER TO postgres;

--
-- Name: forum_categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.forum_categories (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    name_en text NOT NULL,
    name_fr text NOT NULL,
    description_en text,
    description_fr text,
    icon text,
    color_hex text DEFAULT '#3B82F6'::text,
    sort_order integer DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    name_es text,
    description_es text
);


ALTER TABLE public.forum_categories OWNER TO postgres;

--
-- Name: COLUMN forum_categories.name_es; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.forum_categories.name_es IS 'Spanish name for the forum category';


--
-- Name: COLUMN forum_categories.description_es; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.forum_categories.description_es IS 'Spanish description for the forum category';


--
-- Name: forum_media; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.forum_media (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    thread_id uuid,
    reply_id uuid,
    file_url text NOT NULL,
    file_name text,
    file_size integer,
    mime_type text,
    file_type text,
    alt_text text,
    is_featured boolean DEFAULT false,
    sort_order integer DEFAULT 0,
    uploaded_at timestamp with time zone DEFAULT now(),
    uploaded_by uuid,
    storage_path text,
    CONSTRAINT check_media_reference CHECK ((((thread_id IS NOT NULL) AND (reply_id IS NULL)) OR ((thread_id IS NULL) AND (reply_id IS NOT NULL)))),
    CONSTRAINT forum_media_file_type_check CHECK ((file_type = ANY (ARRAY['image'::text, 'video'::text, 'audio'::text, 'document'::text, 'other'::text])))
);


ALTER TABLE public.forum_media OWNER TO postgres;

--
-- Name: forum_replies; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.forum_replies (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    thread_id uuid NOT NULL,
    parent_reply_id uuid,
    content text NOT NULL,
    author_id uuid NOT NULL,
    is_solution boolean DEFAULT false,
    like_count integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.forum_replies OWNER TO postgres;

--
-- Name: forum_reply_likes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.forum_reply_likes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    reply_id uuid NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.forum_reply_likes OWNER TO postgres;

--
-- Name: forum_thread_likes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.forum_thread_likes (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    thread_id uuid NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.forum_thread_likes OWNER TO postgres;

--
-- Name: TABLE forum_thread_likes; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.forum_thread_likes IS 'Tracks which users have liked which forum threads';


--
-- Name: forum_threads; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.forum_threads (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    category_id uuid,
    title text NOT NULL,
    content text NOT NULL,
    author_id uuid NOT NULL,
    language public.language_enum DEFAULT 'English'::public.language_enum,
    tags text[],
    is_pinned boolean DEFAULT false,
    is_locked boolean DEFAULT false,
    view_count integer DEFAULT 0,
    reply_count integer DEFAULT 0,
    last_reply_at timestamp with time zone,
    last_reply_by uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    search_vector tsvector GENERATED ALWAYS AS (to_tsvector('english'::regconfig, ((COALESCE(title, ''::text) || ' '::text) || COALESCE(content, ''::text)))) STORED,
    organisation_id uuid,
    like_count integer DEFAULT 0
);


ALTER TABLE public.forum_threads OWNER TO postgres;

--
-- Name: COLUMN forum_threads.like_count; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.forum_threads.like_count IS 'Number of likes for this thread';


--
-- Name: notifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notifications (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    title text NOT NULL,
    message text NOT NULL,
    type text NOT NULL,
    action_url text,
    read_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.notifications OWNER TO postgres;

--
-- Name: organisation_affiliation_requests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.organisation_affiliation_requests (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    organisation_id uuid NOT NULL,
    request_status public.organisation_affiliation_status_enum DEFAULT 'pending'::public.organisation_affiliation_status_enum,
    request_message text,
    admin_response text,
    requested_at timestamp with time zone DEFAULT now(),
    responded_at timestamp with time zone,
    responded_by uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.organisation_affiliation_requests OWNER TO postgres;

--
-- Name: organisation_collaborations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.organisation_collaborations (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    organisation1_id uuid NOT NULL,
    organisation2_id uuid NOT NULL,
    collaboration_type text,
    description text,
    start_date date,
    end_date date,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.organisation_collaborations OWNER TO postgres;

--
-- Name: pages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pages (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    slug text NOT NULL,
    title_en text NOT NULL,
    title_fr text NOT NULL,
    content_en text NOT NULL,
    content_fr text NOT NULL,
    meta_description_en text,
    meta_description_fr text,
    is_published boolean DEFAULT false,
    sort_order integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    created_by uuid
);


ALTER TABLE public.pages OWNER TO postgres;

--
-- Name: project_events; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.project_events (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    project_id uuid NOT NULL,
    title text NOT NULL,
    description text,
    event_type text,
    event_date timestamp with time zone NOT NULL,
    event_end_date timestamp with time zone,
    event_location text,
    venue_details jsonb,
    is_virtual boolean DEFAULT false,
    meeting_link text,
    registration_link text,
    registration_deadline timestamp with time zone,
    max_participants integer,
    current_participants integer DEFAULT 0,
    event_status text DEFAULT 'scheduled'::text,
    attachments jsonb DEFAULT '[]'::jsonb,
    contact_person text,
    contact_email public.citext,
    tags text[],
    is_public boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    created_by uuid
);


ALTER TABLE public.project_events OWNER TO postgres;

--
-- Name: TABLE project_events; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.project_events IS 'Events related to projects';


--
-- Name: project_funders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.project_funders (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    project_id uuid NOT NULL,
    funder_name text NOT NULL,
    funder_type text,
    funder_logo_url text,
    funder_website text,
    funding_amount numeric,
    currency text DEFAULT 'USD'::text,
    funding_type text,
    funding_period_start date,
    funding_period_end date,
    is_primary_funder boolean DEFAULT false,
    acknowledgment_required boolean DEFAULT true,
    public_visibility boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.project_funders OWNER TO postgres;

--
-- Name: TABLE project_funders; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.project_funders IS 'Funding sources for projects';


--
-- Name: project_media; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.project_media (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    project_id uuid NOT NULL,
    file_url text NOT NULL,
    file_name text,
    file_size bigint,
    file_type public.file_type_enum NOT NULL,
    mime_type text,
    caption text,
    alt_text text,
    is_featured boolean DEFAULT false,
    sort_order integer DEFAULT 0,
    uploaded_by uuid,
    uploaded_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.project_media OWNER TO postgres;

--
-- Name: TABLE project_media; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.project_media IS 'Media files associated with projects';


--
-- Name: project_milestones; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.project_milestones (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    project_id uuid NOT NULL,
    title text NOT NULL,
    description text,
    due_date date,
    completion_date date,
    status public.milestone_status_enum DEFAULT 'planned'::public.milestone_status_enum,
    progress_percentage integer DEFAULT 0,
    deliverables text[],
    notes text,
    evidence_urls text[],
    sort_order integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    created_by uuid,
    CONSTRAINT project_milestones_progress_percentage_check CHECK (((progress_percentage >= 0) AND (progress_percentage <= 100)))
);


ALTER TABLE public.project_milestones OWNER TO postgres;

--
-- Name: TABLE project_milestones; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.project_milestones IS 'Project milestones and deliverables';


--
-- Name: projects; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.projects (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    organisation_id uuid NOT NULL,
    title text NOT NULL,
    description text,
    summary text,
    sector_id uuid,
    secondary_sectors uuid[],
    start_date date,
    end_date date,
    status public.project_status_enum DEFAULT 'planning'::public.project_status_enum,
    location text,
    geo_coordinates jsonb,
    budget numeric,
    currency text DEFAULT 'USD'::text,
    beneficiaries_count integer,
    beneficiaries_demographics jsonb,
    objectives text[],
    outcomes text[],
    impact_metrics jsonb,
    sdg_goals integer[],
    language public.language_enum DEFAULT 'English'::public.language_enum,
    featured_image_url text,
    gallery_images text[],
    documents_urls text[],
    project_website text,
    contact_person text,
    contact_email public.citext,
    contact_phone text,
    featured boolean DEFAULT false,
    public_visibility boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    created_by uuid,
    search_vector tsvector GENERATED ALWAYS AS (to_tsvector('english'::regconfig, ((((COALESCE(title, ''::text) || ' '::text) || COALESCE(description, ''::text)) || ' '::text) || COALESCE(summary, ''::text)))) STORED
);


ALTER TABLE public.projects OWNER TO postgres;

--
-- Name: TABLE projects; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.projects IS 'Projects created and managed by CSOs';


--
-- Name: roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    role public.user_role_enum DEFAULT 'public'::public.user_role_enum NOT NULL,
    assigned_by uuid,
    assigned_at timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.roles OWNER TO postgres;

--
-- Name: TABLE roles; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.roles IS 'User roles table - separate from profiles to avoid RLS recursion';


--
-- Name: sectors; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sectors (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    name_en text NOT NULL,
    name_fr text NOT NULL,
    description_en text,
    description_fr text,
    icon_url text,
    color_hex text DEFAULT '#3B82F6'::text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.sectors OWNER TO postgres;

--
-- Name: translations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.translations (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    table_name text NOT NULL,
    record_id uuid NOT NULL,
    field_name text NOT NULL,
    language public.language_enum NOT NULL,
    translation text NOT NULL,
    translator_id uuid,
    is_verified boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.translations OWNER TO postgres;

--
-- Name: TABLE translations; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.translations IS 'Multi-language translations for dynamic content';


--
-- Name: user_favorites; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_favorites (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    favoritable_type text NOT NULL,
    favoritable_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.user_favorites OWNER TO postgres;

--
-- Name: messages; Type: TABLE; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE TABLE realtime.messages (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
)
PARTITION BY RANGE (inserted_at);


ALTER TABLE realtime.messages OWNER TO supabase_realtime_admin;

--
-- Name: schema_migrations; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.schema_migrations (
    version bigint NOT NULL,
    inserted_at timestamp(0) without time zone
);


ALTER TABLE realtime.schema_migrations OWNER TO supabase_admin;

--
-- Name: subscription; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.subscription (
    id bigint NOT NULL,
    subscription_id uuid NOT NULL,
    entity regclass NOT NULL,
    filters realtime.user_defined_filter[] DEFAULT '{}'::realtime.user_defined_filter[] NOT NULL,
    claims jsonb NOT NULL,
    claims_role regrole GENERATED ALWAYS AS (realtime.to_regrole((claims ->> 'role'::text))) STORED NOT NULL,
    created_at timestamp without time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


ALTER TABLE realtime.subscription OWNER TO supabase_admin;

--
-- Name: subscription_id_seq; Type: SEQUENCE; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE realtime.subscription ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME realtime.subscription_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: buckets; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.buckets (
    id text NOT NULL,
    name text NOT NULL,
    owner uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    public boolean DEFAULT false,
    avif_autodetection boolean DEFAULT false,
    file_size_limit bigint,
    allowed_mime_types text[],
    owner_id text,
    type storage.buckettype DEFAULT 'STANDARD'::storage.buckettype NOT NULL
);


ALTER TABLE storage.buckets OWNER TO supabase_storage_admin;

--
-- Name: COLUMN buckets.owner; Type: COMMENT; Schema: storage; Owner: supabase_storage_admin
--

COMMENT ON COLUMN storage.buckets.owner IS 'Field is deprecated, use owner_id instead';


--
-- Name: buckets_analytics; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.buckets_analytics (
    id text NOT NULL,
    type storage.buckettype DEFAULT 'ANALYTICS'::storage.buckettype NOT NULL,
    format text DEFAULT 'ICEBERG'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE storage.buckets_analytics OWNER TO supabase_storage_admin;

--
-- Name: migrations; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.migrations (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    hash character varying(40) NOT NULL,
    executed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE storage.migrations OWNER TO supabase_storage_admin;

--
-- Name: objects; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.objects (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    bucket_id text,
    name text,
    owner uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    last_accessed_at timestamp with time zone DEFAULT now(),
    metadata jsonb,
    path_tokens text[] GENERATED ALWAYS AS (string_to_array(name, '/'::text)) STORED,
    version text,
    owner_id text,
    user_metadata jsonb,
    level integer
);


ALTER TABLE storage.objects OWNER TO supabase_storage_admin;

--
-- Name: COLUMN objects.owner; Type: COMMENT; Schema: storage; Owner: supabase_storage_admin
--

COMMENT ON COLUMN storage.objects.owner IS 'Field is deprecated, use owner_id instead';


--
-- Name: prefixes; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.prefixes (
    bucket_id text NOT NULL,
    name text NOT NULL COLLATE pg_catalog."C",
    level integer GENERATED ALWAYS AS (storage.get_level(name)) STORED NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE storage.prefixes OWNER TO supabase_storage_admin;

--
-- Name: s3_multipart_uploads; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.s3_multipart_uploads (
    id text NOT NULL,
    in_progress_size bigint DEFAULT 0 NOT NULL,
    upload_signature text NOT NULL,
    bucket_id text NOT NULL,
    key text NOT NULL COLLATE pg_catalog."C",
    version text NOT NULL,
    owner_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    user_metadata jsonb
);


ALTER TABLE storage.s3_multipart_uploads OWNER TO supabase_storage_admin;

--
-- Name: s3_multipart_uploads_parts; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.s3_multipart_uploads_parts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    upload_id text NOT NULL,
    size bigint DEFAULT 0 NOT NULL,
    part_number integer NOT NULL,
    bucket_id text NOT NULL,
    key text NOT NULL COLLATE pg_catalog."C",
    etag text NOT NULL,
    owner_id text,
    version text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE storage.s3_multipart_uploads_parts OWNER TO supabase_storage_admin;

--
-- Name: schema_migrations; Type: TABLE; Schema: supabase_migrations; Owner: postgres
--

CREATE TABLE supabase_migrations.schema_migrations (
    version text NOT NULL,
    statements text[],
    name text
);


ALTER TABLE supabase_migrations.schema_migrations OWNER TO postgres;

--
-- Name: seed_files; Type: TABLE; Schema: supabase_migrations; Owner: postgres
--

CREATE TABLE supabase_migrations.seed_files (
    path text NOT NULL,
    hash text NOT NULL
);


ALTER TABLE supabase_migrations.seed_files OWNER TO postgres;

--
-- Name: refresh_tokens id; Type: DEFAULT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens ALTER COLUMN id SET DEFAULT nextval('auth.refresh_tokens_id_seq'::regclass);


--
-- Name: mfa_amr_claims amr_id_pk; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT amr_id_pk PRIMARY KEY (id);


--
-- Name: audit_log_entries audit_log_entries_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.audit_log_entries
    ADD CONSTRAINT audit_log_entries_pkey PRIMARY KEY (id);


--
-- Name: flow_state flow_state_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.flow_state
    ADD CONSTRAINT flow_state_pkey PRIMARY KEY (id);


--
-- Name: identities identities_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_pkey PRIMARY KEY (id);


--
-- Name: identities identities_provider_id_provider_unique; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_provider_id_provider_unique UNIQUE (provider_id, provider);


--
-- Name: instances instances_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.instances
    ADD CONSTRAINT instances_pkey PRIMARY KEY (id);


--
-- Name: mfa_amr_claims mfa_amr_claims_session_id_authentication_method_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT mfa_amr_claims_session_id_authentication_method_pkey UNIQUE (session_id, authentication_method);


--
-- Name: mfa_challenges mfa_challenges_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_challenges
    ADD CONSTRAINT mfa_challenges_pkey PRIMARY KEY (id);


--
-- Name: mfa_factors mfa_factors_last_challenged_at_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_last_challenged_at_key UNIQUE (last_challenged_at);


--
-- Name: mfa_factors mfa_factors_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_pkey PRIMARY KEY (id);


--
-- Name: one_time_tokens one_time_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.one_time_tokens
    ADD CONSTRAINT one_time_tokens_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_token_unique; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_token_unique UNIQUE (token);


--
-- Name: saml_providers saml_providers_entity_id_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_entity_id_key UNIQUE (entity_id);


--
-- Name: saml_providers saml_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_pkey PRIMARY KEY (id);


--
-- Name: saml_relay_states saml_relay_states_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_pkey PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- Name: sso_domains sso_domains_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sso_domains
    ADD CONSTRAINT sso_domains_pkey PRIMARY KEY (id);


--
-- Name: sso_providers sso_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sso_providers
    ADD CONSTRAINT sso_providers_pkey PRIMARY KEY (id);


--
-- Name: users users_phone_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_phone_key UNIQUE (phone);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: analytics_events analytics_events_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.analytics_events
    ADD CONSTRAINT analytics_events_pkey PRIMARY KEY (id);


--
-- Name: audit_logs audit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_pkey PRIMARY KEY (id);


--
-- Name: export_jobs export_jobs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.export_jobs
    ADD CONSTRAINT export_jobs_pkey PRIMARY KEY (id);


--
-- Name: forum_categories forum_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.forum_categories
    ADD CONSTRAINT forum_categories_pkey PRIMARY KEY (id);


--
-- Name: forum_media forum_media_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.forum_media
    ADD CONSTRAINT forum_media_pkey PRIMARY KEY (id);


--
-- Name: forum_replies forum_replies_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.forum_replies
    ADD CONSTRAINT forum_replies_pkey PRIMARY KEY (id);


--
-- Name: forum_reply_likes forum_reply_likes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.forum_reply_likes
    ADD CONSTRAINT forum_reply_likes_pkey PRIMARY KEY (id);


--
-- Name: forum_reply_likes forum_reply_likes_reply_id_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.forum_reply_likes
    ADD CONSTRAINT forum_reply_likes_reply_id_user_id_key UNIQUE (reply_id, user_id);


--
-- Name: forum_thread_likes forum_thread_likes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.forum_thread_likes
    ADD CONSTRAINT forum_thread_likes_pkey PRIMARY KEY (id);


--
-- Name: forum_thread_likes forum_thread_likes_thread_id_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.forum_thread_likes
    ADD CONSTRAINT forum_thread_likes_thread_id_user_id_key UNIQUE (thread_id, user_id);


--
-- Name: forum_threads forum_threads_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.forum_threads
    ADD CONSTRAINT forum_threads_pkey PRIMARY KEY (id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: organisation_affiliation_requests organisation_affiliation_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.organisation_affiliation_requests
    ADD CONSTRAINT organisation_affiliation_requests_pkey PRIMARY KEY (id);


--
-- Name: organisation_collaborations organisation_collaborations_organisation1_id_organisation2__key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.organisation_collaborations
    ADD CONSTRAINT organisation_collaborations_organisation1_id_organisation2__key UNIQUE (organisation1_id, organisation2_id);


--
-- Name: organisation_collaborations organisation_collaborations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.organisation_collaborations
    ADD CONSTRAINT organisation_collaborations_pkey PRIMARY KEY (id);


--
-- Name: organisations organisations_created_by_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.organisations
    ADD CONSTRAINT organisations_created_by_key UNIQUE (created_by);


--
-- Name: organisations organisations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.organisations
    ADD CONSTRAINT organisations_pkey PRIMARY KEY (id);


--
-- Name: pages pages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pages
    ADD CONSTRAINT pages_pkey PRIMARY KEY (id);


--
-- Name: pages pages_slug_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pages
    ADD CONSTRAINT pages_slug_key UNIQUE (slug);


--
-- Name: profiles profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);


--
-- Name: project_events project_events_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_events
    ADD CONSTRAINT project_events_pkey PRIMARY KEY (id);


--
-- Name: project_funders project_funders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_funders
    ADD CONSTRAINT project_funders_pkey PRIMARY KEY (id);


--
-- Name: project_media project_media_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_media
    ADD CONSTRAINT project_media_pkey PRIMARY KEY (id);


--
-- Name: project_milestones project_milestones_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_milestones
    ADD CONSTRAINT project_milestones_pkey PRIMARY KEY (id);


--
-- Name: projects projects_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_pkey PRIMARY KEY (id);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- Name: roles roles_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_user_id_key UNIQUE (user_id);


--
-- Name: sectors sectors_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sectors
    ADD CONSTRAINT sectors_pkey PRIMARY KEY (id);


--
-- Name: translations translations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.translations
    ADD CONSTRAINT translations_pkey PRIMARY KEY (id);


--
-- Name: translations translations_table_name_record_id_field_name_language_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.translations
    ADD CONSTRAINT translations_table_name_record_id_field_name_language_key UNIQUE (table_name, record_id, field_name, language);


--
-- Name: user_favorites user_favorites_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_favorites
    ADD CONSTRAINT user_favorites_pkey PRIMARY KEY (id);


--
-- Name: user_favorites user_favorites_user_id_favoritable_type_favoritable_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_favorites
    ADD CONSTRAINT user_favorites_user_id_favoritable_type_favoritable_id_key UNIQUE (user_id, favoritable_type, favoritable_id);


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER TABLE ONLY realtime.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: subscription pk_subscription; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.subscription
    ADD CONSTRAINT pk_subscription PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: buckets_analytics buckets_analytics_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.buckets_analytics
    ADD CONSTRAINT buckets_analytics_pkey PRIMARY KEY (id);


--
-- Name: buckets buckets_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.buckets
    ADD CONSTRAINT buckets_pkey PRIMARY KEY (id);


--
-- Name: migrations migrations_name_key; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.migrations
    ADD CONSTRAINT migrations_name_key UNIQUE (name);


--
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (id);


--
-- Name: objects objects_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.objects
    ADD CONSTRAINT objects_pkey PRIMARY KEY (id);


--
-- Name: prefixes prefixes_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.prefixes
    ADD CONSTRAINT prefixes_pkey PRIMARY KEY (bucket_id, level, name);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_pkey PRIMARY KEY (id);


--
-- Name: s3_multipart_uploads s3_multipart_uploads_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads
    ADD CONSTRAINT s3_multipart_uploads_pkey PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: supabase_migrations; Owner: postgres
--

ALTER TABLE ONLY supabase_migrations.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: seed_files seed_files_pkey; Type: CONSTRAINT; Schema: supabase_migrations; Owner: postgres
--

ALTER TABLE ONLY supabase_migrations.seed_files
    ADD CONSTRAINT seed_files_pkey PRIMARY KEY (path);


--
-- Name: audit_logs_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX audit_logs_instance_id_idx ON auth.audit_log_entries USING btree (instance_id);


--
-- Name: confirmation_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX confirmation_token_idx ON auth.users USING btree (confirmation_token) WHERE ((confirmation_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: email_change_token_current_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX email_change_token_current_idx ON auth.users USING btree (email_change_token_current) WHERE ((email_change_token_current)::text !~ '^[0-9 ]*$'::text);


--
-- Name: email_change_token_new_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX email_change_token_new_idx ON auth.users USING btree (email_change_token_new) WHERE ((email_change_token_new)::text !~ '^[0-9 ]*$'::text);


--
-- Name: factor_id_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX factor_id_created_at_idx ON auth.mfa_factors USING btree (user_id, created_at);


--
-- Name: flow_state_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX flow_state_created_at_idx ON auth.flow_state USING btree (created_at DESC);


--
-- Name: identities_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX identities_email_idx ON auth.identities USING btree (email text_pattern_ops);


--
-- Name: INDEX identities_email_idx; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON INDEX auth.identities_email_idx IS 'Auth: Ensures indexed queries on the email column';


--
-- Name: identities_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX identities_user_id_idx ON auth.identities USING btree (user_id);


--
-- Name: idx_auth_code; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX idx_auth_code ON auth.flow_state USING btree (auth_code);


--
-- Name: idx_user_id_auth_method; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX idx_user_id_auth_method ON auth.flow_state USING btree (user_id, authentication_method);


--
-- Name: mfa_challenge_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX mfa_challenge_created_at_idx ON auth.mfa_challenges USING btree (created_at DESC);


--
-- Name: mfa_factors_user_friendly_name_unique; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX mfa_factors_user_friendly_name_unique ON auth.mfa_factors USING btree (friendly_name, user_id) WHERE (TRIM(BOTH FROM friendly_name) <> ''::text);


--
-- Name: mfa_factors_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX mfa_factors_user_id_idx ON auth.mfa_factors USING btree (user_id);


--
-- Name: one_time_tokens_relates_to_hash_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX one_time_tokens_relates_to_hash_idx ON auth.one_time_tokens USING hash (relates_to);


--
-- Name: one_time_tokens_token_hash_hash_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX one_time_tokens_token_hash_hash_idx ON auth.one_time_tokens USING hash (token_hash);


--
-- Name: one_time_tokens_user_id_token_type_key; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX one_time_tokens_user_id_token_type_key ON auth.one_time_tokens USING btree (user_id, token_type);


--
-- Name: reauthentication_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX reauthentication_token_idx ON auth.users USING btree (reauthentication_token) WHERE ((reauthentication_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: recovery_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX recovery_token_idx ON auth.users USING btree (recovery_token) WHERE ((recovery_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: refresh_tokens_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_instance_id_idx ON auth.refresh_tokens USING btree (instance_id);


--
-- Name: refresh_tokens_instance_id_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_instance_id_user_id_idx ON auth.refresh_tokens USING btree (instance_id, user_id);


--
-- Name: refresh_tokens_parent_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_parent_idx ON auth.refresh_tokens USING btree (parent);


--
-- Name: refresh_tokens_session_id_revoked_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_session_id_revoked_idx ON auth.refresh_tokens USING btree (session_id, revoked);


--
-- Name: refresh_tokens_updated_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_updated_at_idx ON auth.refresh_tokens USING btree (updated_at DESC);


--
-- Name: saml_providers_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_providers_sso_provider_id_idx ON auth.saml_providers USING btree (sso_provider_id);


--
-- Name: saml_relay_states_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_relay_states_created_at_idx ON auth.saml_relay_states USING btree (created_at DESC);


--
-- Name: saml_relay_states_for_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_relay_states_for_email_idx ON auth.saml_relay_states USING btree (for_email);


--
-- Name: saml_relay_states_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_relay_states_sso_provider_id_idx ON auth.saml_relay_states USING btree (sso_provider_id);


--
-- Name: sessions_not_after_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sessions_not_after_idx ON auth.sessions USING btree (not_after DESC);


--
-- Name: sessions_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sessions_user_id_idx ON auth.sessions USING btree (user_id);


--
-- Name: sso_domains_domain_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX sso_domains_domain_idx ON auth.sso_domains USING btree (lower(domain));


--
-- Name: sso_domains_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sso_domains_sso_provider_id_idx ON auth.sso_domains USING btree (sso_provider_id);


--
-- Name: sso_providers_resource_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX sso_providers_resource_id_idx ON auth.sso_providers USING btree (lower(resource_id));


--
-- Name: sso_providers_resource_id_pattern_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sso_providers_resource_id_pattern_idx ON auth.sso_providers USING btree (resource_id text_pattern_ops);


--
-- Name: unique_phone_factor_per_user; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX unique_phone_factor_per_user ON auth.mfa_factors USING btree (user_id, phone);


--
-- Name: user_id_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX user_id_created_at_idx ON auth.sessions USING btree (user_id, created_at);


--
-- Name: users_email_partial_key; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX users_email_partial_key ON auth.users USING btree (email) WHERE (is_sso_user = false);


--
-- Name: INDEX users_email_partial_key; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON INDEX auth.users_email_partial_key IS 'Auth: A partial unique index that applies only when is_sso_user is false';


--
-- Name: users_instance_id_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX users_instance_id_email_idx ON auth.users USING btree (instance_id, lower((email)::text));


--
-- Name: users_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX users_instance_id_idx ON auth.users USING btree (instance_id);


--
-- Name: users_is_anonymous_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX users_is_anonymous_idx ON auth.users USING btree (is_anonymous);


--
-- Name: idx_affiliation_requests_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_affiliation_requests_created_at ON public.organisation_affiliation_requests USING btree (created_at);


--
-- Name: idx_affiliation_requests_organisation_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_affiliation_requests_organisation_id ON public.organisation_affiliation_requests USING btree (organisation_id);


--
-- Name: idx_affiliation_requests_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_affiliation_requests_status ON public.organisation_affiliation_requests USING btree (request_status);


--
-- Name: idx_affiliation_requests_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_affiliation_requests_user_id ON public.organisation_affiliation_requests USING btree (user_id);


--
-- Name: idx_analytics_events_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_analytics_events_created_at ON public.analytics_events USING btree (created_at);


--
-- Name: idx_analytics_events_event_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_analytics_events_event_type ON public.analytics_events USING btree (event_type);


--
-- Name: idx_analytics_events_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_analytics_events_user_id ON public.analytics_events USING btree (user_id);


--
-- Name: idx_forum_media_reply_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_forum_media_reply_id ON public.forum_media USING btree (reply_id);


--
-- Name: idx_forum_media_thread_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_forum_media_thread_id ON public.forum_media USING btree (thread_id);


--
-- Name: idx_forum_media_uploaded_by; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_forum_media_uploaded_by ON public.forum_media USING btree (uploaded_by);


--
-- Name: idx_forum_replies_thread_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_forum_replies_thread_id ON public.forum_replies USING btree (thread_id);


--
-- Name: idx_forum_thread_likes_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_forum_thread_likes_created_at ON public.forum_thread_likes USING btree (created_at);


--
-- Name: idx_forum_thread_likes_thread_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_forum_thread_likes_thread_id ON public.forum_thread_likes USING btree (thread_id);


--
-- Name: idx_forum_thread_likes_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_forum_thread_likes_user_id ON public.forum_thread_likes USING btree (user_id);


--
-- Name: idx_forum_threads_author_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_forum_threads_author_id ON public.forum_threads USING btree (author_id);


--
-- Name: idx_forum_threads_category_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_forum_threads_category_id ON public.forum_threads USING btree (category_id);


--
-- Name: idx_forum_threads_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_forum_threads_created_at ON public.forum_threads USING btree (created_at DESC);


--
-- Name: idx_forum_threads_search; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_forum_threads_search ON public.forum_threads USING gin (search_vector);


--
-- Name: idx_organisations_country; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_organisations_country ON public.organisations USING btree (country);


--
-- Name: idx_organisations_featured; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_organisations_featured ON public.organisations USING btree (featured) WHERE (featured = true);


--
-- Name: idx_organisations_search; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_organisations_search ON public.organisations USING gin (search_vector);


--
-- Name: idx_organisations_size; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_organisations_size ON public.organisations USING btree (size);


--
-- Name: idx_organisations_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_organisations_status ON public.organisations USING btree (status);


--
-- Name: idx_organisations_thematic_focus; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_organisations_thematic_focus ON public.organisations USING gin (thematic_focus);


--
-- Name: idx_organisations_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_organisations_type ON public.organisations USING btree (type);


--
-- Name: idx_projects_featured; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_projects_featured ON public.projects USING btree (featured) WHERE (featured = true);


--
-- Name: idx_projects_organisation_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_projects_organisation_id ON public.projects USING btree (organisation_id);


--
-- Name: idx_projects_sdg_goals; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_projects_sdg_goals ON public.projects USING gin (sdg_goals);


--
-- Name: idx_projects_search; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_projects_search ON public.projects USING gin (search_vector);


--
-- Name: idx_projects_sector_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_projects_sector_id ON public.projects USING btree (sector_id);


--
-- Name: idx_projects_start_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_projects_start_date ON public.projects USING btree (start_date);


--
-- Name: idx_projects_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_projects_status ON public.projects USING btree (status);


--
-- Name: idx_roles_role; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_roles_role ON public.roles USING btree (role);


--
-- Name: idx_roles_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_roles_user_id ON public.roles USING btree (user_id);


--
-- Name: idx_translations_lookup; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_translations_lookup ON public.translations USING btree (table_name, record_id, field_name, language);


--
-- Name: idx_unique_pending_request; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX idx_unique_pending_request ON public.organisation_affiliation_requests USING btree (user_id, organisation_id) WHERE (request_status = 'pending'::public.organisation_affiliation_status_enum);


--
-- Name: ix_realtime_subscription_entity; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE INDEX ix_realtime_subscription_entity ON realtime.subscription USING btree (entity);


--
-- Name: subscription_subscription_id_entity_filters_key; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE UNIQUE INDEX subscription_subscription_id_entity_filters_key ON realtime.subscription USING btree (subscription_id, entity, filters);


--
-- Name: bname; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX bname ON storage.buckets USING btree (name);


--
-- Name: bucketid_objname; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX bucketid_objname ON storage.objects USING btree (bucket_id, name);


--
-- Name: idx_multipart_uploads_list; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX idx_multipart_uploads_list ON storage.s3_multipart_uploads USING btree (bucket_id, key, created_at);


--
-- Name: idx_name_bucket_level_unique; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX idx_name_bucket_level_unique ON storage.objects USING btree (name COLLATE "C", bucket_id, level);


--
-- Name: idx_objects_bucket_id_name; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX idx_objects_bucket_id_name ON storage.objects USING btree (bucket_id, name COLLATE "C");


--
-- Name: idx_objects_lower_name; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX idx_objects_lower_name ON storage.objects USING btree ((path_tokens[level]), lower(name) text_pattern_ops, bucket_id, level);


--
-- Name: idx_prefixes_lower_name; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX idx_prefixes_lower_name ON storage.prefixes USING btree (bucket_id, level, ((string_to_array(name, '/'::text))[level]), lower(name) text_pattern_ops);


--
-- Name: name_prefix_search; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX name_prefix_search ON storage.objects USING btree (name text_pattern_ops);


--
-- Name: objects_bucket_id_level_idx; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX objects_bucket_id_level_idx ON storage.objects USING btree (bucket_id, level, name COLLATE "C");


--
-- Name: users on_auth_user_created; Type: TRIGGER; Schema: auth; Owner: supabase_auth_admin
--

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


--
-- Name: organisations audit_organisations; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER audit_organisations AFTER INSERT OR DELETE OR UPDATE ON public.organisations FOR EACH ROW EXECUTE FUNCTION public.create_audit_log();


--
-- Name: project_milestones audit_project_milestones; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER audit_project_milestones AFTER INSERT OR DELETE OR UPDATE ON public.project_milestones FOR EACH ROW EXECUTE FUNCTION public.create_audit_log();


--
-- Name: projects audit_projects; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER audit_projects AFTER INSERT OR DELETE OR UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.create_audit_log();


--
-- Name: organisations auto_assign_cso_rep_role_trigger; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER auto_assign_cso_rep_role_trigger AFTER UPDATE ON public.organisations FOR EACH ROW EXECUTE FUNCTION public.auto_assign_cso_rep_role();


--
-- Name: organisation_affiliation_requests handle_approved_affiliation_request_trigger; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER handle_approved_affiliation_request_trigger AFTER UPDATE ON public.organisation_affiliation_requests FOR EACH ROW EXECUTE FUNCTION public.handle_approved_affiliation_request();


--
-- Name: forum_replies update_forum_replies_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_forum_replies_updated_at BEFORE UPDATE ON public.forum_replies FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: forum_threads update_forum_threads_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_forum_threads_updated_at BEFORE UPDATE ON public.forum_threads FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: organisation_affiliation_requests update_organisation_affiliation_requests_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_organisation_affiliation_requests_updated_at BEFORE UPDATE ON public.organisation_affiliation_requests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: organisations update_organisations_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_organisations_updated_at BEFORE UPDATE ON public.organisations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: pages update_pages_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_pages_updated_at BEFORE UPDATE ON public.pages FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: profiles update_profiles_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: project_events update_project_events_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_project_events_updated_at BEFORE UPDATE ON public.project_events FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: project_milestones update_project_milestones_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_project_milestones_updated_at BEFORE UPDATE ON public.project_milestones FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: projects update_projects_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: forum_replies update_thread_stats_trigger; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_thread_stats_trigger AFTER INSERT OR DELETE ON public.forum_replies FOR EACH ROW EXECUTE FUNCTION public.update_thread_stats();


--
-- Name: translations update_translations_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_translations_updated_at BEFORE UPDATE ON public.translations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: subscription tr_check_filters; Type: TRIGGER; Schema: realtime; Owner: supabase_admin
--

CREATE TRIGGER tr_check_filters BEFORE INSERT OR UPDATE ON realtime.subscription FOR EACH ROW EXECUTE FUNCTION realtime.subscription_check_filters();


--
-- Name: buckets enforce_bucket_name_length_trigger; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER enforce_bucket_name_length_trigger BEFORE INSERT OR UPDATE OF name ON storage.buckets FOR EACH ROW EXECUTE FUNCTION storage.enforce_bucket_name_length();


--
-- Name: objects objects_delete_delete_prefix; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER objects_delete_delete_prefix AFTER DELETE ON storage.objects FOR EACH ROW EXECUTE FUNCTION storage.delete_prefix_hierarchy_trigger();


--
-- Name: objects objects_insert_create_prefix; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER objects_insert_create_prefix BEFORE INSERT ON storage.objects FOR EACH ROW EXECUTE FUNCTION storage.objects_insert_prefix_trigger();


--
-- Name: objects objects_update_create_prefix; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER objects_update_create_prefix BEFORE UPDATE ON storage.objects FOR EACH ROW WHEN (((new.name <> old.name) OR (new.bucket_id <> old.bucket_id))) EXECUTE FUNCTION storage.objects_update_prefix_trigger();


--
-- Name: prefixes prefixes_create_hierarchy; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER prefixes_create_hierarchy BEFORE INSERT ON storage.prefixes FOR EACH ROW WHEN ((pg_trigger_depth() < 1)) EXECUTE FUNCTION storage.prefixes_insert_trigger();


--
-- Name: prefixes prefixes_delete_hierarchy; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER prefixes_delete_hierarchy AFTER DELETE ON storage.prefixes FOR EACH ROW EXECUTE FUNCTION storage.delete_prefix_hierarchy_trigger();


--
-- Name: objects update_objects_updated_at; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER update_objects_updated_at BEFORE UPDATE ON storage.objects FOR EACH ROW EXECUTE FUNCTION storage.update_updated_at_column();


--
-- Name: identities identities_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: mfa_amr_claims mfa_amr_claims_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT mfa_amr_claims_session_id_fkey FOREIGN KEY (session_id) REFERENCES auth.sessions(id) ON DELETE CASCADE;


--
-- Name: mfa_challenges mfa_challenges_auth_factor_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_challenges
    ADD CONSTRAINT mfa_challenges_auth_factor_id_fkey FOREIGN KEY (factor_id) REFERENCES auth.mfa_factors(id) ON DELETE CASCADE;


--
-- Name: mfa_factors mfa_factors_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: one_time_tokens one_time_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.one_time_tokens
    ADD CONSTRAINT one_time_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: refresh_tokens refresh_tokens_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_session_id_fkey FOREIGN KEY (session_id) REFERENCES auth.sessions(id) ON DELETE CASCADE;


--
-- Name: saml_providers saml_providers_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: saml_relay_states saml_relay_states_flow_state_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_flow_state_id_fkey FOREIGN KEY (flow_state_id) REFERENCES auth.flow_state(id) ON DELETE CASCADE;


--
-- Name: saml_relay_states saml_relay_states_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: sessions sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: sso_domains sso_domains_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sso_domains
    ADD CONSTRAINT sso_domains_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: analytics_events analytics_events_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.analytics_events
    ADD CONSTRAINT analytics_events_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id);


--
-- Name: audit_logs audit_logs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id);


--
-- Name: export_jobs export_jobs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.export_jobs
    ADD CONSTRAINT export_jobs_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id);


--
-- Name: forum_media forum_media_reply_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.forum_media
    ADD CONSTRAINT forum_media_reply_id_fkey FOREIGN KEY (reply_id) REFERENCES public.forum_replies(id) ON DELETE CASCADE;


--
-- Name: forum_media forum_media_thread_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.forum_media
    ADD CONSTRAINT forum_media_thread_id_fkey FOREIGN KEY (thread_id) REFERENCES public.forum_threads(id) ON DELETE CASCADE;


--
-- Name: forum_media forum_media_uploaded_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.forum_media
    ADD CONSTRAINT forum_media_uploaded_by_fkey FOREIGN KEY (uploaded_by) REFERENCES auth.users(id) ON DELETE SET NULL;


--
-- Name: forum_replies forum_replies_author_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.forum_replies
    ADD CONSTRAINT forum_replies_author_id_fkey FOREIGN KEY (author_id) REFERENCES auth.users(id);


--
-- Name: forum_replies forum_replies_parent_reply_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.forum_replies
    ADD CONSTRAINT forum_replies_parent_reply_id_fkey FOREIGN KEY (parent_reply_id) REFERENCES public.forum_replies(id);


--
-- Name: forum_replies forum_replies_thread_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.forum_replies
    ADD CONSTRAINT forum_replies_thread_id_fkey FOREIGN KEY (thread_id) REFERENCES public.forum_threads(id) ON DELETE CASCADE;


--
-- Name: forum_reply_likes forum_reply_likes_reply_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.forum_reply_likes
    ADD CONSTRAINT forum_reply_likes_reply_id_fkey FOREIGN KEY (reply_id) REFERENCES public.forum_replies(id) ON DELETE CASCADE;


--
-- Name: forum_reply_likes forum_reply_likes_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.forum_reply_likes
    ADD CONSTRAINT forum_reply_likes_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: forum_thread_likes forum_thread_likes_thread_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.forum_thread_likes
    ADD CONSTRAINT forum_thread_likes_thread_id_fkey FOREIGN KEY (thread_id) REFERENCES public.forum_threads(id) ON DELETE CASCADE;


--
-- Name: forum_thread_likes forum_thread_likes_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.forum_thread_likes
    ADD CONSTRAINT forum_thread_likes_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: forum_threads forum_threads_author_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.forum_threads
    ADD CONSTRAINT forum_threads_author_id_fkey FOREIGN KEY (author_id) REFERENCES auth.users(id);


--
-- Name: forum_threads forum_threads_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.forum_threads
    ADD CONSTRAINT forum_threads_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.forum_categories(id);


--
-- Name: forum_threads forum_threads_last_reply_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.forum_threads
    ADD CONSTRAINT forum_threads_last_reply_by_fkey FOREIGN KEY (last_reply_by) REFERENCES auth.users(id);


--
-- Name: forum_threads forum_threads_organisation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.forum_threads
    ADD CONSTRAINT forum_threads_organisation_id_fkey FOREIGN KEY (organisation_id) REFERENCES public.organisations(id) ON DELETE SET NULL;


--
-- Name: notifications notifications_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: organisation_affiliation_requests organisation_affiliation_requests_organisation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.organisation_affiliation_requests
    ADD CONSTRAINT organisation_affiliation_requests_organisation_id_fkey FOREIGN KEY (organisation_id) REFERENCES public.organisations(id) ON DELETE CASCADE;


--
-- Name: organisation_affiliation_requests organisation_affiliation_requests_responded_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.organisation_affiliation_requests
    ADD CONSTRAINT organisation_affiliation_requests_responded_by_fkey FOREIGN KEY (responded_by) REFERENCES public.profiles(id);


--
-- Name: organisation_affiliation_requests organisation_affiliation_requests_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.organisation_affiliation_requests
    ADD CONSTRAINT organisation_affiliation_requests_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- Name: organisation_collaborations organisation_collaborations_organisation1_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.organisation_collaborations
    ADD CONSTRAINT organisation_collaborations_organisation1_id_fkey FOREIGN KEY (organisation1_id) REFERENCES public.organisations(id) ON DELETE CASCADE;


--
-- Name: organisation_collaborations organisation_collaborations_organisation2_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.organisation_collaborations
    ADD CONSTRAINT organisation_collaborations_organisation2_id_fkey FOREIGN KEY (organisation2_id) REFERENCES public.organisations(id) ON DELETE CASCADE;


--
-- Name: organisations organisations_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.organisations
    ADD CONSTRAINT organisations_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id);


--
-- Name: pages pages_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pages
    ADD CONSTRAINT pages_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id);


--
-- Name: profiles profiles_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: profiles profiles_organisation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_organisation_id_fkey FOREIGN KEY (organisation_id) REFERENCES public.organisations(id) ON DELETE SET NULL;


--
-- Name: project_events project_events_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_events
    ADD CONSTRAINT project_events_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id);


--
-- Name: project_events project_events_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_events
    ADD CONSTRAINT project_events_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;


--
-- Name: project_funders project_funders_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_funders
    ADD CONSTRAINT project_funders_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;


--
-- Name: project_media project_media_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_media
    ADD CONSTRAINT project_media_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;


--
-- Name: project_media project_media_uploaded_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_media
    ADD CONSTRAINT project_media_uploaded_by_fkey FOREIGN KEY (uploaded_by) REFERENCES auth.users(id);


--
-- Name: project_milestones project_milestones_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_milestones
    ADD CONSTRAINT project_milestones_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id);


--
-- Name: project_milestones project_milestones_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_milestones
    ADD CONSTRAINT project_milestones_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;


--
-- Name: projects projects_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id);


--
-- Name: projects projects_organisation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_organisation_id_fkey FOREIGN KEY (organisation_id) REFERENCES public.organisations(id) ON DELETE CASCADE;


--
-- Name: projects projects_sector_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_sector_id_fkey FOREIGN KEY (sector_id) REFERENCES public.sectors(id);


--
-- Name: roles roles_assigned_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_assigned_by_fkey FOREIGN KEY (assigned_by) REFERENCES auth.users(id);


--
-- Name: roles roles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: translations translations_translator_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.translations
    ADD CONSTRAINT translations_translator_id_fkey FOREIGN KEY (translator_id) REFERENCES auth.users(id);


--
-- Name: user_favorites user_favorites_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_favorites
    ADD CONSTRAINT user_favorites_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: objects objects_bucketId_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.objects
    ADD CONSTRAINT "objects_bucketId_fkey" FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: prefixes prefixes_bucketId_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.prefixes
    ADD CONSTRAINT "prefixes_bucketId_fkey" FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads s3_multipart_uploads_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads
    ADD CONSTRAINT s3_multipart_uploads_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_upload_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_upload_id_fkey FOREIGN KEY (upload_id) REFERENCES storage.s3_multipart_uploads(id) ON DELETE CASCADE;


--
-- Name: audit_log_entries; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.audit_log_entries ENABLE ROW LEVEL SECURITY;

--
-- Name: flow_state; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.flow_state ENABLE ROW LEVEL SECURITY;

--
-- Name: identities; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.identities ENABLE ROW LEVEL SECURITY;

--
-- Name: instances; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.instances ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_amr_claims; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.mfa_amr_claims ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_challenges; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.mfa_challenges ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_factors; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.mfa_factors ENABLE ROW LEVEL SECURITY;

--
-- Name: one_time_tokens; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.one_time_tokens ENABLE ROW LEVEL SECURITY;

--
-- Name: refresh_tokens; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.refresh_tokens ENABLE ROW LEVEL SECURITY;

--
-- Name: saml_providers; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.saml_providers ENABLE ROW LEVEL SECURITY;

--
-- Name: saml_relay_states; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.saml_relay_states ENABLE ROW LEVEL SECURITY;

--
-- Name: schema_migrations; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.schema_migrations ENABLE ROW LEVEL SECURITY;

--
-- Name: sessions; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.sessions ENABLE ROW LEVEL SECURITY;

--
-- Name: sso_domains; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.sso_domains ENABLE ROW LEVEL SECURITY;

--
-- Name: sso_providers; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.sso_providers ENABLE ROW LEVEL SECURITY;

--
-- Name: users; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

--
-- Name: organisations Admin users can delete organisations; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admin users can delete organisations" ON public.organisations FOR DELETE USING (public.check_user_role('admin'::public.user_role_enum));


--
-- Name: organisations Admin users can update organisations; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admin users can update organisations" ON public.organisations FOR UPDATE USING (public.check_user_role('admin'::public.user_role_enum)) WITH CHECK (public.check_user_role('admin'::public.user_role_enum));


--
-- Name: organisation_affiliation_requests Admins and CSO reps can approve/reject requests; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins and CSO reps can approve/reject requests" ON public.organisation_affiliation_requests FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM public.roles
  WHERE ((roles.user_id = auth.uid()) AND (roles.role = ANY (ARRAY['admin'::public.user_role_enum, 'cso_rep'::public.user_role_enum])))))) WITH CHECK (((EXISTS ( SELECT 1
   FROM public.roles
  WHERE ((roles.user_id = auth.uid()) AND (roles.role = ANY (ARRAY['admin'::public.user_role_enum, 'cso_rep'::public.user_role_enum]))))) AND (request_status = ANY (ARRAY['approved'::public.organisation_affiliation_status_enum, 'rejected'::public.organisation_affiliation_status_enum])) AND (responded_by IS NOT NULL) AND (responded_at IS NOT NULL)));


--
-- Name: organisation_affiliation_requests Admins and CSO reps can delete affiliation requests; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins and CSO reps can delete affiliation requests" ON public.organisation_affiliation_requests FOR DELETE USING ((EXISTS ( SELECT 1
   FROM public.roles
  WHERE ((roles.user_id = auth.uid()) AND (roles.role = ANY (ARRAY['admin'::public.user_role_enum, 'cso_rep'::public.user_role_enum]))))));


--
-- Name: organisation_affiliation_requests Admins and CSO reps can read all affiliation requests; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins and CSO reps can read all affiliation requests" ON public.organisation_affiliation_requests FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.roles
  WHERE ((roles.user_id = auth.uid()) AND (roles.role = ANY (ARRAY['admin'::public.user_role_enum, 'cso_rep'::public.user_role_enum]))))));


--
-- Name: profiles Admins can delete any profile; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can delete any profile" ON public.profiles FOR DELETE TO authenticated USING (((auth.jwt() ->> 'user_role'::text) = 'admin'::text));


--
-- Name: forum_media Admins can manage all media; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can manage all media" ON public.forum_media USING ((EXISTS ( SELECT 1
   FROM public.roles
  WHERE ((roles.user_id = auth.uid()) AND (roles.role = 'admin'::public.user_role_enum)))));


--
-- Name: forum_replies Admins can manage all replies; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can manage all replies" ON public.forum_replies USING ((EXISTS ( SELECT 1
   FROM public.roles
  WHERE ((roles.user_id = auth.uid()) AND (roles.role = 'admin'::public.user_role_enum)))));


--
-- Name: forum_threads Admins can manage all threads; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can manage all threads" ON public.forum_threads USING ((EXISTS ( SELECT 1
   FROM public.roles
  WHERE ((roles.user_id = auth.uid()) AND (roles.role = 'admin'::public.user_role_enum)))));


--
-- Name: profiles Admins can read all profiles; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can read all profiles" ON public.profiles FOR SELECT TO authenticated USING (((auth.jwt() ->> 'user_role'::text) = 'admin'::text));


--
-- Name: profiles Admins can update any profile; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can update any profile" ON public.profiles FOR UPDATE TO authenticated USING (((auth.jwt() ->> 'user_role'::text) = 'admin'::text)) WITH CHECK (((auth.jwt() ->> 'user_role'::text) = 'admin'::text));


--
-- Name: roles Allow auth admin to read user roles; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Allow auth admin to read user roles" ON public.roles FOR SELECT TO supabase_auth_admin USING (true);


--
-- Name: forum_replies Anyone can create replies; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Anyone can create replies" ON public.forum_replies FOR INSERT WITH CHECK (true);


--
-- Name: forum_threads Anyone can create threads; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Anyone can create threads" ON public.forum_threads FOR INSERT WITH CHECK (true);


--
-- Name: forum_media Anyone can read media; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Anyone can read media" ON public.forum_media FOR SELECT USING (true);


--
-- Name: forum_threads Anyone can read public threads; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Anyone can read public threads" ON public.forum_threads FOR SELECT USING (true);


--
-- Name: forum_replies Anyone can read replies; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Anyone can read replies" ON public.forum_replies FOR SELECT USING (true);


--
-- Name: forum_media Anyone can upload media; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Anyone can upload media" ON public.forum_media FOR INSERT WITH CHECK (true);


--
-- Name: forum_thread_likes Anyone can view thread likes; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Anyone can view thread likes" ON public.forum_thread_likes FOR SELECT USING (true);


--
-- Name: organisations Authenticated users can create organisations; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Authenticated users can create organisations" ON public.organisations FOR INSERT WITH CHECK (((auth.role() = 'authenticated'::text) AND (auth.uid() = created_by) AND (status <> 'active'::public.organisation_status_enum)));


--
-- Name: translations Authenticated users can create translations; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Authenticated users can create translations" ON public.translations FOR INSERT WITH CHECK (((auth.role() = 'authenticated'::text) AND (auth.uid() = translator_id)));


--
-- Name: organisations Authenticated users can insert pending organisations; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Authenticated users can insert pending organisations" ON public.organisations FOR INSERT TO authenticated WITH CHECK (((auth.uid() IS NOT NULL) AND (status = 'pending_approval'::public.organisation_status_enum) AND (created_by = auth.uid())));


--
-- Name: translations Authenticated users can view translations; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Authenticated users can view translations" ON public.translations FOR SELECT USING ((auth.role() = 'authenticated'::text));


--
-- Name: projects CSO reps can create projects; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "CSO reps can create projects" ON public.projects FOR INSERT TO authenticated WITH CHECK ((auth.uid() = created_by));


--
-- Name: projects CSO reps can delete own projects; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "CSO reps can delete own projects" ON public.projects FOR DELETE USING ((public.is_admin() OR public.owns_organisation(organisation_id)));


--
-- Name: project_events CSO reps can manage project events; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "CSO reps can manage project events" ON public.project_events USING ((EXISTS ( SELECT 1
   FROM public.projects
  WHERE ((projects.id = project_events.project_id) AND (public.is_admin() OR public.owns_organisation(projects.organisation_id)))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM public.projects
  WHERE ((projects.id = project_events.project_id) AND (public.is_admin() OR public.owns_organisation(projects.organisation_id))))));


--
-- Name: project_funders CSO reps can manage project funders; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "CSO reps can manage project funders" ON public.project_funders USING ((EXISTS ( SELECT 1
   FROM public.projects
  WHERE ((projects.id = project_funders.project_id) AND (public.is_admin() OR public.owns_organisation(projects.organisation_id)))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM public.projects
  WHERE ((projects.id = project_funders.project_id) AND (public.is_admin() OR public.owns_organisation(projects.organisation_id))))));


--
-- Name: project_media CSO reps can manage project media; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "CSO reps can manage project media" ON public.project_media USING ((EXISTS ( SELECT 1
   FROM public.projects
  WHERE ((projects.id = project_media.project_id) AND (public.is_admin() OR public.owns_organisation(projects.organisation_id)))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM public.projects
  WHERE ((projects.id = project_media.project_id) AND (public.is_admin() OR public.owns_organisation(projects.organisation_id))))));


--
-- Name: project_milestones CSO reps can manage project milestones; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "CSO reps can manage project milestones" ON public.project_milestones USING ((EXISTS ( SELECT 1
   FROM public.projects
  WHERE ((projects.id = project_milestones.project_id) AND (public.is_admin() OR public.owns_organisation(projects.organisation_id)))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM public.projects
  WHERE ((projects.id = project_milestones.project_id) AND (public.is_admin() OR public.owns_organisation(projects.organisation_id))))));


--
-- Name: projects CSO reps can update own projects; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "CSO reps can update own projects" ON public.projects FOR UPDATE USING ((public.is_admin() OR public.owns_organisation(organisation_id))) WITH CHECK ((public.is_admin() OR public.owns_organisation(organisation_id)));


--
-- Name: forum_media Content authors can manage attached media; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Content authors can manage attached media" ON public.forum_media USING (((EXISTS ( SELECT 1
   FROM public.forum_threads
  WHERE ((forum_threads.id = forum_media.thread_id) AND (forum_threads.author_id = auth.uid())))) OR (EXISTS ( SELECT 1
   FROM public.forum_replies
  WHERE ((forum_replies.id = forum_media.reply_id) AND (forum_replies.author_id = auth.uid()))))));


--
-- Name: profiles Enable read access for all users; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable read access for all users" ON public.profiles FOR SELECT USING (true);


--
-- Name: roles Everyone can read roles; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Everyone can read roles" ON public.roles FOR SELECT TO authenticated, anon USING (true);


--
-- Name: analytics_events Only admins can delete analytics; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Only admins can delete analytics" ON public.analytics_events FOR DELETE USING (public.is_admin());


--
-- Name: audit_logs Only admins can delete audit logs; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Only admins can delete audit logs" ON public.audit_logs FOR DELETE USING (public.is_admin());


--
-- Name: translations Only admins can delete translations; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Only admins can delete translations" ON public.translations FOR DELETE USING (public.is_admin());


--
-- Name: analytics_events Only admins can manage analytics; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Only admins can manage analytics" ON public.analytics_events FOR UPDATE USING (public.is_admin());


--
-- Name: forum_categories Only admins can manage forum categories; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Only admins can manage forum categories" ON public.forum_categories USING (public.is_admin()) WITH CHECK (public.is_admin());


--
-- Name: pages Only admins can manage pages; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Only admins can manage pages" ON public.pages USING (public.is_admin()) WITH CHECK (public.is_admin());


--
-- Name: sectors Only admins can manage sectors; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Only admins can manage sectors" ON public.sectors USING (public.is_admin()) WITH CHECK (public.is_admin());


--
-- Name: audit_logs Only admins can view audit logs; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Only admins can view audit logs" ON public.audit_logs FOR SELECT USING (public.is_admin());


--
-- Name: organisation_collaborations Organisation reps can create collaborations; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Organisation reps can create collaborations" ON public.organisation_collaborations FOR INSERT WITH CHECK ((public.is_cso_rep() AND (public.owns_organisation(organisation1_id) OR public.owns_organisation(organisation2_id))));


--
-- Name: organisation_collaborations Organisation reps can delete collaborations; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Organisation reps can delete collaborations" ON public.organisation_collaborations FOR DELETE USING ((public.is_admin() OR public.owns_organisation(organisation1_id) OR public.owns_organisation(organisation2_id)));


--
-- Name: organisation_collaborations Organisation reps can update collaborations; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Organisation reps can update collaborations" ON public.organisation_collaborations FOR UPDATE USING ((public.is_admin() OR public.owns_organisation(organisation1_id) OR public.owns_organisation(organisation2_id))) WITH CHECK ((public.is_admin() OR public.owns_organisation(organisation1_id) OR public.owns_organisation(organisation2_id)));


--
-- Name: organisations Public can read active organisations; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Public can read active organisations" ON public.organisations FOR SELECT USING ((status = 'active'::public.organisation_status_enum));


--
-- Name: organisation_collaborations Public can view active collaborations; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Public can view active collaborations" ON public.organisation_collaborations FOR SELECT USING (((is_active = true) OR public.owns_organisation(organisation1_id) OR public.owns_organisation(organisation2_id) OR public.is_admin()));


--
-- Name: organisations Public can view active organisations; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Public can view active organisations" ON public.organisations FOR SELECT USING (((status = ANY (ARRAY['active'::public.organisation_status_enum, 'flagged'::public.organisation_status_enum])) OR public.is_admin() OR public.owns_organisation(id)));


--
-- Name: forum_categories Public can view forum categories; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Public can view forum categories" ON public.forum_categories FOR SELECT USING (((is_active = true) OR public.is_admin()));


--
-- Name: organisations Public can view organisations; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Public can view organisations" ON public.organisations FOR SELECT TO authenticated, anon USING (true);


--
-- Name: project_funders Public can view project funders; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Public can view project funders" ON public.project_funders FOR SELECT USING ((((public_visibility = true) AND (EXISTS ( SELECT 1
   FROM public.projects
  WHERE ((projects.id = project_funders.project_id) AND (projects.public_visibility = true))))) OR (EXISTS ( SELECT 1
   FROM public.projects
  WHERE ((projects.id = project_funders.project_id) AND (public.is_admin() OR public.owns_organisation(projects.organisation_id)))))));


--
-- Name: project_media Public can view project media; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Public can view project media" ON public.project_media FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.projects
  WHERE ((projects.id = project_media.project_id) AND ((projects.public_visibility = true) OR public.is_admin() OR public.owns_organisation(projects.organisation_id))))));


--
-- Name: project_milestones Public can view project milestones; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Public can view project milestones" ON public.project_milestones FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.projects
  WHERE ((projects.id = project_milestones.project_id) AND ((projects.public_visibility = true) OR public.is_admin() OR public.owns_organisation(projects.organisation_id))))));


--
-- Name: project_events Public can view public project events; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Public can view public project events" ON public.project_events FOR SELECT USING (((is_public = true) OR (EXISTS ( SELECT 1
   FROM public.projects
  WHERE ((projects.id = project_events.project_id) AND (public.is_admin() OR public.owns_organisation(projects.organisation_id)))))));


--
-- Name: projects Public can view public projects; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Public can view public projects" ON public.projects FOR SELECT USING ((((public_visibility = true) AND (EXISTS ( SELECT 1
   FROM public.organisations
  WHERE ((organisations.id = projects.organisation_id) AND (organisations.status = 'active'::public.organisation_status_enum))))) OR public.is_admin() OR public.owns_organisation(organisation_id)));


--
-- Name: pages Public can view published pages; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Public can view published pages" ON public.pages FOR SELECT USING (((is_published = true) OR public.is_admin()));


--
-- Name: sectors Public can view sectors; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Public can view sectors" ON public.sectors FOR SELECT USING (true);


--
-- Name: notifications System can create notifications; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "System can create notifications" ON public.notifications FOR INSERT WITH CHECK (true);


--
-- Name: analytics_events System can insert analytics; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "System can insert analytics" ON public.analytics_events FOR INSERT WITH CHECK (true);


--
-- Name: audit_logs System can insert audit logs; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "System can insert audit logs" ON public.audit_logs FOR INSERT WITH CHECK (true);


--
-- Name: translations Translators can update own translations; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Translators can update own translations" ON public.translations FOR UPDATE USING (((auth.uid() = translator_id) OR public.is_admin())) WITH CHECK (((auth.uid() = translator_id) OR public.is_admin()));


--
-- Name: organisation_affiliation_requests Users can cancel own pending requests; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can cancel own pending requests" ON public.organisation_affiliation_requests FOR UPDATE USING (((auth.uid() = user_id) AND (request_status = 'pending'::public.organisation_affiliation_status_enum))) WITH CHECK (((auth.uid() = user_id) AND (request_status = 'cancelled'::public.organisation_affiliation_status_enum)));


--
-- Name: organisation_affiliation_requests Users can create affiliation requests; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can create affiliation requests" ON public.organisation_affiliation_requests FOR INSERT WITH CHECK (((auth.uid() = user_id) AND (request_status = 'pending'::public.organisation_affiliation_status_enum) AND (organisation_id IS NOT NULL)));


--
-- Name: export_jobs Users can create export jobs; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can create export jobs" ON public.export_jobs FOR INSERT WITH CHECK (((auth.role() = 'authenticated'::text) AND (auth.uid() = user_id)));


--
-- Name: organisations Users can create organisations; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can create organisations" ON public.organisations FOR INSERT WITH CHECK ((created_by = auth.uid()));


--
-- Name: forum_media Users can delete own media; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can delete own media" ON public.forum_media FOR DELETE USING ((auth.uid() = uploaded_by));


--
-- Name: notifications Users can delete own notifications; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can delete own notifications" ON public.notifications FOR DELETE USING ((auth.uid() = user_id));


--
-- Name: organisations Users can delete own organisations; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can delete own organisations" ON public.organisations FOR DELETE TO authenticated USING ((created_by = auth.uid()));


--
-- Name: profiles Users can delete own profile; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can delete own profile" ON public.profiles FOR DELETE TO authenticated USING ((auth.uid() = id));


--
-- Name: forum_replies Users can delete own replies; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can delete own replies" ON public.forum_replies FOR DELETE USING ((auth.uid() = author_id));


--
-- Name: forum_threads Users can delete own threads; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can delete own threads" ON public.forum_threads FOR DELETE USING ((auth.uid() = author_id));


--
-- Name: profiles Users can insert own profile; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (((auth.uid() = id) AND (NOT (EXISTS ( SELECT 1
   FROM public.profiles profiles_1
  WHERE (profiles_1.id = auth.uid()))))));


--
-- Name: user_favorites Users can manage own favorites; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can manage own favorites" ON public.user_favorites USING ((auth.uid() = user_id)) WITH CHECK ((auth.uid() = user_id));


--
-- Name: forum_thread_likes Users can manage their own likes; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can manage their own likes" ON public.forum_thread_likes USING ((auth.uid() = user_id));


--
-- Name: organisation_affiliation_requests Users can read own affiliation requests; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can read own affiliation requests" ON public.organisation_affiliation_requests FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: organisations Users can read own created organisation; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can read own created organisation" ON public.organisations FOR SELECT USING ((created_by = auth.uid()));


--
-- Name: roles Users can read own role; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can read own role" ON public.roles FOR SELECT USING ((user_id = auth.uid()));


--
-- Name: export_jobs Users can update own export jobs; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can update own export jobs" ON public.export_jobs FOR UPDATE USING (((auth.uid() = user_id) OR public.is_admin())) WITH CHECK (((auth.uid() = user_id) OR public.is_admin()));


--
-- Name: forum_media Users can update own media; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can update own media" ON public.forum_media FOR UPDATE USING ((auth.uid() = uploaded_by));


--
-- Name: notifications Users can update own notifications; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE USING ((auth.uid() = user_id)) WITH CHECK ((auth.uid() = user_id));


--
-- Name: organisations Users can update own organisation; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can update own organisation" ON public.organisations FOR UPDATE USING ((public.is_admin() OR ((auth.role() = 'authenticated'::text) AND (auth.uid() = created_by)))) WITH CHECK ((public.is_admin() OR ((auth.role() = 'authenticated'::text) AND (auth.uid() = created_by))));


--
-- Name: organisations Users can update own organisations; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can update own organisations" ON public.organisations FOR UPDATE TO authenticated USING ((created_by = auth.uid())) WITH CHECK ((created_by = auth.uid()));


--
-- Name: organisation_affiliation_requests Users can update own pending requests; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can update own pending requests" ON public.organisation_affiliation_requests FOR UPDATE USING (((auth.uid() = user_id) AND (request_status = 'pending'::public.organisation_affiliation_status_enum))) WITH CHECK (((auth.uid() = user_id) AND (request_status = 'pending'::public.organisation_affiliation_status_enum) AND (organisation_id IS NOT NULL)));


--
-- Name: profiles Users can update own profile; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING ((auth.uid() = id)) WITH CHECK ((auth.uid() = id));


--
-- Name: forum_replies Users can update own replies; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can update own replies" ON public.forum_replies FOR UPDATE USING ((auth.uid() = author_id));


--
-- Name: forum_threads Users can update own threads; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can update own threads" ON public.forum_threads FOR UPDATE USING ((auth.uid() = author_id));


--
-- Name: analytics_events Users can view own analytics; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can view own analytics" ON public.analytics_events FOR SELECT USING (((auth.uid() = user_id) OR public.is_admin()));


--
-- Name: export_jobs Users can view own export jobs; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can view own export jobs" ON public.export_jobs FOR SELECT USING (((auth.uid() = user_id) OR public.is_admin()));


--
-- Name: user_favorites Users can view own favorites; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can view own favorites" ON public.user_favorites FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: notifications Users can view own notifications; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: analytics_events; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

--
-- Name: audit_logs; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

--
-- Name: export_jobs; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.export_jobs ENABLE ROW LEVEL SECURITY;

--
-- Name: forum_media; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.forum_media ENABLE ROW LEVEL SECURITY;

--
-- Name: forum_replies; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.forum_replies ENABLE ROW LEVEL SECURITY;

--
-- Name: forum_reply_likes; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.forum_reply_likes ENABLE ROW LEVEL SECURITY;

--
-- Name: forum_thread_likes; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.forum_thread_likes ENABLE ROW LEVEL SECURITY;

--
-- Name: forum_threads; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.forum_threads ENABLE ROW LEVEL SECURITY;

--
-- Name: notifications; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

--
-- Name: organisation_affiliation_requests; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.organisation_affiliation_requests ENABLE ROW LEVEL SECURITY;

--
-- Name: organisation_collaborations; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.organisation_collaborations ENABLE ROW LEVEL SECURITY;

--
-- Name: organisations; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.organisations ENABLE ROW LEVEL SECURITY;

--
-- Name: pages; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;

--
-- Name: profiles; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

--
-- Name: project_events; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.project_events ENABLE ROW LEVEL SECURITY;

--
-- Name: project_funders; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.project_funders ENABLE ROW LEVEL SECURITY;

--
-- Name: project_media; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.project_media ENABLE ROW LEVEL SECURITY;

--
-- Name: project_milestones; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.project_milestones ENABLE ROW LEVEL SECURITY;

--
-- Name: projects; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

--
-- Name: roles; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;

--
-- Name: translations; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.translations ENABLE ROW LEVEL SECURITY;

--
-- Name: user_favorites; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;

--
-- Name: messages; Type: ROW SECURITY; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY;

--
-- Name: objects Authenticated users can upload funder logos; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Authenticated users can upload funder logos" ON storage.objects FOR INSERT WITH CHECK (((bucket_id = 'funder-logos'::text) AND (auth.role() = 'authenticated'::text)));


--
-- Name: objects Authenticated users can upload organisation logos; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Authenticated users can upload organisation logos" ON storage.objects FOR INSERT WITH CHECK (((bucket_id = 'organisation-logos'::text) AND (auth.role() = 'authenticated'::text)));


--
-- Name: objects Authenticated users can upload project gallery; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Authenticated users can upload project gallery" ON storage.objects FOR INSERT WITH CHECK (((bucket_id = 'project-gallery'::text) AND (auth.role() = 'authenticated'::text)));


--
-- Name: objects Authenticated users can upload project media; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Authenticated users can upload project media" ON storage.objects FOR INSERT WITH CHECK (((bucket_id = 'project-media'::text) AND (auth.role() = 'authenticated'::text)));


--
-- Name: objects Give users authenticated access to folder ly5t81_0; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Give users authenticated access to folder ly5t81_0" ON storage.objects FOR SELECT USING (((bucket_id = 'organisation-media'::text) AND (auth.role() = 'authenticated'::text)));


--
-- Name: objects Give users authenticated access to folder ly5t81_1; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Give users authenticated access to folder ly5t81_1" ON storage.objects FOR INSERT WITH CHECK (((bucket_id = 'organisation-media'::text) AND (auth.role() = 'authenticated'::text)));


--
-- Name: objects Give users authenticated access to folder ly5t81_2; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Give users authenticated access to folder ly5t81_2" ON storage.objects FOR UPDATE USING (((bucket_id = 'organisation-media'::text) AND (auth.role() = 'authenticated'::text)));


--
-- Name: objects Give users authenticated access to folder ly5t81_3; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Give users authenticated access to folder ly5t81_3" ON storage.objects FOR DELETE USING (((bucket_id = 'organisation-media'::text) AND (auth.role() = 'authenticated'::text)));


--
-- Name: objects Public can view funder logos; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Public can view funder logos" ON storage.objects FOR SELECT USING ((bucket_id = 'funder-logos'::text));


--
-- Name: objects Public can view organisation logos; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Public can view organisation logos" ON storage.objects FOR SELECT USING ((bucket_id = 'organisation-logos'::text));


--
-- Name: objects Public can view project gallery; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Public can view project gallery" ON storage.objects FOR SELECT USING ((bucket_id = 'project-gallery'::text));


--
-- Name: objects Public can view project media; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Public can view project media" ON storage.objects FOR SELECT USING ((bucket_id = 'project-media'::text));


--
-- Name: objects Public can view user avatars; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Public can view user avatars" ON storage.objects FOR SELECT USING ((bucket_id = 'user-avatars'::text));


--
-- Name: objects Users can upload own avatars; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Users can upload own avatars" ON storage.objects FOR INSERT WITH CHECK (((bucket_id = 'user-avatars'::text) AND (auth.role() = 'authenticated'::text) AND ((storage.foldername(name))[1] = (auth.uid())::text)));


--
-- Name: buckets; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;

--
-- Name: buckets_analytics; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.buckets_analytics ENABLE ROW LEVEL SECURITY;

--
-- Name: migrations; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.migrations ENABLE ROW LEVEL SECURITY;

--
-- Name: objects; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

--
-- Name: prefixes; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.prefixes ENABLE ROW LEVEL SECURITY;

--
-- Name: s3_multipart_uploads; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.s3_multipart_uploads ENABLE ROW LEVEL SECURITY;

--
-- Name: s3_multipart_uploads_parts; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.s3_multipart_uploads_parts ENABLE ROW LEVEL SECURITY;

--
-- Name: supabase_realtime; Type: PUBLICATION; Schema: -; Owner: postgres
--

CREATE PUBLICATION supabase_realtime WITH (publish = 'insert, update, delete, truncate');


ALTER PUBLICATION supabase_realtime OWNER TO postgres;

--
-- Name: SCHEMA auth; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA auth TO anon;
GRANT USAGE ON SCHEMA auth TO authenticated;
GRANT USAGE ON SCHEMA auth TO service_role;
GRANT ALL ON SCHEMA auth TO supabase_auth_admin;
GRANT ALL ON SCHEMA auth TO dashboard_user;
GRANT USAGE ON SCHEMA auth TO postgres;


--
-- Name: SCHEMA extensions; Type: ACL; Schema: -; Owner: postgres
--

GRANT USAGE ON SCHEMA extensions TO anon;
GRANT USAGE ON SCHEMA extensions TO authenticated;
GRANT USAGE ON SCHEMA extensions TO service_role;
GRANT ALL ON SCHEMA extensions TO dashboard_user;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pg_database_owner
--

GRANT USAGE ON SCHEMA public TO postgres;
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO service_role;
GRANT USAGE ON SCHEMA public TO supabase_auth_admin;


--
-- Name: SCHEMA realtime; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA realtime TO postgres;
GRANT USAGE ON SCHEMA realtime TO anon;
GRANT USAGE ON SCHEMA realtime TO authenticated;
GRANT USAGE ON SCHEMA realtime TO service_role;
GRANT ALL ON SCHEMA realtime TO supabase_realtime_admin;


--
-- Name: SCHEMA storage; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA storage TO postgres WITH GRANT OPTION;
GRANT USAGE ON SCHEMA storage TO anon;
GRANT USAGE ON SCHEMA storage TO authenticated;
GRANT USAGE ON SCHEMA storage TO service_role;
GRANT ALL ON SCHEMA storage TO supabase_storage_admin;
GRANT ALL ON SCHEMA storage TO dashboard_user;


--
-- Name: SCHEMA vault; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA vault TO postgres WITH GRANT OPTION;
GRANT USAGE ON SCHEMA vault TO service_role;


--
-- Name: FUNCTION citextin(cstring); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.citextin(cstring) TO postgres;
GRANT ALL ON FUNCTION public.citextin(cstring) TO anon;
GRANT ALL ON FUNCTION public.citextin(cstring) TO authenticated;
GRANT ALL ON FUNCTION public.citextin(cstring) TO service_role;


--
-- Name: FUNCTION citextout(public.citext); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.citextout(public.citext) TO postgres;
GRANT ALL ON FUNCTION public.citextout(public.citext) TO anon;
GRANT ALL ON FUNCTION public.citextout(public.citext) TO authenticated;
GRANT ALL ON FUNCTION public.citextout(public.citext) TO service_role;


--
-- Name: FUNCTION citextrecv(internal); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.citextrecv(internal) TO postgres;
GRANT ALL ON FUNCTION public.citextrecv(internal) TO anon;
GRANT ALL ON FUNCTION public.citextrecv(internal) TO authenticated;
GRANT ALL ON FUNCTION public.citextrecv(internal) TO service_role;


--
-- Name: FUNCTION citextsend(public.citext); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.citextsend(public.citext) TO postgres;
GRANT ALL ON FUNCTION public.citextsend(public.citext) TO anon;
GRANT ALL ON FUNCTION public.citextsend(public.citext) TO authenticated;
GRANT ALL ON FUNCTION public.citextsend(public.citext) TO service_role;


--
-- Name: FUNCTION citext(boolean); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.citext(boolean) TO postgres;
GRANT ALL ON FUNCTION public.citext(boolean) TO anon;
GRANT ALL ON FUNCTION public.citext(boolean) TO authenticated;
GRANT ALL ON FUNCTION public.citext(boolean) TO service_role;


--
-- Name: FUNCTION citext(character); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.citext(character) TO postgres;
GRANT ALL ON FUNCTION public.citext(character) TO anon;
GRANT ALL ON FUNCTION public.citext(character) TO authenticated;
GRANT ALL ON FUNCTION public.citext(character) TO service_role;


--
-- Name: FUNCTION citext(inet); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.citext(inet) TO postgres;
GRANT ALL ON FUNCTION public.citext(inet) TO anon;
GRANT ALL ON FUNCTION public.citext(inet) TO authenticated;
GRANT ALL ON FUNCTION public.citext(inet) TO service_role;


--
-- Name: FUNCTION email(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.email() TO dashboard_user;


--
-- Name: FUNCTION jwt(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.jwt() TO postgres;
GRANT ALL ON FUNCTION auth.jwt() TO dashboard_user;


--
-- Name: FUNCTION role(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.role() TO dashboard_user;


--
-- Name: FUNCTION uid(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.uid() TO dashboard_user;


--
-- Name: FUNCTION armor(bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.armor(bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.armor(bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.armor(bytea) TO dashboard_user;


--
-- Name: FUNCTION armor(bytea, text[], text[]); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.armor(bytea, text[], text[]) FROM postgres;
GRANT ALL ON FUNCTION extensions.armor(bytea, text[], text[]) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.armor(bytea, text[], text[]) TO dashboard_user;


--
-- Name: FUNCTION crypt(text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.crypt(text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.crypt(text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.crypt(text, text) TO dashboard_user;


--
-- Name: FUNCTION dearmor(text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.dearmor(text) FROM postgres;
GRANT ALL ON FUNCTION extensions.dearmor(text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.dearmor(text) TO dashboard_user;


--
-- Name: FUNCTION decrypt(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.decrypt(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.decrypt(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.decrypt(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION decrypt_iv(bytea, bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.decrypt_iv(bytea, bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.decrypt_iv(bytea, bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.decrypt_iv(bytea, bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION digest(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.digest(bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.digest(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.digest(bytea, text) TO dashboard_user;


--
-- Name: FUNCTION digest(text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.digest(text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.digest(text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.digest(text, text) TO dashboard_user;


--
-- Name: FUNCTION encrypt(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.encrypt(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.encrypt(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.encrypt(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION encrypt_iv(bytea, bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.encrypt_iv(bytea, bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.encrypt_iv(bytea, bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.encrypt_iv(bytea, bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION gen_random_bytes(integer); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.gen_random_bytes(integer) FROM postgres;
GRANT ALL ON FUNCTION extensions.gen_random_bytes(integer) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_random_bytes(integer) TO dashboard_user;


--
-- Name: FUNCTION gen_random_uuid(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.gen_random_uuid() FROM postgres;
GRANT ALL ON FUNCTION extensions.gen_random_uuid() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_random_uuid() TO dashboard_user;


--
-- Name: FUNCTION gen_salt(text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.gen_salt(text) FROM postgres;
GRANT ALL ON FUNCTION extensions.gen_salt(text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_salt(text) TO dashboard_user;


--
-- Name: FUNCTION gen_salt(text, integer); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.gen_salt(text, integer) FROM postgres;
GRANT ALL ON FUNCTION extensions.gen_salt(text, integer) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_salt(text, integer) TO dashboard_user;


--
-- Name: FUNCTION grant_pg_cron_access(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION extensions.grant_pg_cron_access() FROM supabase_admin;
GRANT ALL ON FUNCTION extensions.grant_pg_cron_access() TO supabase_admin WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.grant_pg_cron_access() TO dashboard_user;


--
-- Name: FUNCTION grant_pg_graphql_access(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.grant_pg_graphql_access() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION grant_pg_net_access(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION extensions.grant_pg_net_access() FROM supabase_admin;
GRANT ALL ON FUNCTION extensions.grant_pg_net_access() TO supabase_admin WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.grant_pg_net_access() TO dashboard_user;


--
-- Name: FUNCTION hmac(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.hmac(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.hmac(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.hmac(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION hmac(text, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.hmac(text, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.hmac(text, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.hmac(text, text, text) TO dashboard_user;


--
-- Name: FUNCTION pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT shared_blk_read_time double precision, OUT shared_blk_write_time double precision, OUT local_blk_read_time double precision, OUT local_blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision, OUT jit_deform_count bigint, OUT jit_deform_time double precision, OUT stats_since timestamp with time zone, OUT minmax_stats_since timestamp with time zone); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT shared_blk_read_time double precision, OUT shared_blk_write_time double precision, OUT local_blk_read_time double precision, OUT local_blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision, OUT jit_deform_count bigint, OUT jit_deform_time double precision, OUT stats_since timestamp with time zone, OUT minmax_stats_since timestamp with time zone) FROM postgres;
GRANT ALL ON FUNCTION extensions.pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT shared_blk_read_time double precision, OUT shared_blk_write_time double precision, OUT local_blk_read_time double precision, OUT local_blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision, OUT jit_deform_count bigint, OUT jit_deform_time double precision, OUT stats_since timestamp with time zone, OUT minmax_stats_since timestamp with time zone) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT shared_blk_read_time double precision, OUT shared_blk_write_time double precision, OUT local_blk_read_time double precision, OUT local_blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision, OUT jit_deform_count bigint, OUT jit_deform_time double precision, OUT stats_since timestamp with time zone, OUT minmax_stats_since timestamp with time zone) TO dashboard_user;


--
-- Name: FUNCTION pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone) FROM postgres;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone) TO dashboard_user;


--
-- Name: FUNCTION pg_stat_statements_reset(userid oid, dbid oid, queryid bigint, minmax_only boolean); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pg_stat_statements_reset(userid oid, dbid oid, queryid bigint, minmax_only boolean) FROM postgres;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_reset(userid oid, dbid oid, queryid bigint, minmax_only boolean) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_reset(userid oid, dbid oid, queryid bigint, minmax_only boolean) TO dashboard_user;


--
-- Name: FUNCTION pgp_armor_headers(text, OUT key text, OUT value text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_armor_headers(text, OUT key text, OUT value text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_armor_headers(text, OUT key text, OUT value text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_armor_headers(text, OUT key text, OUT value text) TO dashboard_user;


--
-- Name: FUNCTION pgp_key_id(bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_key_id(bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_key_id(bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_key_id(bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_encrypt(text, bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_encrypt(text, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_encrypt_bytea(bytea, bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_encrypt_bytea(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_decrypt(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_decrypt(bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_decrypt_bytea(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_decrypt_bytea(bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_encrypt(text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_encrypt(text, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_encrypt_bytea(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_encrypt_bytea(bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgrst_ddl_watch(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgrst_ddl_watch() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION pgrst_drop_watch(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgrst_drop_watch() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION set_graphql_placeholder(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.set_graphql_placeholder() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION uuid_generate_v1(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v1() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1() TO dashboard_user;


--
-- Name: FUNCTION uuid_generate_v1mc(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v1mc() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1mc() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1mc() TO dashboard_user;


--
-- Name: FUNCTION uuid_generate_v3(namespace uuid, name text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v3(namespace uuid, name text) FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v3(namespace uuid, name text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v3(namespace uuid, name text) TO dashboard_user;


--
-- Name: FUNCTION uuid_generate_v4(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v4() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v4() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v4() TO dashboard_user;


--
-- Name: FUNCTION uuid_generate_v5(namespace uuid, name text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v5(namespace uuid, name text) FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v5(namespace uuid, name text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v5(namespace uuid, name text) TO dashboard_user;


--
-- Name: FUNCTION uuid_nil(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_nil() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_nil() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_nil() TO dashboard_user;


--
-- Name: FUNCTION uuid_ns_dns(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_ns_dns() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_ns_dns() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_dns() TO dashboard_user;


--
-- Name: FUNCTION uuid_ns_oid(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_ns_oid() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_ns_oid() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_oid() TO dashboard_user;


--
-- Name: FUNCTION uuid_ns_url(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_ns_url() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_ns_url() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_url() TO dashboard_user;


--
-- Name: FUNCTION uuid_ns_x500(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_ns_x500() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_ns_x500() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_x500() TO dashboard_user;


--
-- Name: FUNCTION graphql("operationName" text, query text, variables jsonb, extensions jsonb); Type: ACL; Schema: graphql_public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO postgres;
GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO anon;
GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO authenticated;
GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO service_role;


--
-- Name: FUNCTION get_auth(p_usename text); Type: ACL; Schema: pgbouncer; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION pgbouncer.get_auth(p_usename text) FROM PUBLIC;
GRANT ALL ON FUNCTION pgbouncer.get_auth(p_usename text) TO pgbouncer;
GRANT ALL ON FUNCTION pgbouncer.get_auth(p_usename text) TO postgres;


--
-- Name: FUNCTION auto_assign_cso_rep_role(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.auto_assign_cso_rep_role() TO anon;
GRANT ALL ON FUNCTION public.auto_assign_cso_rep_role() TO authenticated;
GRANT ALL ON FUNCTION public.auto_assign_cso_rep_role() TO service_role;


--
-- Name: FUNCTION change_organisation_status(org_id uuid, new_status public.organisation_status_enum, admin_notes text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.change_organisation_status(org_id uuid, new_status public.organisation_status_enum, admin_notes text) TO anon;
GRANT ALL ON FUNCTION public.change_organisation_status(org_id uuid, new_status public.organisation_status_enum, admin_notes text) TO authenticated;
GRANT ALL ON FUNCTION public.change_organisation_status(org_id uuid, new_status public.organisation_status_enum, admin_notes text) TO service_role;


--
-- Name: FUNCTION check_user_role(target_role public.user_role_enum); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.check_user_role(target_role public.user_role_enum) TO anon;
GRANT ALL ON FUNCTION public.check_user_role(target_role public.user_role_enum) TO authenticated;
GRANT ALL ON FUNCTION public.check_user_role(target_role public.user_role_enum) TO service_role;


--
-- Name: FUNCTION citext_cmp(public.citext, public.citext); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.citext_cmp(public.citext, public.citext) TO postgres;
GRANT ALL ON FUNCTION public.citext_cmp(public.citext, public.citext) TO anon;
GRANT ALL ON FUNCTION public.citext_cmp(public.citext, public.citext) TO authenticated;
GRANT ALL ON FUNCTION public.citext_cmp(public.citext, public.citext) TO service_role;


--
-- Name: FUNCTION citext_eq(public.citext, public.citext); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.citext_eq(public.citext, public.citext) TO postgres;
GRANT ALL ON FUNCTION public.citext_eq(public.citext, public.citext) TO anon;
GRANT ALL ON FUNCTION public.citext_eq(public.citext, public.citext) TO authenticated;
GRANT ALL ON FUNCTION public.citext_eq(public.citext, public.citext) TO service_role;


--
-- Name: FUNCTION citext_ge(public.citext, public.citext); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.citext_ge(public.citext, public.citext) TO postgres;
GRANT ALL ON FUNCTION public.citext_ge(public.citext, public.citext) TO anon;
GRANT ALL ON FUNCTION public.citext_ge(public.citext, public.citext) TO authenticated;
GRANT ALL ON FUNCTION public.citext_ge(public.citext, public.citext) TO service_role;


--
-- Name: FUNCTION citext_gt(public.citext, public.citext); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.citext_gt(public.citext, public.citext) TO postgres;
GRANT ALL ON FUNCTION public.citext_gt(public.citext, public.citext) TO anon;
GRANT ALL ON FUNCTION public.citext_gt(public.citext, public.citext) TO authenticated;
GRANT ALL ON FUNCTION public.citext_gt(public.citext, public.citext) TO service_role;


--
-- Name: FUNCTION citext_hash(public.citext); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.citext_hash(public.citext) TO postgres;
GRANT ALL ON FUNCTION public.citext_hash(public.citext) TO anon;
GRANT ALL ON FUNCTION public.citext_hash(public.citext) TO authenticated;
GRANT ALL ON FUNCTION public.citext_hash(public.citext) TO service_role;


--
-- Name: FUNCTION citext_hash_extended(public.citext, bigint); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.citext_hash_extended(public.citext, bigint) TO postgres;
GRANT ALL ON FUNCTION public.citext_hash_extended(public.citext, bigint) TO anon;
GRANT ALL ON FUNCTION public.citext_hash_extended(public.citext, bigint) TO authenticated;
GRANT ALL ON FUNCTION public.citext_hash_extended(public.citext, bigint) TO service_role;


--
-- Name: FUNCTION citext_larger(public.citext, public.citext); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.citext_larger(public.citext, public.citext) TO postgres;
GRANT ALL ON FUNCTION public.citext_larger(public.citext, public.citext) TO anon;
GRANT ALL ON FUNCTION public.citext_larger(public.citext, public.citext) TO authenticated;
GRANT ALL ON FUNCTION public.citext_larger(public.citext, public.citext) TO service_role;


--
-- Name: FUNCTION citext_le(public.citext, public.citext); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.citext_le(public.citext, public.citext) TO postgres;
GRANT ALL ON FUNCTION public.citext_le(public.citext, public.citext) TO anon;
GRANT ALL ON FUNCTION public.citext_le(public.citext, public.citext) TO authenticated;
GRANT ALL ON FUNCTION public.citext_le(public.citext, public.citext) TO service_role;


--
-- Name: FUNCTION citext_lt(public.citext, public.citext); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.citext_lt(public.citext, public.citext) TO postgres;
GRANT ALL ON FUNCTION public.citext_lt(public.citext, public.citext) TO anon;
GRANT ALL ON FUNCTION public.citext_lt(public.citext, public.citext) TO authenticated;
GRANT ALL ON FUNCTION public.citext_lt(public.citext, public.citext) TO service_role;


--
-- Name: FUNCTION citext_ne(public.citext, public.citext); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.citext_ne(public.citext, public.citext) TO postgres;
GRANT ALL ON FUNCTION public.citext_ne(public.citext, public.citext) TO anon;
GRANT ALL ON FUNCTION public.citext_ne(public.citext, public.citext) TO authenticated;
GRANT ALL ON FUNCTION public.citext_ne(public.citext, public.citext) TO service_role;


--
-- Name: FUNCTION citext_pattern_cmp(public.citext, public.citext); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.citext_pattern_cmp(public.citext, public.citext) TO postgres;
GRANT ALL ON FUNCTION public.citext_pattern_cmp(public.citext, public.citext) TO anon;
GRANT ALL ON FUNCTION public.citext_pattern_cmp(public.citext, public.citext) TO authenticated;
GRANT ALL ON FUNCTION public.citext_pattern_cmp(public.citext, public.citext) TO service_role;


--
-- Name: FUNCTION citext_pattern_ge(public.citext, public.citext); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.citext_pattern_ge(public.citext, public.citext) TO postgres;
GRANT ALL ON FUNCTION public.citext_pattern_ge(public.citext, public.citext) TO anon;
GRANT ALL ON FUNCTION public.citext_pattern_ge(public.citext, public.citext) TO authenticated;
GRANT ALL ON FUNCTION public.citext_pattern_ge(public.citext, public.citext) TO service_role;


--
-- Name: FUNCTION citext_pattern_gt(public.citext, public.citext); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.citext_pattern_gt(public.citext, public.citext) TO postgres;
GRANT ALL ON FUNCTION public.citext_pattern_gt(public.citext, public.citext) TO anon;
GRANT ALL ON FUNCTION public.citext_pattern_gt(public.citext, public.citext) TO authenticated;
GRANT ALL ON FUNCTION public.citext_pattern_gt(public.citext, public.citext) TO service_role;


--
-- Name: FUNCTION citext_pattern_le(public.citext, public.citext); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.citext_pattern_le(public.citext, public.citext) TO postgres;
GRANT ALL ON FUNCTION public.citext_pattern_le(public.citext, public.citext) TO anon;
GRANT ALL ON FUNCTION public.citext_pattern_le(public.citext, public.citext) TO authenticated;
GRANT ALL ON FUNCTION public.citext_pattern_le(public.citext, public.citext) TO service_role;


--
-- Name: FUNCTION citext_pattern_lt(public.citext, public.citext); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.citext_pattern_lt(public.citext, public.citext) TO postgres;
GRANT ALL ON FUNCTION public.citext_pattern_lt(public.citext, public.citext) TO anon;
GRANT ALL ON FUNCTION public.citext_pattern_lt(public.citext, public.citext) TO authenticated;
GRANT ALL ON FUNCTION public.citext_pattern_lt(public.citext, public.citext) TO service_role;


--
-- Name: FUNCTION citext_smaller(public.citext, public.citext); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.citext_smaller(public.citext, public.citext) TO postgres;
GRANT ALL ON FUNCTION public.citext_smaller(public.citext, public.citext) TO anon;
GRANT ALL ON FUNCTION public.citext_smaller(public.citext, public.citext) TO authenticated;
GRANT ALL ON FUNCTION public.citext_smaller(public.citext, public.citext) TO service_role;


--
-- Name: FUNCTION create_audit_log(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.create_audit_log() TO anon;
GRANT ALL ON FUNCTION public.create_audit_log() TO authenticated;
GRANT ALL ON FUNCTION public.create_audit_log() TO service_role;


--
-- Name: FUNCTION create_forum_reply(thread_id_param uuid, content_param text, parent_reply_id_param uuid); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.create_forum_reply(thread_id_param uuid, content_param text, parent_reply_id_param uuid) TO anon;
GRANT ALL ON FUNCTION public.create_forum_reply(thread_id_param uuid, content_param text, parent_reply_id_param uuid) TO authenticated;
GRANT ALL ON FUNCTION public.create_forum_reply(thread_id_param uuid, content_param text, parent_reply_id_param uuid) TO service_role;


--
-- Name: FUNCTION custom_access_token_hook(event jsonb); Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON FUNCTION public.custom_access_token_hook(event jsonb) FROM PUBLIC;
GRANT ALL ON FUNCTION public.custom_access_token_hook(event jsonb) TO service_role;
GRANT ALL ON FUNCTION public.custom_access_token_hook(event jsonb) TO supabase_auth_admin;


--
-- Name: FUNCTION get_forum_categories_with_counts(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.get_forum_categories_with_counts() TO anon;
GRANT ALL ON FUNCTION public.get_forum_categories_with_counts() TO authenticated;
GRANT ALL ON FUNCTION public.get_forum_categories_with_counts() TO service_role;


--
-- Name: FUNCTION get_forum_reply_children(parent_reply_id_param uuid, limit_param integer, offset_param integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.get_forum_reply_children(parent_reply_id_param uuid, limit_param integer, offset_param integer) TO anon;
GRANT ALL ON FUNCTION public.get_forum_reply_children(parent_reply_id_param uuid, limit_param integer, offset_param integer) TO authenticated;
GRANT ALL ON FUNCTION public.get_forum_reply_children(parent_reply_id_param uuid, limit_param integer, offset_param integer) TO service_role;


--
-- Name: FUNCTION get_forum_thread_replies(thread_id_param uuid, limit_param integer, offset_param integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.get_forum_thread_replies(thread_id_param uuid, limit_param integer, offset_param integer) TO anon;
GRANT ALL ON FUNCTION public.get_forum_thread_replies(thread_id_param uuid, limit_param integer, offset_param integer) TO authenticated;
GRANT ALL ON FUNCTION public.get_forum_thread_replies(thread_id_param uuid, limit_param integer, offset_param integer) TO service_role;


--
-- Name: FUNCTION get_forum_threads_with_likes(category_id_param uuid, limit_param integer, offset_param integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.get_forum_threads_with_likes(category_id_param uuid, limit_param integer, offset_param integer) TO anon;
GRANT ALL ON FUNCTION public.get_forum_threads_with_likes(category_id_param uuid, limit_param integer, offset_param integer) TO authenticated;
GRANT ALL ON FUNCTION public.get_forum_threads_with_likes(category_id_param uuid, limit_param integer, offset_param integer) TO service_role;


--
-- Name: FUNCTION get_user_organisation_id(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.get_user_organisation_id() TO anon;
GRANT ALL ON FUNCTION public.get_user_organisation_id() TO authenticated;
GRANT ALL ON FUNCTION public.get_user_organisation_id() TO service_role;


--
-- Name: FUNCTION get_user_role(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.get_user_role() TO anon;
GRANT ALL ON FUNCTION public.get_user_role() TO authenticated;
GRANT ALL ON FUNCTION public.get_user_role() TO service_role;


--
-- Name: FUNCTION handle_approved_affiliation_request(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.handle_approved_affiliation_request() TO anon;
GRANT ALL ON FUNCTION public.handle_approved_affiliation_request() TO authenticated;
GRANT ALL ON FUNCTION public.handle_approved_affiliation_request() TO service_role;


--
-- Name: FUNCTION handle_new_user(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.handle_new_user() TO anon;
GRANT ALL ON FUNCTION public.handle_new_user() TO authenticated;
GRANT ALL ON FUNCTION public.handle_new_user() TO service_role;


--
-- Name: FUNCTION has_user_liked_thread(thread_id_param uuid); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.has_user_liked_thread(thread_id_param uuid) TO anon;
GRANT ALL ON FUNCTION public.has_user_liked_thread(thread_id_param uuid) TO authenticated;
GRANT ALL ON FUNCTION public.has_user_liked_thread(thread_id_param uuid) TO service_role;


--
-- Name: FUNCTION is_admin(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.is_admin() TO anon;
GRANT ALL ON FUNCTION public.is_admin() TO authenticated;
GRANT ALL ON FUNCTION public.is_admin() TO service_role;


--
-- Name: FUNCTION is_cso_rep(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.is_cso_rep() TO anon;
GRANT ALL ON FUNCTION public.is_cso_rep() TO authenticated;
GRANT ALL ON FUNCTION public.is_cso_rep() TO service_role;


--
-- Name: FUNCTION like_forum_thread(thread_id_param uuid); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.like_forum_thread(thread_id_param uuid) TO anon;
GRANT ALL ON FUNCTION public.like_forum_thread(thread_id_param uuid) TO authenticated;
GRANT ALL ON FUNCTION public.like_forum_thread(thread_id_param uuid) TO service_role;


--
-- Name: FUNCTION owns_organisation(org_id uuid); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.owns_organisation(org_id uuid) TO anon;
GRANT ALL ON FUNCTION public.owns_organisation(org_id uuid) TO authenticated;
GRANT ALL ON FUNCTION public.owns_organisation(org_id uuid) TO service_role;


--
-- Name: FUNCTION regexp_match(public.citext, public.citext); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.regexp_match(public.citext, public.citext) TO postgres;
GRANT ALL ON FUNCTION public.regexp_match(public.citext, public.citext) TO anon;
GRANT ALL ON FUNCTION public.regexp_match(public.citext, public.citext) TO authenticated;
GRANT ALL ON FUNCTION public.regexp_match(public.citext, public.citext) TO service_role;


--
-- Name: FUNCTION regexp_match(public.citext, public.citext, text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.regexp_match(public.citext, public.citext, text) TO postgres;
GRANT ALL ON FUNCTION public.regexp_match(public.citext, public.citext, text) TO anon;
GRANT ALL ON FUNCTION public.regexp_match(public.citext, public.citext, text) TO authenticated;
GRANT ALL ON FUNCTION public.regexp_match(public.citext, public.citext, text) TO service_role;


--
-- Name: FUNCTION regexp_matches(public.citext, public.citext); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.regexp_matches(public.citext, public.citext) TO postgres;
GRANT ALL ON FUNCTION public.regexp_matches(public.citext, public.citext) TO anon;
GRANT ALL ON FUNCTION public.regexp_matches(public.citext, public.citext) TO authenticated;
GRANT ALL ON FUNCTION public.regexp_matches(public.citext, public.citext) TO service_role;


--
-- Name: FUNCTION regexp_matches(public.citext, public.citext, text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.regexp_matches(public.citext, public.citext, text) TO postgres;
GRANT ALL ON FUNCTION public.regexp_matches(public.citext, public.citext, text) TO anon;
GRANT ALL ON FUNCTION public.regexp_matches(public.citext, public.citext, text) TO authenticated;
GRANT ALL ON FUNCTION public.regexp_matches(public.citext, public.citext, text) TO service_role;


--
-- Name: FUNCTION regexp_replace(public.citext, public.citext, text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.regexp_replace(public.citext, public.citext, text) TO postgres;
GRANT ALL ON FUNCTION public.regexp_replace(public.citext, public.citext, text) TO anon;
GRANT ALL ON FUNCTION public.regexp_replace(public.citext, public.citext, text) TO authenticated;
GRANT ALL ON FUNCTION public.regexp_replace(public.citext, public.citext, text) TO service_role;


--
-- Name: FUNCTION regexp_replace(public.citext, public.citext, text, text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.regexp_replace(public.citext, public.citext, text, text) TO postgres;
GRANT ALL ON FUNCTION public.regexp_replace(public.citext, public.citext, text, text) TO anon;
GRANT ALL ON FUNCTION public.regexp_replace(public.citext, public.citext, text, text) TO authenticated;
GRANT ALL ON FUNCTION public.regexp_replace(public.citext, public.citext, text, text) TO service_role;


--
-- Name: FUNCTION regexp_split_to_array(public.citext, public.citext); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.regexp_split_to_array(public.citext, public.citext) TO postgres;
GRANT ALL ON FUNCTION public.regexp_split_to_array(public.citext, public.citext) TO anon;
GRANT ALL ON FUNCTION public.regexp_split_to_array(public.citext, public.citext) TO authenticated;
GRANT ALL ON FUNCTION public.regexp_split_to_array(public.citext, public.citext) TO service_role;


--
-- Name: FUNCTION regexp_split_to_array(public.citext, public.citext, text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.regexp_split_to_array(public.citext, public.citext, text) TO postgres;
GRANT ALL ON FUNCTION public.regexp_split_to_array(public.citext, public.citext, text) TO anon;
GRANT ALL ON FUNCTION public.regexp_split_to_array(public.citext, public.citext, text) TO authenticated;
GRANT ALL ON FUNCTION public.regexp_split_to_array(public.citext, public.citext, text) TO service_role;


--
-- Name: FUNCTION regexp_split_to_table(public.citext, public.citext); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.regexp_split_to_table(public.citext, public.citext) TO postgres;
GRANT ALL ON FUNCTION public.regexp_split_to_table(public.citext, public.citext) TO anon;
GRANT ALL ON FUNCTION public.regexp_split_to_table(public.citext, public.citext) TO authenticated;
GRANT ALL ON FUNCTION public.regexp_split_to_table(public.citext, public.citext) TO service_role;


--
-- Name: FUNCTION regexp_split_to_table(public.citext, public.citext, text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.regexp_split_to_table(public.citext, public.citext, text) TO postgres;
GRANT ALL ON FUNCTION public.regexp_split_to_table(public.citext, public.citext, text) TO anon;
GRANT ALL ON FUNCTION public.regexp_split_to_table(public.citext, public.citext, text) TO authenticated;
GRANT ALL ON FUNCTION public.regexp_split_to_table(public.citext, public.citext, text) TO service_role;


--
-- Name: FUNCTION replace(public.citext, public.citext, public.citext); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.replace(public.citext, public.citext, public.citext) TO postgres;
GRANT ALL ON FUNCTION public.replace(public.citext, public.citext, public.citext) TO anon;
GRANT ALL ON FUNCTION public.replace(public.citext, public.citext, public.citext) TO authenticated;
GRANT ALL ON FUNCTION public.replace(public.citext, public.citext, public.citext) TO service_role;


--
-- Name: FUNCTION split_part(public.citext, public.citext, integer); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.split_part(public.citext, public.citext, integer) TO postgres;
GRANT ALL ON FUNCTION public.split_part(public.citext, public.citext, integer) TO anon;
GRANT ALL ON FUNCTION public.split_part(public.citext, public.citext, integer) TO authenticated;
GRANT ALL ON FUNCTION public.split_part(public.citext, public.citext, integer) TO service_role;


--
-- Name: FUNCTION strpos(public.citext, public.citext); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.strpos(public.citext, public.citext) TO postgres;
GRANT ALL ON FUNCTION public.strpos(public.citext, public.citext) TO anon;
GRANT ALL ON FUNCTION public.strpos(public.citext, public.citext) TO authenticated;
GRANT ALL ON FUNCTION public.strpos(public.citext, public.citext) TO service_role;


--
-- Name: FUNCTION texticlike(public.citext, text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.texticlike(public.citext, text) TO postgres;
GRANT ALL ON FUNCTION public.texticlike(public.citext, text) TO anon;
GRANT ALL ON FUNCTION public.texticlike(public.citext, text) TO authenticated;
GRANT ALL ON FUNCTION public.texticlike(public.citext, text) TO service_role;


--
-- Name: FUNCTION texticlike(public.citext, public.citext); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.texticlike(public.citext, public.citext) TO postgres;
GRANT ALL ON FUNCTION public.texticlike(public.citext, public.citext) TO anon;
GRANT ALL ON FUNCTION public.texticlike(public.citext, public.citext) TO authenticated;
GRANT ALL ON FUNCTION public.texticlike(public.citext, public.citext) TO service_role;


--
-- Name: FUNCTION texticnlike(public.citext, text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.texticnlike(public.citext, text) TO postgres;
GRANT ALL ON FUNCTION public.texticnlike(public.citext, text) TO anon;
GRANT ALL ON FUNCTION public.texticnlike(public.citext, text) TO authenticated;
GRANT ALL ON FUNCTION public.texticnlike(public.citext, text) TO service_role;


--
-- Name: FUNCTION texticnlike(public.citext, public.citext); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.texticnlike(public.citext, public.citext) TO postgres;
GRANT ALL ON FUNCTION public.texticnlike(public.citext, public.citext) TO anon;
GRANT ALL ON FUNCTION public.texticnlike(public.citext, public.citext) TO authenticated;
GRANT ALL ON FUNCTION public.texticnlike(public.citext, public.citext) TO service_role;


--
-- Name: FUNCTION texticregexeq(public.citext, text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.texticregexeq(public.citext, text) TO postgres;
GRANT ALL ON FUNCTION public.texticregexeq(public.citext, text) TO anon;
GRANT ALL ON FUNCTION public.texticregexeq(public.citext, text) TO authenticated;
GRANT ALL ON FUNCTION public.texticregexeq(public.citext, text) TO service_role;


--
-- Name: FUNCTION texticregexeq(public.citext, public.citext); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.texticregexeq(public.citext, public.citext) TO postgres;
GRANT ALL ON FUNCTION public.texticregexeq(public.citext, public.citext) TO anon;
GRANT ALL ON FUNCTION public.texticregexeq(public.citext, public.citext) TO authenticated;
GRANT ALL ON FUNCTION public.texticregexeq(public.citext, public.citext) TO service_role;


--
-- Name: FUNCTION texticregexne(public.citext, text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.texticregexne(public.citext, text) TO postgres;
GRANT ALL ON FUNCTION public.texticregexne(public.citext, text) TO anon;
GRANT ALL ON FUNCTION public.texticregexne(public.citext, text) TO authenticated;
GRANT ALL ON FUNCTION public.texticregexne(public.citext, text) TO service_role;


--
-- Name: FUNCTION texticregexne(public.citext, public.citext); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.texticregexne(public.citext, public.citext) TO postgres;
GRANT ALL ON FUNCTION public.texticregexne(public.citext, public.citext) TO anon;
GRANT ALL ON FUNCTION public.texticregexne(public.citext, public.citext) TO authenticated;
GRANT ALL ON FUNCTION public.texticregexne(public.citext, public.citext) TO service_role;


--
-- Name: FUNCTION translate(public.citext, public.citext, text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.translate(public.citext, public.citext, text) TO postgres;
GRANT ALL ON FUNCTION public.translate(public.citext, public.citext, text) TO anon;
GRANT ALL ON FUNCTION public.translate(public.citext, public.citext, text) TO authenticated;
GRANT ALL ON FUNCTION public.translate(public.citext, public.citext, text) TO service_role;


--
-- Name: FUNCTION update_thread_stats(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.update_thread_stats() TO anon;
GRANT ALL ON FUNCTION public.update_thread_stats() TO authenticated;
GRANT ALL ON FUNCTION public.update_thread_stats() TO service_role;


--
-- Name: FUNCTION update_updated_at_column(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.update_updated_at_column() TO anon;
GRANT ALL ON FUNCTION public.update_updated_at_column() TO authenticated;
GRANT ALL ON FUNCTION public.update_updated_at_column() TO service_role;


--
-- Name: FUNCTION apply_rls(wal jsonb, max_record_bytes integer); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO postgres;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO anon;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO authenticated;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO service_role;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO supabase_realtime_admin;


--
-- Name: FUNCTION broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text) TO postgres;
GRANT ALL ON FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text) TO dashboard_user;


--
-- Name: FUNCTION build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO postgres;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO anon;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO authenticated;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO service_role;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO supabase_realtime_admin;


--
-- Name: FUNCTION "cast"(val text, type_ regtype); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO postgres;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO dashboard_user;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO anon;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO authenticated;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO service_role;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO supabase_realtime_admin;


--
-- Name: FUNCTION check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO postgres;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO anon;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO authenticated;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO service_role;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO supabase_realtime_admin;


--
-- Name: FUNCTION is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO postgres;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO anon;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO authenticated;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO service_role;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO supabase_realtime_admin;


--
-- Name: FUNCTION list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO postgres;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO anon;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO authenticated;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO service_role;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO supabase_realtime_admin;


--
-- Name: FUNCTION quote_wal2json(entity regclass); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO postgres;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO anon;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO authenticated;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO service_role;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO supabase_realtime_admin;


--
-- Name: FUNCTION send(payload jsonb, event text, topic text, private boolean); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean) TO postgres;
GRANT ALL ON FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean) TO dashboard_user;


--
-- Name: FUNCTION subscription_check_filters(); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO postgres;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO dashboard_user;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO anon;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO authenticated;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO service_role;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO supabase_realtime_admin;


--
-- Name: FUNCTION to_regrole(role_name text); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO postgres;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO anon;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO authenticated;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO service_role;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO supabase_realtime_admin;


--
-- Name: FUNCTION topic(); Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON FUNCTION realtime.topic() TO postgres;
GRANT ALL ON FUNCTION realtime.topic() TO dashboard_user;


--
-- Name: FUNCTION _crypto_aead_det_decrypt(message bytea, additional bytea, key_id bigint, context bytea, nonce bytea); Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT ALL ON FUNCTION vault._crypto_aead_det_decrypt(message bytea, additional bytea, key_id bigint, context bytea, nonce bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION vault._crypto_aead_det_decrypt(message bytea, additional bytea, key_id bigint, context bytea, nonce bytea) TO service_role;


--
-- Name: FUNCTION create_secret(new_secret text, new_name text, new_description text, new_key_id uuid); Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT ALL ON FUNCTION vault.create_secret(new_secret text, new_name text, new_description text, new_key_id uuid) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION vault.create_secret(new_secret text, new_name text, new_description text, new_key_id uuid) TO service_role;


--
-- Name: FUNCTION update_secret(secret_id uuid, new_secret text, new_name text, new_description text, new_key_id uuid); Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT ALL ON FUNCTION vault.update_secret(secret_id uuid, new_secret text, new_name text, new_description text, new_key_id uuid) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION vault.update_secret(secret_id uuid, new_secret text, new_name text, new_description text, new_key_id uuid) TO service_role;


--
-- Name: FUNCTION max(public.citext); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.max(public.citext) TO postgres;
GRANT ALL ON FUNCTION public.max(public.citext) TO anon;
GRANT ALL ON FUNCTION public.max(public.citext) TO authenticated;
GRANT ALL ON FUNCTION public.max(public.citext) TO service_role;


--
-- Name: FUNCTION min(public.citext); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.min(public.citext) TO postgres;
GRANT ALL ON FUNCTION public.min(public.citext) TO anon;
GRANT ALL ON FUNCTION public.min(public.citext) TO authenticated;
GRANT ALL ON FUNCTION public.min(public.citext) TO service_role;


--
-- Name: TABLE audit_log_entries; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.audit_log_entries TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.audit_log_entries TO postgres;
GRANT SELECT ON TABLE auth.audit_log_entries TO postgres WITH GRANT OPTION;


--
-- Name: TABLE flow_state; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.flow_state TO postgres;
GRANT SELECT ON TABLE auth.flow_state TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.flow_state TO dashboard_user;


--
-- Name: TABLE identities; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.identities TO postgres;
GRANT SELECT ON TABLE auth.identities TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.identities TO dashboard_user;


--
-- Name: TABLE instances; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.instances TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.instances TO postgres;
GRANT SELECT ON TABLE auth.instances TO postgres WITH GRANT OPTION;


--
-- Name: TABLE mfa_amr_claims; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.mfa_amr_claims TO postgres;
GRANT SELECT ON TABLE auth.mfa_amr_claims TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.mfa_amr_claims TO dashboard_user;


--
-- Name: TABLE mfa_challenges; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.mfa_challenges TO postgres;
GRANT SELECT ON TABLE auth.mfa_challenges TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.mfa_challenges TO dashboard_user;


--
-- Name: TABLE mfa_factors; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.mfa_factors TO postgres;
GRANT SELECT ON TABLE auth.mfa_factors TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.mfa_factors TO dashboard_user;


--
-- Name: TABLE one_time_tokens; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.one_time_tokens TO postgres;
GRANT SELECT ON TABLE auth.one_time_tokens TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.one_time_tokens TO dashboard_user;


--
-- Name: TABLE refresh_tokens; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.refresh_tokens TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.refresh_tokens TO postgres;
GRANT SELECT ON TABLE auth.refresh_tokens TO postgres WITH GRANT OPTION;


--
-- Name: SEQUENCE refresh_tokens_id_seq; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON SEQUENCE auth.refresh_tokens_id_seq TO dashboard_user;
GRANT ALL ON SEQUENCE auth.refresh_tokens_id_seq TO postgres;


--
-- Name: TABLE saml_providers; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.saml_providers TO postgres;
GRANT SELECT ON TABLE auth.saml_providers TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.saml_providers TO dashboard_user;


--
-- Name: TABLE saml_relay_states; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.saml_relay_states TO postgres;
GRANT SELECT ON TABLE auth.saml_relay_states TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.saml_relay_states TO dashboard_user;


--
-- Name: TABLE schema_migrations; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT SELECT ON TABLE auth.schema_migrations TO postgres WITH GRANT OPTION;


--
-- Name: TABLE sessions; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.sessions TO postgres;
GRANT SELECT ON TABLE auth.sessions TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.sessions TO dashboard_user;


--
-- Name: TABLE sso_domains; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.sso_domains TO postgres;
GRANT SELECT ON TABLE auth.sso_domains TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.sso_domains TO dashboard_user;


--
-- Name: TABLE sso_providers; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.sso_providers TO postgres;
GRANT SELECT ON TABLE auth.sso_providers TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.sso_providers TO dashboard_user;


--
-- Name: TABLE users; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.users TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.users TO postgres;
GRANT SELECT ON TABLE auth.users TO postgres WITH GRANT OPTION;


--
-- Name: TABLE pg_stat_statements; Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON TABLE extensions.pg_stat_statements FROM postgres;
GRANT ALL ON TABLE extensions.pg_stat_statements TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE extensions.pg_stat_statements TO dashboard_user;


--
-- Name: TABLE pg_stat_statements_info; Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON TABLE extensions.pg_stat_statements_info FROM postgres;
GRANT ALL ON TABLE extensions.pg_stat_statements_info TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE extensions.pg_stat_statements_info TO dashboard_user;


--
-- Name: TABLE organisations; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.organisations TO anon;
GRANT ALL ON TABLE public.organisations TO authenticated;
GRANT ALL ON TABLE public.organisations TO service_role;


--
-- Name: TABLE profiles; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.profiles TO service_role;
GRANT ALL ON TABLE public.profiles TO supabase_auth_admin;
GRANT ALL ON TABLE public.profiles TO authenticated;


--
-- Name: TABLE admin_organisations; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.admin_organisations TO anon;
GRANT ALL ON TABLE public.admin_organisations TO authenticated;
GRANT ALL ON TABLE public.admin_organisations TO service_role;


--
-- Name: TABLE analytics_events; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.analytics_events TO anon;
GRANT ALL ON TABLE public.analytics_events TO authenticated;
GRANT ALL ON TABLE public.analytics_events TO service_role;


--
-- Name: TABLE audit_logs; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.audit_logs TO anon;
GRANT ALL ON TABLE public.audit_logs TO authenticated;
GRANT ALL ON TABLE public.audit_logs TO service_role;


--
-- Name: TABLE export_jobs; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.export_jobs TO anon;
GRANT ALL ON TABLE public.export_jobs TO authenticated;
GRANT ALL ON TABLE public.export_jobs TO service_role;


--
-- Name: TABLE forum_categories; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.forum_categories TO anon;
GRANT ALL ON TABLE public.forum_categories TO authenticated;
GRANT ALL ON TABLE public.forum_categories TO service_role;


--
-- Name: TABLE forum_media; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.forum_media TO anon;
GRANT ALL ON TABLE public.forum_media TO authenticated;
GRANT ALL ON TABLE public.forum_media TO service_role;


--
-- Name: TABLE forum_replies; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.forum_replies TO anon;
GRANT ALL ON TABLE public.forum_replies TO authenticated;
GRANT ALL ON TABLE public.forum_replies TO service_role;


--
-- Name: TABLE forum_reply_likes; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.forum_reply_likes TO anon;
GRANT ALL ON TABLE public.forum_reply_likes TO authenticated;
GRANT ALL ON TABLE public.forum_reply_likes TO service_role;


--
-- Name: TABLE forum_thread_likes; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.forum_thread_likes TO anon;
GRANT ALL ON TABLE public.forum_thread_likes TO authenticated;
GRANT ALL ON TABLE public.forum_thread_likes TO service_role;


--
-- Name: TABLE forum_threads; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.forum_threads TO anon;
GRANT ALL ON TABLE public.forum_threads TO authenticated;
GRANT ALL ON TABLE public.forum_threads TO service_role;


--
-- Name: TABLE notifications; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.notifications TO anon;
GRANT ALL ON TABLE public.notifications TO authenticated;
GRANT ALL ON TABLE public.notifications TO service_role;


--
-- Name: TABLE organisation_affiliation_requests; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.organisation_affiliation_requests TO anon;
GRANT ALL ON TABLE public.organisation_affiliation_requests TO authenticated;
GRANT ALL ON TABLE public.organisation_affiliation_requests TO service_role;


--
-- Name: TABLE organisation_collaborations; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.organisation_collaborations TO anon;
GRANT ALL ON TABLE public.organisation_collaborations TO authenticated;
GRANT ALL ON TABLE public.organisation_collaborations TO service_role;


--
-- Name: TABLE pages; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.pages TO anon;
GRANT ALL ON TABLE public.pages TO authenticated;
GRANT ALL ON TABLE public.pages TO service_role;


--
-- Name: TABLE project_events; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.project_events TO anon;
GRANT ALL ON TABLE public.project_events TO authenticated;
GRANT ALL ON TABLE public.project_events TO service_role;


--
-- Name: TABLE project_funders; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.project_funders TO anon;
GRANT ALL ON TABLE public.project_funders TO authenticated;
GRANT ALL ON TABLE public.project_funders TO service_role;


--
-- Name: TABLE project_media; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.project_media TO anon;
GRANT ALL ON TABLE public.project_media TO authenticated;
GRANT ALL ON TABLE public.project_media TO service_role;


--
-- Name: TABLE project_milestones; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.project_milestones TO anon;
GRANT ALL ON TABLE public.project_milestones TO authenticated;
GRANT ALL ON TABLE public.project_milestones TO service_role;


--
-- Name: TABLE projects; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.projects TO anon;
GRANT ALL ON TABLE public.projects TO authenticated;
GRANT ALL ON TABLE public.projects TO service_role;


--
-- Name: TABLE roles; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.roles TO anon;
GRANT ALL ON TABLE public.roles TO authenticated;
GRANT ALL ON TABLE public.roles TO service_role;
GRANT ALL ON TABLE public.roles TO supabase_auth_admin;


--
-- Name: TABLE sectors; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.sectors TO anon;
GRANT ALL ON TABLE public.sectors TO authenticated;
GRANT ALL ON TABLE public.sectors TO service_role;


--
-- Name: TABLE translations; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.translations TO anon;
GRANT ALL ON TABLE public.translations TO authenticated;
GRANT ALL ON TABLE public.translations TO service_role;


--
-- Name: TABLE user_favorites; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.user_favorites TO anon;
GRANT ALL ON TABLE public.user_favorites TO authenticated;
GRANT ALL ON TABLE public.user_favorites TO service_role;


--
-- Name: TABLE messages; Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON TABLE realtime.messages TO postgres;
GRANT ALL ON TABLE realtime.messages TO dashboard_user;
GRANT SELECT,INSERT,UPDATE ON TABLE realtime.messages TO anon;
GRANT SELECT,INSERT,UPDATE ON TABLE realtime.messages TO authenticated;
GRANT SELECT,INSERT,UPDATE ON TABLE realtime.messages TO service_role;


--
-- Name: TABLE schema_migrations; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON TABLE realtime.schema_migrations TO postgres;
GRANT ALL ON TABLE realtime.schema_migrations TO dashboard_user;
GRANT SELECT ON TABLE realtime.schema_migrations TO anon;
GRANT SELECT ON TABLE realtime.schema_migrations TO authenticated;
GRANT SELECT ON TABLE realtime.schema_migrations TO service_role;
GRANT ALL ON TABLE realtime.schema_migrations TO supabase_realtime_admin;


--
-- Name: TABLE subscription; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON TABLE realtime.subscription TO postgres;
GRANT ALL ON TABLE realtime.subscription TO dashboard_user;
GRANT SELECT ON TABLE realtime.subscription TO anon;
GRANT SELECT ON TABLE realtime.subscription TO authenticated;
GRANT SELECT ON TABLE realtime.subscription TO service_role;
GRANT ALL ON TABLE realtime.subscription TO supabase_realtime_admin;


--
-- Name: SEQUENCE subscription_id_seq; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON SEQUENCE realtime.subscription_id_seq TO postgres;
GRANT ALL ON SEQUENCE realtime.subscription_id_seq TO dashboard_user;
GRANT USAGE ON SEQUENCE realtime.subscription_id_seq TO anon;
GRANT USAGE ON SEQUENCE realtime.subscription_id_seq TO authenticated;
GRANT USAGE ON SEQUENCE realtime.subscription_id_seq TO service_role;
GRANT ALL ON SEQUENCE realtime.subscription_id_seq TO supabase_realtime_admin;


--
-- Name: TABLE buckets; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.buckets TO anon;
GRANT ALL ON TABLE storage.buckets TO authenticated;
GRANT ALL ON TABLE storage.buckets TO service_role;
GRANT ALL ON TABLE storage.buckets TO postgres WITH GRANT OPTION;


--
-- Name: TABLE buckets_analytics; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.buckets_analytics TO service_role;
GRANT ALL ON TABLE storage.buckets_analytics TO authenticated;
GRANT ALL ON TABLE storage.buckets_analytics TO anon;


--
-- Name: TABLE objects; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.objects TO anon;
GRANT ALL ON TABLE storage.objects TO authenticated;
GRANT ALL ON TABLE storage.objects TO service_role;
GRANT ALL ON TABLE storage.objects TO postgres WITH GRANT OPTION;


--
-- Name: TABLE prefixes; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.prefixes TO service_role;
GRANT ALL ON TABLE storage.prefixes TO authenticated;
GRANT ALL ON TABLE storage.prefixes TO anon;


--
-- Name: TABLE s3_multipart_uploads; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.s3_multipart_uploads TO service_role;
GRANT SELECT ON TABLE storage.s3_multipart_uploads TO authenticated;
GRANT SELECT ON TABLE storage.s3_multipart_uploads TO anon;


--
-- Name: TABLE s3_multipart_uploads_parts; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.s3_multipart_uploads_parts TO service_role;
GRANT SELECT ON TABLE storage.s3_multipart_uploads_parts TO authenticated;
GRANT SELECT ON TABLE storage.s3_multipart_uploads_parts TO anon;


--
-- Name: TABLE secrets; Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT SELECT,REFERENCES,DELETE,TRUNCATE ON TABLE vault.secrets TO postgres WITH GRANT OPTION;
GRANT SELECT,DELETE ON TABLE vault.secrets TO service_role;


--
-- Name: TABLE decrypted_secrets; Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT SELECT,REFERENCES,DELETE,TRUNCATE ON TABLE vault.decrypted_secrets TO postgres WITH GRANT OPTION;
GRANT SELECT,DELETE ON TABLE vault.decrypted_secrets TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON SEQUENCES TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON FUNCTIONS TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON TABLES TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: extensions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA extensions GRANT ALL ON SEQUENCES TO postgres WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: extensions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA extensions GRANT ALL ON FUNCTIONS TO postgres WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: extensions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA extensions GRANT ALL ON TABLES TO postgres WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: graphql_public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: graphql_public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: graphql_public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON SEQUENCES TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON FUNCTIONS TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON TABLES TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO service_role;


--
-- Name: issue_graphql_placeholder; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_graphql_placeholder ON sql_drop
         WHEN TAG IN ('DROP EXTENSION')
   EXECUTE FUNCTION extensions.set_graphql_placeholder();


ALTER EVENT TRIGGER issue_graphql_placeholder OWNER TO supabase_admin;

--
-- Name: issue_pg_cron_access; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_pg_cron_access ON ddl_command_end
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION extensions.grant_pg_cron_access();


ALTER EVENT TRIGGER issue_pg_cron_access OWNER TO supabase_admin;

--
-- Name: issue_pg_graphql_access; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_pg_graphql_access ON ddl_command_end
         WHEN TAG IN ('CREATE FUNCTION')
   EXECUTE FUNCTION extensions.grant_pg_graphql_access();


ALTER EVENT TRIGGER issue_pg_graphql_access OWNER TO supabase_admin;

--
-- Name: issue_pg_net_access; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_pg_net_access ON ddl_command_end
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION extensions.grant_pg_net_access();


ALTER EVENT TRIGGER issue_pg_net_access OWNER TO supabase_admin;

--
-- Name: pgrst_ddl_watch; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER pgrst_ddl_watch ON ddl_command_end
   EXECUTE FUNCTION extensions.pgrst_ddl_watch();


ALTER EVENT TRIGGER pgrst_ddl_watch OWNER TO supabase_admin;

--
-- Name: pgrst_drop_watch; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER pgrst_drop_watch ON sql_drop
   EXECUTE FUNCTION extensions.pgrst_drop_watch();


ALTER EVENT TRIGGER pgrst_drop_watch OWNER TO supabase_admin;

--
-- PostgreSQL database dump complete
--

\unrestrict sNeObwJ6fe6v0RuCjIgrU8IHmmviamjF5ER0JIj2eY61jzofE57L67ucIYTPCik

