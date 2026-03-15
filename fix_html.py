import os
import re

html_dir = "/Users/arik/Desktop/Portfolio_coding/portfolio"

for filename in os.listdir(html_dir):
    if not filename.endswith(".html"):
        continue
    filepath = os.path.join(html_dir, filename)
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Replace <figcaption>Figure "Something": 
    # Allow optional spaces and sub tags
    # Example: <figcaption>Figure "v<sub>max</sub> calculation": Solving...
    # Regex: <figcaption>Figure "[^"]+":\s*
    content = re.sub(r'<figcaption>Figure\s+"[^"]+":\s*', '<figcaption>', content)
    
    # Example 2 (no colon or different formatting)
    # fergie_robot.html: Figure "Fergie robot isometric": Final Fergie
    content = re.sub(r'\s*Figure\s+"[^"]+":\s*', ' ', content) # Be careful, this replaces ANY 'Figure "..."'

    # Replace in alt attributes
    # alt="Figure &quot;vmax calculation&quot;"
    content = re.sub(r'alt="Figure &quot;(.*?)&quot;.*?"', r'alt="\1"', content)

    # In body text: Figure "Something" -> the "Something" figure
    content = re.sub(r'Figure "([^"]+)"', r'the "\1" figure', content)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

print("Done text replacements")
