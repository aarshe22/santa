#!/usr/bin/env python3
"""
Split santa-sprite.png into 4 separate image files.
The sprite is a 2x2 grid:
- Top-left: santa-idle.png (mouth closed)
- Top-right: santa-talk.png (mouth open)
- Bottom-left: santa-laugh1.png (laugh frame 1)
- Bottom-right: santa-laugh2.png (laugh frame 2)
"""

from PIL import Image
import os

def split_sprite():
    sprite_path = "santa-sprite.png"
    
    if not os.path.exists(sprite_path):
        print(f"Error: {sprite_path} not found!")
        return
    
    # Open the sprite image
    sprite = Image.open(sprite_path)
    width, height = sprite.size
    
    # Calculate dimensions for each frame (2x2 grid)
    frame_width = width // 2
    frame_height = height // 2
    
    print(f"Sprite size: {width}x{height}")
    print(f"Each frame: {frame_width}x{frame_height}")
    
    # Extract and save each frame
    frames = [
        (0, 0, "santa-idle.png"),      # Top-left
        (frame_width, 0, "santa-talk.png"),  # Top-right
        (0, frame_height, "santa-laugh1.png"),  # Bottom-left
        (frame_width, frame_height, "santa-laugh2.png")  # Bottom-right
    ]
    
    for x, y, filename in frames:
        # Crop the frame
        frame = sprite.crop((x, y, x + frame_width, y + frame_height))
        # Save it
        frame.save(filename)
        print(f"Created: {filename}")
    
    print("\nDone! All 4 frames have been extracted.")

if __name__ == "__main__":
    try:
        split_sprite()
    except ImportError:
        print("Error: PIL (Pillow) is required.")
        print("Install it with: pip install Pillow")
    except Exception as e:
        print(f"Error: {e}")
