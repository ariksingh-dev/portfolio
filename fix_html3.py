import os
import re

html_dir = "/Users/arik/Desktop/Portfolio_coding/portfolio"

for filename in os.listdir(html_dir):
    if not filename.endswith(".html"):
        continue
    filepath = os.path.join(html_dir, filename)
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Figcaptions: Remove <span class="figure-ref">Figure "..."</span>:
    # They look like: <figcaption><span class="figure-ref">Figure "BOM template"</span>: BOM Template...
    # We will regex `<figcaption>\s*<span class="figure-ref">Figure\s+"[^"]+"</span>:\s*` -> `<figcaption>`
    content = re.sub(r'<figcaption>\s*<span class="figure-ref">Figure\s+"[^"]+"</span>:\s*', '<figcaption>', content)
    
    # 2. For fergie_robot.html missing colon or figcaption:
    # Just remove `<span class="figure-ref">Figure "..."</span>:\s*` if it's orphaned. 
    # But wait! If it's orphaned and I remove it, it fixes the caption. But what if it's NOT a caption and actually in body text with a colon? Very unlikely.
    # To be safe, let's only do it if it's the start of a stripped line or follows some spaces.
    content = re.sub(r'^\s*<span class="figure-ref">Figure\s+"[^"]+"</span>:\s*', ' ', content, flags=re.MULTILINE)

    # 3. Body text references: <span class="figure-ref">Figure "..."</span> -> <span class="figure-ref">the figure below</span>
    # The user specifically asked for 'as shown in the figure below'.
    # Because my python script replaced 'Figure "X"' with `<span class="figure-ref">Figure "X"</span>`, I'm just replacing the exact text inside the span.
    content = re.sub(r'<span class="figure-ref">Figure\s+"[^"]+"</span>', r'<span class="figure-ref">the figure below</span>', content)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

print("Done")
