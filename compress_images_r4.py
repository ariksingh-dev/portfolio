from PIL import Image
import os
import glob

base_dir = '/Users/arik/Desktop/Portfolio_coding/portfolio/assets/images/'
cropped_dir = os.path.join(base_dir, 'cropped')

# Light compression = High Quality (e.g. 85), heavy compression = (e.g. 60)
images_to_compress = [
    (os.path.join(cropped_dir, 'image6_cropped.png'), os.path.join(cropped_dir, 'image6_cropped.jpg'), 60),
    (os.path.join(cropped_dir, 'image15_cropped.png'), os.path.join(cropped_dir, 'image15_cropped.jpg'), 85), # Light compression
    (os.path.join(cropped_dir, 'image18_cropped.png'), os.path.join(cropped_dir, 'image18_cropped.jpg'), 60),
    (os.path.join(cropped_dir, 'image22_cropped.png'), os.path.join(cropped_dir, 'image22_cropped.jpg'), 60),
    (os.path.join(cropped_dir, 'image23_cropped.png'), os.path.join(cropped_dir, 'image23_cropped.jpg'), 60)
]

# Title images
title_images = glob.glob(os.path.join(base_dir, 'project*_title.png'))
for t in title_images:
    # replace .png with .jpg
    new_path = t[:-4] + '.jpg'
    images_to_compress.append((t, new_path, 60))


for old_path, new_path, quality in images_to_compress:
    if os.path.exists(old_path):
        try:
            img = Image.open(old_path)
            rgb_img = img.convert('RGB')
            # Save as JPEG
            rgb_img.save(new_path, 'JPEG', quality=quality, optimize=True)
            # Remove original PNG to save space
            os.remove(old_path)
            print(f"Compressed {os.path.basename(old_path)} to {os.path.basename(new_path)} with quality {quality}")
        except Exception as e:
            print(f"Failed to compress {old_path}: {e}")
