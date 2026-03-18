#!/bin/bash
# Starts the local user-space PostgreSQL cluster (port 5434)
PGDATA="$HOME/local-postgres-db"
PG_CTL="/usr/lib/postgresql/16/bin/pg_ctl"

if $PG_CTL -D "$PGDATA" status > /dev/null 2>&1; then
    echo "PostgreSQL is already running."
else
    echo "Starting PostgreSQL..."
    $PG_CTL -D "$PGDATA" -l "$PGDATA/logfile" start
    echo "PostgreSQL started on port 5434."
fi
