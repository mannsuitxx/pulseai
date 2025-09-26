import pygame
import sys

# Initialize Pygame
pygame.init()

# Screen dimensions
SCREEN_WIDTH = 800
SCREEN_HEIGHT = 600
SCREEN = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))

# Title and Icon
pygame.display.set_caption("Disaster Preparedness Visual Game")
# You would typically load an icon here: pygame.display.set_icon(pygame.image.load('icon.png'))

# Colors
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)
GREEN = (0, 255, 0)
RED = (255, 0, 0)
BLUE = (0, 0, 255)

# Fonts
font = pygame.font.Font(None, 36)

# Game state (simplified)
current_scenario = "start"

scenarios = {
    "start": {
        "text": "You are in your living room. An earthquake has just started!",
        "image": "background_living_room.png", # Placeholder image
        "choices": [
            {"text": "Drop, Cover, and Hold On", "next": "safe_action"},
            {"text": "Run outside", "next": "unsafe_action"}
        ]
    },
    "safe_action": {
        "text": "You safely took cover. The shaking stops. What next?",
        "image": "background_safe.png", # Placeholder image
        "choices": [
            {"text": "Check for injuries and hazards", "next": "end_safe"}
        ]
    },
    "unsafe_action": {
        "text": "You ran outside. Debris is falling! You are injured.",
        "image": "background_injured.png", # Placeholder image
        "choices": [
            {"text": "Seek medical help", "next": "end_injured"}
        ]
    },
    "end_safe": {
        "text": "Drill complete! You acted safely.",
        "image": "background_success.png", # Placeholder image
        "choices": []
    },
    "end_injured": {
        "text": "Drill complete! Your actions led to injury.",
        "image": "background_failure.png", # Placeholder image
        "choices": []
    }
}

# Function to draw text
def draw_text(text, font, color, surface, x, y):
    textobj = font.render(text, True, color)
    textrect = textobj.get_rect()
    textrect.topleft = (x, y)
    surface.blit(textobj, textrect)

# Game loop
def run_visual_game():
    global current_scenario
    running = True
    while running:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False
            if event.type == pygame.MOUSEBUTTONDOWN:
                # Handle choice selection (simplified for demonstration)
                mouse_x, mouse_y = event.pos
                current_scenario_data = scenarios[current_scenario]
                if current_scenario_data["choices"]:
                    for i, choice in enumerate(current_scenario_data["choices"]):
                        # Assuming choices are drawn as buttons, check if mouse clicked on one
                        # This is a very basic hit detection, would need proper button objects
                        if 50 <= mouse_x <= 750 and (200 + i * 50) <= mouse_y <= (200 + i * 50 + 40):
                            current_scenario = choice["next"]
                            break

        SCREEN.fill(WHITE) # Clear screen

        # Draw background image (placeholder)
        # In a real game, you would load and blit actual images
        pygame.draw.rect(SCREEN, BLUE, (0, 0, SCREEN_WIDTH, SCREEN_HEIGHT)) # Blue background as placeholder
        draw_text("Background: " + scenarios[current_scenario]["image"], font, WHITE, SCREEN, 50, 50)

        # Draw scenario text
        draw_text(scenarios[current_scenario]["text"], font, BLACK, SCREEN, 50, 100)

        # Draw choices
        if scenarios[current_scenario]["choices"]:
            draw_text("Make a choice:", font, BLACK, SCREEN, 50, 170)
            for i, choice in enumerate(scenarios[current_scenario]["choices"]):
                # Draw choice as a clickable area (simplified)
                pygame.draw.rect(SCREEN, GREEN, (50, 200 + i * 50, 700, 40), 0) # Button background
                draw_text(f"{i+1}. {choice["text"]}", font, BLACK, SCREEN, 60, 210 + i * 50)
        else:
            draw_text("Click anywhere to restart.", font, BLACK, SCREEN, 50, 200)
            if event.type == pygame.MOUSEBUTTONDOWN:
                current_scenario = "start"

        pygame.display.flip() # Update the full display Surface to the screen

    pygame.quit()
    sys.exit()

if __name__ == "__main__":
    run_visual_game()
