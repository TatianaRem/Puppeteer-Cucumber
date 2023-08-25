Feature: Booking Cinema Tickets

  Scenario: Happy path booking the first
    Given the user is on the booking page
    When the user selects the movie date and time
    And the user chooses a seat
    Then the user should see the active "Забронировать" button

  Scenario: Sad path booking
    Given the user is on the booking page
    When the user selects the movie date and time
    And the user chooses occupied seat
    Then the user should see the disabled "Забронировать" button

    Scenario: Happy path booking the second
    Given the user is on the booking page
    When the user selects a different movie date and time
    And the user selects a seat
    Then the user should see the "Забронировать" button