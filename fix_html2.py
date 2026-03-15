import os
import re

html_dir = "/Users/arik/Desktop/Portfolio_coding/portfolio"

for filename in os.listdir(html_dir):
    if not filename.endswith(".html"):
        continue
    filepath = os.path.join(html_dir, filename)
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Wrap isolated 'Figure "something"' in span.figure-ref
    # We use a regex that matches 'Figure "something"' as long as it's not already inside a span.
    # A simple but effective way:
    # First, undo any previous mistake if any, but we just git restored.
    # Replace Figure "something" with our span.
    # To be safe, avoid replacing anything inside an alt tag. Since we use `Figure "something"` and alt tags use `Figure &quot;something&quot;`, this should be safe.
    
    def replacer(match):
        text = match.group(0)
        return f'<span class="figure-ref">{text}</span>'

    # Match Figure "..."
    # And handle special cases with non-breaking spaces or regular spaces
    content = re.sub(r'Figure\s+"[^"]+"', replacer, content)

    # Copy images to a cropped folder
    # Instead of modifying the image paths in HTML right away, wait, let's create the folder and copy all images there, then replace image src
    content = re.sub(r'src="assets/images/([^"]+)"', r'src="assets/images/cropped/\1"', content)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

print("Done text replacements and image src updates")
