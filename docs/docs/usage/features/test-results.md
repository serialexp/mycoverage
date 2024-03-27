---
sidebar_position: 1
---

# Test Results

![Test results](/img/features/test-results.png)

All coverage is uploaded to mycoverage in the form of test results. This means that you can see the coverage of your tests, and not just the coverage of your code.

Every test can have multiple 'instances'. A new instance will be created any time a test is re-ran.

If you expect a certain test to return a specific number of results, you can give each of these tests an index. It then becomes possible to count the number of instances recieved, and only consider the test a success if all the instances are there.

Note that if you set an expected number of instances, this does not prevent multiple reports for a specific index. If you require 2 instances, you an have 3 results for index 1, and only a single result for index 2, and the test will be considered a success. The most common reason this would happen is if a flaky test is re-ran multiple times until it succeeds.

The index for a test is set in the `index` field of the Github action.

```yaml
# workflow.yaml
- uses: serialexp/mycoverage-action@v2
  with:
    # we are sending coverage information
    kind: coverage
    # coverage information is required to be `lcov` because every other format sucks
    file: coverage/lcov.info
    # you are required to specify an endpoint, even if you want to use the global instance
    endpoint: https://mycoverage.dev/
    # index for the test
    index: 1
    # name for the test
    test: unit
```

If you have a lot of unit tests, you could shard them, and give each shard a different index. The results for `unit` will then only be considered complete if all the required indexes are present.

## Setting expected instances

![Expected test instances](/img/features/expected-test-instances.png)

You can set the expected instances for a test in the settings. This is done by going to the settings page, and then entering a new row for the tests you want to configure instances for.
