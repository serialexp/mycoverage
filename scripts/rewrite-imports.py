#!/usr/bin/env python3
"""Rewrite import specifiers after the monorepo move. Dry-run by default; pass
--apply to write changes. (Rule #6: review before applying.)

Scope: the live tree only (packages/core, apps/*). `legacy/` is intentionally
excluded — those files are ported one at a time later. `packages/db` is excluded
from the @prisma/client rewrite because it is the single place that should keep
importing @prisma/client (it re-exports it as @mycoverage/db).
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
APPLY = "--apply" in sys.argv

# (regex, replacement). Order matters: longer/more-specific prefixes first.
RULES = [
    (re.compile(r"(['\"])db/dbtypes(?=['\"])"), r"\1@mycoverage/db/dbtypes"),
    (re.compile(r"(['\"])db/seeds(?=['\"])"), r"\1@mycoverage/db/seeds"),
    (re.compile(r"(['\"])db(['\"])"), r"\1@mycoverage/db\2"),
    (re.compile(r"(['\"])src/library/"), r"\1@mycoverage/core/library/"),
    (re.compile(r"(['\"])src/queues/"), r"\1@mycoverage/core/queues/"),
    (re.compile(r"(['\"])src/library(['\"])"), r"\1@mycoverage/core/library/index\2"),
    (re.compile(r"(['\"])@prisma/client(['\"])"), r"\1@mycoverage/db\2"),
]
# Rules that must NOT run inside packages/db (it owns @prisma/client).
DB_EXCLUDED_PREFIXES = ("@prisma/client",)

DIRS = ["packages/core", "apps/server", "apps/web", "apps/worker", "packages/db"]
EXTS = {".ts", ".tsx", ".mts", ".cts"}

changed = 0
for d in DIRS:
    base = ROOT / d
    in_db = d == "packages/db"
    for path in base.rglob("*"):
        if path.suffix not in EXTS or "node_modules" in path.parts or "dist" in path.parts:
            continue
        text = path.read_text()
        new = text
        for rx, repl in RULES:
            if in_db and "@prisma/client" in rx.pattern:
                continue
            new = rx.sub(repl, new)
        if new != text:
            changed += 1
            print(f"\n=== {path.relative_to(ROOT)} ===")
            for i, (a, b) in enumerate(zip(text.splitlines(), new.splitlines())):
                if a != b:
                    print(f"  - {a.strip()}")
                    print(f"  + {b.strip()}")
            if APPLY:
                path.write_text(new)

print(f"\n{'APPLIED' if APPLY else 'DRY-RUN'}: {changed} file(s) would change.")
