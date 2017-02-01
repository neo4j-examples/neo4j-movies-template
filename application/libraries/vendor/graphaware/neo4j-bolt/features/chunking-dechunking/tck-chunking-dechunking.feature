Feature: Driver Chunking and Dechunking Test

  It is important that the types that are sent over Bolt are not corrupted.
  These Scenarios will send very large types or collections of types so that Bolts chunking and dechunking
  functionallity is used.
  Similar to to the type system feature scenarios these scenarios will echo these large values and make sure that the
  returning values are the same.

  Echoing to the server can be done by using the cypher statement "RETURN <value>",
  or "RETURN {value}" with value provided via a parameter.
  It is recommended to test each supported way of sending statements that the driver provides while running these
  cucumber scenarios.

  Scenario: should echo very long string
    Given a String of size 10000
    When the driver asks the server to echo this value back
    Then the result returned from the server should be a single record with a single value
    And the value given in the result should be the same as what was sent

  Scenario Outline: should echo very long list
    Given a List of size 1000 and type <Type>
    When the driver asks the server to echo this value back
    Then the result returned from the server should be a single record with a single value
    And the value given in the result should be the same as what was sent
    Examples:
      | Type         |
      | Null         |
      | Boolean      |
      | Integer      |
      | Float        |
      | String       |

  Scenario Outline: should echo very long map
    Given a Map of size 1000 and type <Type>
    When the driver asks the server to echo this value back
    Then the result returned from the server should be a single record with a single value
    And the value given in the result should be the same as what was sent
    Examples:
      | Type         |
      | Null         |
      | Boolean      |
      | Integer      |
      | Float        |
      | String       |

  Scenario: should echo very large node
    Given a Node with great amount of properties and labels
    When the driver asks the server to echo this node back
    Then the result returned from the server should be a single record with a single value
    And the node value given in the result should be the same as what was sent

  Scenario: Should echo very long path
    Given a path P of size 1001
    When the driver asks the server to echo this path back
    Then the result returned from the server should be a single record with a single value
    And the path value given in the result should be the same as what was sent