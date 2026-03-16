from PIL import Image, ImageFilter
import os

images_to_compress = [
    ('image12_cropped.png', 'image12_cropped.jpg'),
    ('image27_cropped.png', 'image27_cropped.jpg'),
    ('image28_cropped.png', 'image28_cropped.jpg'),
    ('image29_cropped.png', 'image29_cropped.jpg')
]

base_dir = '/Users/arik/Desktop/Portfolio_coding/portfolio/assets/images/cropped/'

for old_name, new_name in images_to_compress:
    old_path = os.path.join(base_dir, old_name)
    new_path = os.path.join(base_dir, new_name)
    if os.path.exists(old_path):
        try:
            img = Image.open(old_path)
            rgb_img = img.convert('RGB')
            # Save as JPEG
            rgb_img.save(new_path, 'JPEG', quality=85, optimize=True)
            # Remove original PNG to save space
            os.remove(old_path)
            print(f"Compressed {old_name} to {new_name}")
        except Exception as e:
            print(f"Failed to compress {old_name}: {e}")

# Sharpen image 17
path17 = os.path.join(base_dir, 'image17_cropped.png')
if os.path.exists(path17):
    try:
        img17 = Image.open(path17)
        sharpened = img17.filter(ImageFilter.SHARPEN)
        sharpened.save(path17)
        print("Sharpened image17_cropped.png")
    except Exception as e:
        print(f"Failed to sharpen image17: {e}")
