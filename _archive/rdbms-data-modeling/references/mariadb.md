# MariaDB

## Defaults

- Treat MariaDB as its own target, not a drop-in assumption for MySQL features.
- Prefer simple, portable DDL unless you know the deployment is MariaDB-only.
- Make JSON usage explicit and bounded.

## Watchouts

- The `JSON` data type is an alias rather than the same binary JSON implementation used by MySQL.
- UUID storage and generation choices remain application- or convention-driven.
- Sequence support exists, but many existing installations still lean on auto-increment patterns.

## Official URLs

- `https://mariadb.com/kb/en/library/json-data-type/`
