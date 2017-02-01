# Changelog for v4

4.2.0 - 06 May 2016

- Added events dispatching before and after running statements and stacks

4.1.1 - 06 May 2016

- Added `registerExistingConnection` in ConnectionManager

4.1.0 - 02 May 2016

- Added `updateStatistics()` method on the ResultCollection for combined statistics of stacks, transactions, etc..

4.0.2 - 28 Apr 2016

- Fixed a bug where relationships deleted count was not hydrated in the http result update statistics

4.0.1 - 27 Apr 2016

- Fixed a bug where `nodeValue` was using a hardcoded identifier [8bf11473c9870c2423de2763622d2674b97216db](8bf11473c9870c2423de2763622d2674b97216db)

4.0.0 - 25 Apr 2016

Initial 4.0 release for support with Neo4j 3.0