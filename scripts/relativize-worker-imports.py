#!/usr/bin/env python3
"""Convert worker-internal absolute `src/processors/...` imports into paths
relative to each importing file. Dry-run by default; --apply to write."""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
WORKER_SRC = ROOT / "apps/worker/src"
APPLY = "--apply" in sys.argv

spec_rx = re.compile(r"(['\"])src/(processors/[^'\"]+)\1")

changed = 0
for path in WORKER_SRC.rglob("*.ts"):
    if "node_modules" in path.parts:
        continue
    text = path.read_text()

    def repl(m):
        quote, rest = m.group(1), m.group(2)  # rest e.g. processors/addEventListeners
        target = WORKER_SRC / rest
        rel = Path(__file__)  # placeholder
        rel = target.relative_to(WORKER_SRC) if False else None
        # compute path relative to the importing file's directory
        import os

        relpath = os.path.relpath(target, path.parent)
        if not relpath.startswith("."):
            relpath = "./" + relpath
        return f"{quote}{relpath}{quote}"

    new = spec_rx.sub(repl, text)
    if new != text:
        changed += 1
        print(f"\n=== {path.relative_to(ROOT)} ===")
        for a, b in zip(text.splitlines(), new.splitlines()):
            if a != b:
                print(f"  - {a.strip()}")
                print(f"  + {b.strip()}")
        if APPLY:
            path.write_text(new)

print(f"\n{'APPLIED' if APPLY else 'DRY-RUN'}: {changed} file(s) would change.")
