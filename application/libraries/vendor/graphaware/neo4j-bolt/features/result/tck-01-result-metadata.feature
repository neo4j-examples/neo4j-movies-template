Feature: Basic Result Metadata API

  Scenario: Summarize Result
    Given there is a driver configured with the "localhost" uri
    When I run a statement
    And I summarize it
    Then I should get a Result Summary back

  Scenario: Access Statement
    Given there is a driver configured with the "localhost" uri
    When I run a statement
    And I summarize it
    And I request a statement from it
    Then I should get a Statement back

  Scenario: Examine Statement
    Given there is a driver configured with the "localhost" uri
    When I run a statement with text "MATCH (n) RETURN count(n)"
    And I summarize it
    And I request a statement from it
    Then I can request the statement text and the text should be "MATCH (n) RETURN count(n)"
    And the statement parameters should be a map

  Scenario: Access Update Statistics
    Given there is a driver configured with the "localhost" uri
    When I run a statement with text "CREATE (n) RETURN n"
    And I summarize it
    And I request the update statistics
    Then I should get the UpdateStatistics back