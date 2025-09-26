def run_game():
    print("Welcome to the Disaster Preparedness Game: Earthquake Scenario!")
    print("-------------------------------------------------------------")

    # Scenario 1
    print("\nScenario: You are at home when a strong earthquake begins. The ground is shaking violently.")
    print("What is your immediate action?")
    print("1. Run outside to an open area.")
    print("2. Drop, Cover, and Hold On under sturdy furniture like a table or desk.")
    print("3. Stand in a doorway.")

    choice1 = input("Enter your choice (1, 2, or 3): ")

    if choice1 == '2':
        print("\nFeedback: Excellent choice! 'Drop, Cover, and Hold On' is the safest action during an earthquake. This protects you from falling objects and debris. Stay there until the shaking stops.")
        print("You are safe inside.")
        next_scenario = "safe_inside"
    elif choice1 == '1':
        print("\nFeedback: Running outside during an earthquake can be extremely dangerous due to falling debris, power lines, and unstable structures. You are now exposed to falling objects.")
        next_scenario = "exposed_outside"
    elif choice1 == '3':
        print("\nFeedback: While once recommended, doorways in modern homes are often not stronger than other parts of the structure and may not protect you from falling objects. Sturdy furniture offers better protection.")
        next_scenario = "less_safe_doorway"
    else:
        print("\nInvalid choice. For safety, we'll assume you chose to Drop, Cover, and Hold On.")
        next_scenario = "safe_inside"

    # Scenario 2 (based on choice1)
    if next_scenario == "safe_inside":
        print("\nScenario: The shaking has stopped. You are safe under your sturdy furniture.")
        print("What is your next step?")
        print("1. Immediately rush outside to check on neighbors.")
        print("2. Stay put for a moment, then carefully check yourself and those around you for injuries. Assess your immediate surroundings for hazards.")
        
        choice2 = input("Enter your choice (1 or 2): ")
        if choice2 == '2':
            print("\nFeedback: Correct. After the shaking stops, take a moment to ensure personal safety and check for immediate hazards like gas leaks, fires, or structural damage before moving.")
            next_scenario_2 = "check_hazards_inside"
        else:
            print("\nFeedback: It's important to check for hazards inside your home first. Aftershocks can occur, and damaged utilities can pose risks. Ensure your immediate surroundings are safe before moving.")
            next_scenario_2 = "check_hazards_inside"

    elif next_scenario == "exposed_outside":
        print("\nScenario: You ran outside, but now power lines are swaying, and debris is falling around you. The ground is still shaking.")
        print("What do you do?")
        print("1. Try to run back inside your house.")
        print("2. Crouch down in an open area away from buildings, trees, and power lines, covering your head and neck.")

        choice2 = input("Enter your choice (1 or 2): ")
        if choice2 == '2':
            print("\nFeedback: Good decision. If you are caught outside, moving to an open area and protecting yourself is the best course of action until the shaking stops.")
            next_scenario_2 = "safe_outside"
        else:
            print("\nFeedback: Going back inside during an earthquake is risky as the structure might be compromised. It's better to find an open space.")
            next_scenario_2 = "exposed_outside_continue" # Leads to a less ideal outcome

    elif next_scenario == "less_safe_doorway":
        print("\nScenario: You stood in a doorway. The shaking was intense, and some plaster fell from the ceiling. What do you do now that the shaking has stopped?")
        print("1. Proceed with caution, checking for injuries and hazards.")
        print("2. Immediately rush outside.")

        choice2 = input("Enter your choice (1 or 2): ")
        if choice2 == '1':
            print("\nFeedback: Good. Always prioritize safety and assess your surroundings after an earthquake.")
            next_scenario_2 = "check_hazards_inside"
        else:
            print("\nFeedback: Rushing outside without checking for hazards inside can be dangerous. Proceed with caution.")
            next_scenario_2 = "check_hazards_inside" # Still leads to checking hazards

    # Scenario 3 (based on choice2)
    if next_scenario_2 == "check_hazards_inside":
        print("\nScenario: You've checked for injuries and immediate hazards. You notice a strong smell of gas.")
        print("What is your next action?")
        print("1. Try to find the source of the leak and fix it.")
        print("2. Open windows and doors, then evacuate immediately and call the gas company from a safe distance.")

        choice3 = input("Enter your choice (1 or 2): ")
        if choice3 == '2':
            print("\nFeedback: Absolutely correct. Ventilate the area, evacuate everyone, and contact emergency services or the gas company from a safe location. Do not use any electrical switches or phones inside.")
            print("\nDrill Concluded! You successfully navigated the earthquake and gas leak scenario safely.")
        else:
            print("\nFeedback: Never try to fix a gas leak yourself. This can be extremely dangerous and lead to an explosion. You are now in a dangerous situation.")
            print("\nDrill Concluded! Your actions led to a dangerous outcome due to the gas leak.")

    elif next_scenario_2 == "safe_outside":
        print("\nScenario: The shaking has stopped. You are in a safe open area.")
        print("What is your next step?")
        print("1. Carefully move to a designated safe assembly point, if one exists, or a safe open space.")
        print("2. Immediately go back inside your house.")

        choice3 = input("Enter your choice (1 or 2): ")
        if choice3 == '1':
            print("\nFeedback: Good. Once the shaking stops, assess your surroundings and move to a safe, open area, being mindful of potential aftershocks and hazards.")
            print("\nDrill Concluded! You remained safe outside and moved to an assembly point.")
        else:
            print("\nFeedback: Going back inside immediately after an earthquake can be dangerous due to potential aftershocks and structural damage. Always assess the situation first.")
            print("\nDrill Concluded! Your actions led to a less safe outcome.")

    elif next_scenario_2 == "exposed_outside_continue":
        print("\nScenario: You tried to run back inside, but the shaking intensified, and more debris fell. You are now injured.")
        print("\nDrill Concluded! Your actions led to an injury during the earthquake.")

    print("\nThank you for playing the Disaster Preparedness Game!")

if __name__ == "__main__":
    run_game()
