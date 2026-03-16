import os
import subprocess
from PIL import Image

files_to_recover = [
    "assets/images/image13.png",
    "assets/images/cropped/image13_cropped.png",
    "assets/images/image14.png",
    "assets/images/cropped/image14_cropped.png"
]

commit_hash = "30536a7"

for f in files_to_recover:
    try:
        # Checkout the file from the old commit
        subprocess.run(["git", "checkout", commit_hash, "--", f], check=True)
        print(f"Checked out {f}")
        
        # Open and optimize the PNG natively without color quantization
        img = Image.open(f)
        # Convert to RGB or RGBA if it isn't already to ensure true color
        if img.mode not in ('RGB', 'RGBA'):
            if 'A' in img.getbands():
                img = img.convert('RGBA')
            else:
                img = img.convert('RGB')
                
        img.save(f, 'PNG', optimize=True)
        print(f"Optimized true color {f}")
    except Exception as e:
        print(f"Error processing {f}: {e}")
