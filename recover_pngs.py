import os
import subprocess
from PIL import Image

files_to_recover = [
    "assets/images/cropped/image17_cropped.png",
    "assets/images/cropped/image29_cropped.png",
    "assets/images/cropped/image12_cropped.png",
    "assets/images/cropped/image16_cropped.png",
    "assets/images/about_tab_image.png",
    "assets/images/cropped/about_tab_image_cropped.png",
    "assets/images/cropped/image22_cropped.png",
    "assets/images/cropped/image23_cropped.png",
    "assets/images/cropped/image11_cropped.png",
    "assets/images/project2_title.png",
    "assets/images/project1_title.png"
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
