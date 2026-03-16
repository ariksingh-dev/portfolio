import os
import glob
from PIL import Image

base_dir = '/Users/arik/Desktop/Portfolio_coding/portfolio/assets/images/'
png_files = glob.glob(os.path.join(base_dir, '**/*.png'), recursive=True)

for p in png_files:
    if os.path.exists(p):
        try:
            img = Image.open(p)
            
            # Compress by reducing to an 8-bit palette (256 colors)
            # This is extremely effective for reducing PNG payload.
            if img.mode != 'P':
                # Preserve transparency if present
                if 'A' in img.getbands():
                    img = img.convert('RGBA')
                    # Quantize allows custom color reduction, method=2 ensures fast octree
                    img = img.quantize(colors=256, method=2)
                else:
                    img = img.convert('P', palette=Image.ADAPTIVE, colors=256)
                    
            img.save(p, 'PNG', optimize=True)
            print(f"Palette-compressed {os.path.basename(p)}")
        except Exception as e:
            print(f"Failed to compress {p}: {e}")
