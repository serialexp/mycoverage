---
sidebar_position: 1
---

# Merge requests

Merge requests in Github (and others) are a bit funny in that any workflows are ran on the merged version of the base and head branches. This means that the coverage information will be reported for a different commit SHA.

In the context of the merge request, mycoverage will prefer this merged version over the head commit. Anywhere else it'll still use the commit on the head branch.

This means that running your workflows on either `push` or `pull_request` has a different effect. If you run on `push`, the coverage information will be reported for the head commit. If you run on `pull_request`, the coverage information will be reported for the merged commit. Since coverage information in most parts of the system is tied to the commit SHA, this can lead to some confusion, where it looks like the commit has no coverage information, but the PR does.

