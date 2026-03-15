import os
import re

html_dir = "/Users/arik/Desktop/Portfolio_coding/portfolio"

for filename in os.listdir(html_dir):
    if not filename.endswith(".html"):
        continue
    filepath = os.path.join(html_dir, filename)
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # The current src looks like: src="assets/images/cropped/image3.png"
    # We need to change it to: src="assets/images/cropped/image3_cropped.png"
    # But wait, there are JPGs etc too, and maybe they just appended `_cropped` before the extension.
    def replacer(match):
        full_path = match.group(0) # e.g. src="assets/images/cropped/image3.png"
        filename_with_ext = match.group(1) # e.g. image3.png
        
        # If it already has _cropped, don't do it again
        if "_cropped" in filename_with_ext:
            return full_path
            
        base, ext = os.path.splitext(filename_with_ext)
        new_filename = f"{base}_cropped{ext}"
        return f'src="assets/images/cropped/{new_filename}"'

    content = re.sub(r'src="assets/images/cropped/([^"]+)"', replacer, content)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

print("Fixed broken image links")
